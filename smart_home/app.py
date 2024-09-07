from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from config import Config
from flask_migrate import Migrate
import logging

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

from models import User, MockIoTDevice, DeviceLog, TokenBlacklist

# Token Blacklist Check
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = TokenBlacklist.query.filter_by(jti=jti).first()
    return token is not None  # Returns True if token is blacklisted

# Home route
@app.route('/')
def home():
    logging.info("Home route accessed.")
    return jsonify({"message": "Smart Home Automation System Backend"})

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    logging.info(f"User registered: {data['username']}")
    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)  # Generate refresh token
        logging.info(f"User logged in: {data['username']}")
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    logging.warning(f"Failed login attempt for user: {data['username']}")
    return jsonify({"error": "Invalid credentials"}), 401

# Refresh Access Token
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    logging.info(f"Access token refreshed for user: {current_user}")
    return jsonify(access_token=new_access_token)

# Logout (Invalidate Token)
@app.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the JWT ID (jti) from the token
    blacklist_token = TokenBlacklist(jti=jti)
    db.session.add(blacklist_token)
    db.session.commit()
    logging.info(f"User with token {jti} logged out and token blacklisted")
    return jsonify({"message": "Successfully logged out"}), 200

# Add a Mock IoT Device
@app.route('/mock/devices', methods=['POST'])
@jwt_required()
def add_mock_device():
    data = request.get_json()
    device_name = data.get('name')
    device_type = data.get('device_type')

    if not device_name or not device_type:
        logging.error("Missing device name or type.")
        return jsonify({"error": "Device name and type are required"}), 400

    user_id = get_jwt_identity()
    device = MockIoTDevice(name=device_name, device_type=device_type, user_id=user_id)
    db.session.add(device)
    db.session.commit()

    logging.info(f"Mock device added: {device_name} (Type: {device_type}) by User ID: {user_id}")
    return jsonify({"message": "Mock device added successfully", "device_id": device.id}), 201

# Control a Mock IoT Device
@app.route('/mock/devices/<int:id>/control', methods=['POST'])
@jwt_required()
def control_mock_device(id):
    device = MockIoTDevice.query.get(id)
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    action = request.json.get('action')
    if action not in ['turn_on', 'turn_off', 'adjust']:
        logging.error(f"Invalid action attempted on device ID {id}: {action}")
        return jsonify({"error": "Invalid action"}), 400

    if action == 'turn_on':
        device.status = 'on'
        device.last_action = 'Device turned on'
    elif action == 'turn_off':
        device.status = 'off'
        device.last_action = 'Device turned off'
    elif action == 'adjust':
        adjustment = request.json.get('value')
        device.last_action = f'Device adjusted to {adjustment}'

    # Log the device action
    log = DeviceLog(action=device.last_action, device_id=device.id)
    db.session.add(log)
    db.session.commit()

    logging.info(f"Device {device.name} controlled: {action} by User ID: {get_jwt_identity()}")
    return jsonify({"message": "Device controlled", "status": device.status, "last_action": device.last_action})

# Get Device Status with Monitoring Logs
@app.route('/mock/devices/<int:id>/status', methods=['GET'])
@jwt_required()
def mock_device_status(id):
    device = MockIoTDevice.query.get(id)
    if not device:
        logging.error(f"Device with ID {id} not found.")
        return jsonify({"error": "Device not found"}), 404

    # Fetch recent logs for the device
    logs = [{"action": log.action, "timestamp": log.timestamp} for log in device.logs]

    logging.info(f"Status checked for device {device.name} (ID: {id})")
    return jsonify({
        "device_id": device.id,
        "name": device.name,
        "device_type": device.device_type,
        "status": device.status,
        "last_action": device.last_action,
        "logs": logs
    })

# Parental Control Settings
@app.route('/parental-control/settings', methods=['POST'])
@jwt_required()
def parental_control():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with ID {user_id} not found.")
        return jsonify({"error": "User not found"}), 404

    settings = request.json.get('settings')

    # Serialize the settings (dict -> JSON string)
    user.set_parental_controls(settings)
    db.session.commit()

    logging.info(f"Parental controls updated for User ID: {user_id}")
    return jsonify({"message": "Parental controls updated", "settings": settings})

# Get Parental Control Settings
@app.route('/parental-control/settings', methods=['GET'])
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

if __name__ == "__main__":
    app.run(debug=True)
