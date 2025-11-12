from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields
from app.models import db, MediaAsset
from app.utils.auth import require_admin
from app.utils.validation import validate_request

media_bp = Blueprint('media', __name__)


class MediaCreateSchema(Schema):
    title = fields.Str()
    description = fields.Str()
    url = fields.Str(required=True)
    alt_text = fields.Str()
    type = fields.Str()


@media_bp.route('/gallery', methods=['GET'])
def get_gallery():
    assets = MediaAsset.query.filter_by(type='image').order_by(MediaAsset.created_at.desc()).all()
    return jsonify([a.to_dict() for a in assets])


@media_bp.route('/upload', methods=['POST'])
@require_admin
@validate_request(MediaCreateSchema)
def upload_media(data):
    asset = MediaAsset(**data)
    db.session.add(asset)
    db.session.commit()
    return jsonify(asset.to_dict()), 201


@media_bp.route('/<int:asset_id>', methods=['DELETE'])
@require_admin
def delete_media(asset_id):
    asset = MediaAsset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Media deleted'}), 200

