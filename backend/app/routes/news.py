from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields
from datetime import datetime
from app.models import db, NewsPost
from app.utils.auth import get_current_user, require_admin
from app.utils.validation import validate_request, PaginationSchema

news_bp = Blueprint('news', __name__)


class NewsCreateSchema(Schema):
    slug = fields.Str(required=True)
    title = fields.Str(required=True)
    excerpt = fields.Str()
    content = fields.Str()
    cover_image_url = fields.Str()
    published_at = fields.DateTime()
    status = fields.Str()


class NewsUpdateSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    excerpt = fields.Str()
    content = fields.Str()
    cover_image_url = fields.Str()
    published_at = fields.DateTime()
    status = fields.Str()


@news_bp.route('', methods=['GET'])
def list_news():
    query = NewsPost.query
    
    # Only show published posts to non-admins
    user = get_current_user()
    if not user or user.role != 'admin':
        query = query.filter(NewsPost.status == 'published')
    
    query = query.order_by(NewsPost.published_at.desc(), NewsPost.created_at.desc())
    
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [p.to_dict() for p in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages
        }
    })


@news_bp.route('/<slug>', methods=['GET'])
def get_news(slug):
    post = NewsPost.query.filter_by(slug=slug).first_or_404()
    
    user = get_current_user()
    if post.status != 'published' and (not user or user.role != 'admin'):
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify(post.to_dict())


@news_bp.route('', methods=['POST'])
@require_admin
@validate_request(NewsCreateSchema)
def create_news(data):
    if NewsPost.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': 'Post slug already exists'}), 400
    
    user = get_current_user()
    post = NewsPost(**data, author_id=user.id)
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201


@news_bp.route('/<int:post_id>', methods=['PUT'])
@require_admin
@validate_request(NewsUpdateSchema)
def update_news(data, post_id):
    post = NewsPost.query.get_or_404(post_id)
    
    for key, value in data.items():
        setattr(post, key, value)
    
    db.session.commit()
    return jsonify(post.to_dict())


@news_bp.route('/<int:post_id>', methods=['DELETE'])
@require_admin
def delete_news(post_id):
    post = NewsPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted'}), 200

