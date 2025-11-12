from flask import Blueprint, jsonify
from app.models import ClubInfo

social_bp = Blueprint('social', __name__)


@social_bp.route('/instagram', methods=['GET'])
def get_instagram():
    """Get Instagram URL for embedding"""
    club = ClubInfo.get_instance()
    return jsonify({
        'url': club.instagram_url,
        'embed_url': club.instagram_url  # Can be enhanced with oEmbed API later
    })


@social_bp.route('/tiktok', methods=['GET'])
def get_tiktok():
    """Get TikTok URL for embedding"""
    club = ClubInfo.get_instance()
    return jsonify({
        'url': club.tiktok_url,
        'embed_url': club.tiktok_url  # Can be enhanced with oEmbed API later
    })

