from datetime import datetime
from app.models import db


class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    subtitle = db.Column(db.String(255))
    description = db.Column(db.Text)
    venue = db.Column(db.String(255))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(50))
    zip = db.Column(db.String(20))
    start_datetime = db.Column(db.DateTime, nullable=False, index=True)
    end_datetime = db.Column(db.DateTime)
    cover_image_url = db.Column(db.String(500))
    status = db.Column(db.String(20), default='draft', nullable=False, index=True)  # 'draft', 'published', 'archived'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    ticket_types = db.relationship('TicketType', backref='event', lazy='dynamic', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='event', lazy='dynamic')
    
    def to_dict(self, include_tickets=False):
        data = {
            'id': self.id,
            'slug': self.slug,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'venue': self.venue,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'start_datetime': self.start_datetime.isoformat() if self.start_datetime else None,
            'end_datetime': self.end_datetime.isoformat() if self.end_datetime else None,
            'cover_image_url': self.cover_image_url,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_tickets:
            data['ticket_types'] = [tt.to_dict() for tt in self.ticket_types.filter_by(is_active=True).all()]
        return data

