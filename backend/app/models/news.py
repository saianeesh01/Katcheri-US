from datetime import datetime
from app.models import db


class NewsPost(db.Model):
    __tablename__ = 'news_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    excerpt = db.Column(db.Text)
    content = db.Column(db.Text)
    cover_image_url = db.Column(db.String(500))
    published_at = db.Column(db.DateTime, index=True)
    status = db.Column(db.String(20), default='draft', nullable=False, index=True)  # 'draft' or 'published'
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'title': self.title,
            'excerpt': self.excerpt,
            'content': self.content,
            'cover_image_url': self.cover_image_url,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'status': self.status,
            'author_id': self.author_id,
            'author': self.author.to_dict() if self.author else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

