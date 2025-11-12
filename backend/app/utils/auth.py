from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from app.models import User


def generate_token(user_id, is_refresh=False):
    """Generate JWT token"""
    config = current_app.config
    expiration = config['JWT_REFRESH_EXPIRATION_DELTA'] if is_refresh else config['JWT_EXPIRATION_DELTA']
    
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=expiration),
        'iat': datetime.utcnow(),
        'type': 'refresh' if is_refresh else 'access'
    }
    
    return jwt.encode(
        payload,
        config['JWT_SECRET'],
        algorithm=config['JWT_ALGORITHM']
    )


def verify_token(token):
    """Verify and decode JWT token"""
    try:
        config = current_app.config
        payload = jwt.decode(
            token,
            config['JWT_SECRET'],
            algorithms=[config['JWT_ALGORITHM']]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user():
    """Get current user from JWT token in Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        token = auth_header.split(' ')[1]  # Bearer <token>
        payload = verify_token(token)
        if not payload or payload.get('type') != 'access':
            return None
        
        user = User.query.get(payload['user_id'])
        return user
    except (IndexError, AttributeError):
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    @require_auth
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

