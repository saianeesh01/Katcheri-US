from datetime import datetime
from app.models import db
import uuid


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    email = db.Column(db.String(255), nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    fees = db.Column(db.Numeric(10, 2), default=0)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    status = db.Column(db.String(20), default='pending', nullable=False, index=True)  # 'pending', 'paid', 'canceled', 'refunded'
    payment_provider = db.Column(db.String(50))
    payment_intent_id = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.order_number:
            self.order_number = f"KAT-{uuid.uuid4().hex[:8].upper()}"
    
    def to_dict(self, include_items=True):
        data = {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'email': self.email,
            'subtotal': float(self.subtotal),
            'fees': float(self.fees),
            'total': float(self.total),
            'currency': self.currency,
            'status': self.status,
            'payment_provider': self.payment_provider,
            'payment_intent_id': self.payment_intent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items.all()]
        return data


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False, index=True)
    ticket_type_id = db.Column(db.Integer, db.ForeignKey('ticket_types.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Relationships
    tickets = db.relationship('Ticket', backref='order_item', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_subtotal(self):
        return float(self.unit_price * self.quantity)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'event_id': self.event_id,
            'event': self.event.to_dict() if self.event else None,
            'ticket_type_id': self.ticket_type_id,
            'ticket_type': self.ticket_type.to_dict() if self.ticket_type else None,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'subtotal': self.get_subtotal(),
            'tickets': [t.to_dict() for t in self.tickets.all()],
        }


class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    order_item_id = db.Column(db.Integer, db.ForeignKey('order_items.id'), nullable=False, index=True)
    ticket_code = db.Column(db.String(100), unique=True, nullable=False, index=True)
    holder_name = db.Column(db.String(255))
    holder_email = db.Column(db.String(255))
    checked_in = db.Column(db.Boolean, default=False, index=True)
    qr_code_url = db.Column(db.String(500))
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.ticket_code:
            self.ticket_code = f"TKT-{uuid.uuid4().hex[:12].upper()}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_item_id': self.order_item_id,
            'ticket_code': self.ticket_code,
            'holder_name': self.holder_name,
            'holder_email': self.holder_email,
            'checked_in': self.checked_in,
            'qr_code_url': self.qr_code_url,
        }

