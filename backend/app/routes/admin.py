from flask import Blueprint, jsonify
from sqlalchemy import func
from app.models import db, Order, Event, NewsPost, User
from app.utils.auth import require_admin
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/stats', methods=['GET'])
@require_admin
def get_stats():
    """Get admin dashboard statistics"""
    now = datetime.utcnow()
    last_30_days = now - timedelta(days=30)
    
    total_orders = Order.query.count()
    recent_orders = Order.query.filter(Order.created_at >= last_30_days).count()
    total_revenue = db.session.query(func.sum(Order.total)).filter(
        Order.status == 'paid'
    ).scalar() or 0
    
    total_events = Event.query.count()
    published_events = Event.query.filter_by(status='published').count()
    
    total_posts = NewsPost.query.count()
    published_posts = NewsPost.query.filter_by(status='published').count()
    
    total_users = User.query.count()
    
    return jsonify({
        'orders': {
            'total': total_orders,
            'recent_30_days': recent_orders
        },
        'revenue': {
            'total': float(total_revenue)
        },
        'events': {
            'total': total_events,
            'published': published_events
        },
        'news': {
            'total': total_posts,
            'published': published_posts
        },
        'users': {
            'total': total_users
        }
    })

