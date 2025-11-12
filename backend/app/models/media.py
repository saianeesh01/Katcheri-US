from datetime import datetime
from app.models import db


class MediaAsset(db.Model):
    __tablename__ = 'media_assets'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255))
    type = db.Column(db.String(20), default='image', index=True)  # 'image' or 'video'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'url': self.url,
            'alt_text': self.alt_text,
            'type': self.type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

