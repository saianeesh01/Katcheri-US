from datetime import datetime
from app.models import db


class TicketType(db.Model):
    __tablename__ = 'ticket_types'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    quantity_total = db.Column(db.Integer, nullable=False)
    quantity_sold = db.Column(db.Integer, default=0)
    sales_start = db.Column(db.DateTime)
    sales_end = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    cart_items = db.relationship('CartItem', backref='ticket_type', lazy='dynamic')
    order_items = db.relationship('OrderItem', backref='ticket_type', lazy='dynamic')
    
    def get_available_quantity(self):
        """Get remaining available tickets"""
        return max(0, self.quantity_total - self.quantity_sold)
    
    def is_available(self):
        """Check if ticket type is available for purchase"""
        if not self.is_active:
            return False
        if self.get_available_quantity() <= 0:
            return False
        from datetime import datetime
        now = datetime.utcnow()
        if self.sales_start and now < self.sales_start:
            return False
        if self.sales_end and now > self.sales_end:
            return False
        return True
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'currency': self.currency,
            'quantity_total': self.quantity_total,
            'quantity_sold': self.quantity_sold,
            'quantity_available': self.get_available_quantity(),
            'sales_start': self.sales_start.isoformat() if self.sales_start else None,
            'sales_end': self.sales_end.isoformat() if self.sales_end else None,
            'is_active': self.is_active,
            'is_available': self.is_available(),
        }

