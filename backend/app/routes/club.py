from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields
from app.models import db, ClubInfo
from app.utils.auth import require_admin
from app.utils.validation import validate_request

club_bp = Blueprint('club', __name__)


class ClubUpdateSchema(Schema):
    name = fields.Str()
    mission = fields.Str()
    about = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    address = fields.Str()
    instagram_url = fields.Str()
    tiktok_url = fields.Str()
    banner_image_url = fields.Str()


@club_bp.route('', methods=['GET'])
def get_club():
    club = ClubInfo.get_instance()
    return jsonify(club.to_dict())


@club_bp.route('', methods=['PUT'])
@require_admin
@validate_request(ClubUpdateSchema)
def update_club(data):
    club = ClubInfo.get_instance()
    
    for key, value in data.items():
        setattr(club, key, value)
    
    db.session.commit()
    return jsonify(club.to_dict())

