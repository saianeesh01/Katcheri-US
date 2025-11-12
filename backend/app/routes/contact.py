from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate
from app.models import db, ContactMessage
from app.utils.validation import validate_request

contact_bp = Blueprint('contact', __name__)


class ContactSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    email = fields.Email(required=True)
    subject = fields.Str(validate=validate.Length(max=255))
    message = fields.Str(required=True, validate=validate.Length(min=1))


@contact_bp.route('', methods=['POST'])
@validate_request(ContactSchema)
def submit_contact(data):
    message = ContactMessage(**data)
    db.session.add(message)
    db.session.commit()
    
    return jsonify({
        'message': 'Thank you for your message. We will get back to you soon.',
        'id': message.id
    }), 201

