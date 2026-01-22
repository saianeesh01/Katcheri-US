from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate
from app.models import db, User
from app.utils.auth import generate_token, get_current_user, require_auth
from app.utils.validation import validate_request

auth_bp = Blueprint('auth', __name__)


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    first_name = fields.Str()
    last_name = fields.Str()
    role = fields.Str(validate=validate.OneOf(['user', 'admin']))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


@auth_bp.route('/register', methods=['POST'])
@validate_request(RegisterSchema)
def register(data):
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(
        email=data['email'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        role=data.get('role', 'user')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = generate_token(user.id)
    refresh_token = generate_token(user.id, is_refresh=True)
    
    return jsonify({
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
@validate_request(LoginSchema)
def login(data):
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = generate_token(user.id)
    refresh_token = generate_token(user.id, is_refresh=True)
    
    return jsonify({
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    })


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    refresh_token = request.json.get('refresh_token')
    if not refresh_token:
        return jsonify({'error': 'Refresh token required'}), 400
    
    from app.utils.auth import verify_token
    payload = verify_token(refresh_token)
    
    if not payload or payload.get('type') != 'refresh':
        return jsonify({'error': 'Invalid refresh token'}), 401
    
    user = User.query.get(payload['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    access_token = generate_token(user.id)
    
    return jsonify({
        'access_token': access_token
    })


@auth_bp.route('/me', methods=['GET'])
@require_auth
def me():
    user = get_current_user()
    return jsonify({'user': user.to_dict()})

