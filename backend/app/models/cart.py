from datetime import datetime
from app.models import db
import uuid


class Cart(db.Model):
    __tablename__ = 'carts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    session_id = db.Column(db.String(255), unique=True, nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('CartItem', backref='cart', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.session_id:
            self.session_id = str(uuid.uuid4())
    
    def get_total(self):
        """Calculate cart total"""
        return sum(item.get_subtotal() for item in self.items.all())
    
    def to_dict(self):
        items = [item.to_dict() for item in self.items.all()]
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'items': items,
            'subtotal': float(self.get_total()),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False, index=True)
    ticket_type_id = db.Column(db.Integer, db.ForeignKey('ticket_types.id'), nullable=False, index=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_subtotal(self):
        """Calculate item subtotal"""
        return float(self.unit_price * self.quantity)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'ticket_type_id': self.ticket_type_id,
            'ticket_type': self.ticket_type.to_dict() if self.ticket_type else None,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'subtotal': self.get_subtotal(),
        }

