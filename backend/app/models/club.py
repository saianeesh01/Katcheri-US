from datetime import datetime
from app.models import db


class ClubInfo(db.Model):
    __tablename__ = 'club_info'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    mission = db.Column(db.Text)
    about = db.Column(db.Text)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    address = db.Column(db.String(255))
    instagram_url = db.Column(db.String(500))
    tiktok_url = db.Column(db.String(500))
    banner_image_url = db.Column(db.String(500))
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    @classmethod
    def get_instance(cls):
        """Get or create the single club info instance"""
        instance = cls.query.first()
        if not instance:
            instance = cls()
            db.session.add(instance)
            db.session.commit()
        return instance
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'mission': self.mission,
            'about': self.about,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'instagram_url': self.instagram_url,
            'tiktok_url': self.tiktok_url,
            'banner_image_url': self.banner_image_url,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

