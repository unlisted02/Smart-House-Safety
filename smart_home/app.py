from functools import wraps
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from config import Config
from flask_migrate import Migrate
import logging
from flask_cors import CORS
import random

logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

from models import User, MockIoTDevice, DeviceLog, TokenBlacklist


# Token Blacklist Check
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlacklist.query.filter_by(jti=jti).first()
    return token is not None  # Returns True if token is blacklisted


# Admin-only decorator
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            logging.warning(f"Unauthorized access attempt by User ID: {user_id}")
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper


# Get All Users (Admin)
@app.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    users = User.query.all()
    users_list = [
        {
            "id": user.id,
            "username": user.username,
            "parental_controls": user.get_parental_controls(),
        }
        for user in users
    ]
    logging.info("All users fetched")
    return jsonify(users_list), 200


# Get User Details (Admin)
@app.route("/users/<int:id>", methods=["GET"])
@admin_required
def get_user_details(id):
    user = User.query.get(id)
    if not user:
        logging.error(f"User with ID {id} not found.")
        return jsonify({"error": "User not found"}), 404

    user_details = {
        "id": user.id,
        "username": user.username,
        "parental_controls": user.get_parental_controls(),
    }
    logging.info(f"Details fetched for user ID: {id}")
    return jsonify(user_details), 200


# Get Current User Details
@app.route("/users/me", methods=["GET"])
@jwt_required()
def get_current_user_details():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with ID {user_id} not found.")
        return jsonify({"error": "User not found"}), 404

    user_details = {"id": user.id, "username": user.username}
    logging.info(f"Details fetched for user ID: {user_id}")
    return jsonify(user_details), 200


# Update User Details (Admin)
@app.route("/users/<int:id>", methods=["PUT"])
@admin_required
def update_user_details(id):
    user = User.query.get(id)
    if not user:
        logging.error(f"User with ID {id} not found.")
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username:
        user.username = username
    if password:
        user.password = bcrypt.generate_password_hash(password).decode("utf-8")

    db.session.commit()
    logging.info(f"User ID {id} updated")
    return jsonify({"message": "User updated successfully"}), 200


# Delete User (Admin)
@app.route("/users/<int:id>", methods=["DELETE"])
@admin_required
def delete_user(id):
    user = User.query.get(id)
    if not user:
        logging.error(f"User with ID {id} not found.")
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    logging.info(f"User ID {id} deleted")
    return jsonify({"message": "User deleted successfully"}), 200


# Home route
@app.route("/")
def home():
    logging.info("Home route accessed.")
    return jsonify({"message": "Smart Home Automation System Backend"})


# User Registration
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(username=data["username"], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    logging.info(f"User registered: {data['username']}")
    return jsonify({"message": "User registered successfully"}), 201


# User Login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()
    if user and bcrypt.check_password_hash(user.password, data["password"]):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)  # Generate refresh token
        logging.info(f"User logged in: {data['username']}")
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    logging.warning(f"Failed login attempt for user: {data['username']}")
    return jsonify({"error": "Invalid credentials"}), 401


# Refresh Access Token
@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    logging.info(f"Access token refreshed for user: {current_user}")
    return jsonify(access_token=new_access_token)


# Logout (Invalidate Token)
@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the JWT ID (jti) from the token
    blacklist_token = TokenBlacklist(jti=jti)
    db.session.add(blacklist_token)
    db.session.commit()
    logging.info(f"User with token {jti} logged out and token blacklisted")
    return jsonify({"message": "Successfully logged out"}), 200

# Add a Mock IoT Device
@app.route("/mock/devices", methods=["POST"])
@jwt_required()
def add_mock_device():
    data = request.get_json()
    device_name = data.get("name")
    device_type = data.get("device_type")
    location = data.get("location")

    if not device_name or not device_type or not location:
        logging.error("Missing device name, type, or location.")
        return jsonify({"error": "Device name, type, and location are required"}), 400

    user_id = get_jwt_identity()
    device = MockIoTDevice(name=device_name, device_type=device_type, location=location, user_id=user_id)
    db.session.add(device)
    db.session.commit()

    logging.info(
        f"Mock device added: {device_name} (Type: {device_type}, Location: {location}) by User ID: {user_id}"
    )
    return (
        jsonify({"message": "Mock device added successfully", "device_id": device.id}),
        201,
    )
    

# Fetch all Mock IoT Devices
@app.route("/mock/devices", methods=["GET"])
@jwt_required()
def get_all_mock_devices():
    user_id = get_jwt_identity()
    devices = MockIoTDevice.query.filter_by(user_id=user_id).all()
    devices_list = [
        {
            "id": device.id,
            "name": device.name,
            "device_type": device.device_type,
            "status": device.status,
            "last_action": device.last_action,
        }
        for device in devices
    ]
    logging.info(f"All devices fetched for User ID: {user_id}")
    return jsonify(devices_list), 200


# Control a Mock IoT Device
@app.route("/mock/devices/<int:id>/control", methods=["POST"])
@jwt_required()
def control_mock_device(id):
    device = MockIoTDevice.query.get(id)
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    action = request.json.get("action")
    if action not in ["turn_on", "turn_off", "adjust"]:
        logging.error(f"Invalid action attempted on device ID {id}: {action}")
        return jsonify({"error": "Invalid action"}), 400

    if action == "turn_on":
        device.status = "on"
        device.last_action = "Device turned on"
    elif action == "turn_off":
        device.status = "off"
        device.last_action = "Device turned off"
    elif action == "adjust":
        adjustment = request.json.get("value")
        device.last_action = f"Device adjusted to {adjustment}"

    # Log the device action
    log = DeviceLog(action=device.last_action, device_id=device.id)
    db.session.add(log)
    db.session.commit()

    logging.info(
        f"Device {device.name} controlled: {action} by User ID: {get_jwt_identity()}"
    )
    return jsonify(
        {
            "message": "Device controlled",
            "status": device.status,
            "last_action": device.last_action,
        }
    )


# Get Device Status with Monitoring Logs
@app.route("/mock/devices/<int:id>/status", methods=["GET"])
@jwt_required()
def mock_device_status(id):
    device = MockIoTDevice.query.get(id)
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    # Fetch recent logs for the device
    logs = [{"action": log.action, "timestamp": log.timestamp} for log in device.logs]

    logging.info(f"Status checked for device {device.name} (ID: {id})")
    return jsonify(
        {
            "device_id": device.id,
            "name": device.name,
            "device_type": device.device_type,
            "status": device.status,
            "last_action": device.last_action,
            "logs": logs,
        }
    )


# Update a Mock IoT Device
@app.route("/mock/devices/<int:id>", methods=["PUT"])
@jwt_required()
def update_mock_device(id):
    device = MockIoTDevice.query.get(id)
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    data = request.get_json()
    device_name = data.get("name")
    device_type = data.get("device_type")
    location = data.get("location")

    if device_name:
        device.name = device_name
    if device_type:
        device.device_type = device_type
    if location:
        device.location = location

    db.session.commit()

    logging.info(
        f"Device {device.name} (ID: {id}) updated by User ID: {get_jwt_identity()}"
    )
    return (
        jsonify(
            {
                "message": "Device updated successfully",
                "device": {
                    "id": device.id,
                    "name": device.name,
                    "device_type": device.device_type,
                    "status": device.status,
                    "last_action": device.last_action,
                    "location": device.location,
                },
            }
        ),
        200,
    )
    

# Delete a Mock IoT Device
@app.route("/mock/devices/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_mock_device(id):
    device = MockIoTDevice.query.get(id)

    # Log if the device was not found
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    # Log the deletion process
    logging.info(f"Deleting device: {device.name} (ID: {id})")

    db.session.delete(device)
    db.session.commit()

    logging.info(f"Device with ID {id} deleted successfully.")
    return jsonify({"message": "Device deleted successfully"}), 200


# Temperature Controller
@app.route("/temperature", methods=["GET"])
@jwt_required()
def get_temperature():
    temperature = round(
        random.uniform(18.0, 26.0), 2
    )  # Generate a random temperature between 18 and 26 degrees Celsius
    logging.info(f"Temperature reading: {temperature}°C")
    return jsonify({"temperature": temperature})


# Parental Control Settings Endpoint
@app.route('/parental-control/settings', methods=['POST'])
@jwt_required()
def update_parental_control_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with ID {user_id} not found.")
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    logging.info(f"Received data: {data}")
    if not data:
        logging.error("Invalid input")
        return jsonify({"error": "Invalid input"}), 422

    settings = data.get('settings')
    if not settings:
        logging.error("Settings not provided")
        return jsonify({"error": "Settings not provided"}), 422

    logging.info(f"Updating parental controls for user ID {user_id} with settings: {settings}")
    user.set_parental_controls(settings)
    db.session.commit()
    logging.info(f"Parental controls updated for user ID {user_id}")
    return jsonify({"message": "Parental control settings updated successfully", "settings": settings}), 200

# Get Parental Control Settings
@app.route("/parental-control/settings", methods=["GET"])
@jwt_required()
def get_parental_control():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with ID {user_id} not found.")
        return jsonify({"error": "User not found"}), 404

    # Deserialize and return the parental controls as a dictionary
    settings = user.get_parental_controls()

    logging.info(f"Parental controls retrieved for User ID: {user_id}")
    return jsonify({"message": "Parental controls retrieved", "settings": settings})


# Get All Device Logs
@app.route("/logs", methods=["GET"])
@jwt_required()
def get_all_logs():
    logs = DeviceLog.query.all()
    logs_list = [
        {
            "id": log.id,
            "action": log.action,
            "timestamp": log.timestamp,
            "device_id": log.device_id,
        }
        for log in logs
    ]
    logging.info("All device logs fetched")
    return jsonify(logs_list), 200


# Get Logs for a Specific Device
@app.route("/logs/<int:device_id>", methods=["GET"])
@jwt_required()
def get_device_logs(device_id):
    device = MockIoTDevice.query.get(device_id)
    if not device:
        logging.error(f"Device with ID {device_id} not found.")
        return jsonify({"error": "Device not found"}), 404

    logs = DeviceLog.query.filter_by(device_id=device_id).all()
    logs_list = [
        {
            "id": log.id,
            "action": log.action,
            "timestamp": log.timestamp,
            "device_id": log.device_id,
        }
        for log in logs
    ]
    logging.info(f"Logs fetched for device ID: {device_id}")
    return jsonify(logs_list), 200

# Verify Password Endpoint
@app.route('/verify-password', methods=['POST'])
@jwt_required()
def verify_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    data = request.get_json()
    current_password = data.get('currentPassword')

    if bcrypt.check_password_hash(user.password, current_password):
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "message": "Incorrect password"}), 401

# Update User Endpoint
@app.route('/update-user', methods=['PUT'])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username:
        user.username = username
    if password:
        user.password = bcrypt.generate_password_hash(password).decode('utf-8')

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

# Fetch Mock IoT Devices by Location
@app.route("/mock/devices/location/<location>", methods=["GET"])
@jwt_required()
def get_devices_by_location(location):
    user_id = get_jwt_identity()
    devices = MockIoTDevice.query.filter_by(user_id=user_id, location=location).all()
    devices_list = [
        {
            "id": device.id,
            "name": device.name,
            "device_type": device.device_type,
            "status": device.status,
            "last_action": device.last_action,
            "location": device.location,
        }
        for device in devices
    ]
    logging.info(f"Devices fetched for User ID: {user_id} at location: {location}")
    return jsonify(devices_list), 200
if __name__ == "__main__":
    app.run(debug=True)
