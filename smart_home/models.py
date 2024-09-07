from app import db
from datetime import datetime
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    parental_controls = db.Column(db.Text, nullable=True)  # Store as JSON string in Text
    is_admin = db.Column(db.Boolean, default=False)  # Add is_admin field

    def set_parental_controls(self, controls_dict):
        """Serialize the dictionary as a JSON string before storing it."""
        self.parental_controls = json.dumps(controls_dict)

    def get_parental_controls(self):
        """Deserialize the JSON string back into a dictionary."""
        return json.loads(self.parental_controls) if self.parental_controls else {}
    
class MockIoTDevice(db.Model):
    __tablename__ = 'mock_iot_device'  # Ensure the table name is correctly set
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(10), default='off')
    last_action = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('mock_devices', lazy=True))

class DeviceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    device_id = db.Column(db.Integer, db.ForeignKey('mock_iot_device.id'), nullable=False)  # Correct foreign key reference
    device = db.relationship('MockIoTDevice', backref=db.backref('logs', lazy=True))

class TokenBlacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), nullable=False)  # 'jti' is the unique identifier for a JWT token

    def __init__(self, jti):
        self.jti = jti