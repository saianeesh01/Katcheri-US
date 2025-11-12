from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate
from app.models import db, Cart, CartItem, TicketType
from app.utils.auth import get_current_user as get_user
from app.utils.validation import validate_request

tickets_bp = Blueprint('tickets', __name__)


class AddToCartSchema(Schema):
    event_id = fields.Int(required=True)
    ticket_type_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))


@tickets_bp.route('/events/<int:event_id>/tickets', methods=['GET'])
def get_event_tickets(event_id):
    ticket_types = TicketType.query.filter_by(event_id=event_id, is_active=True).all()
    return jsonify([tt.to_dict() for tt in ticket_types])


@tickets_bp.route('/cart', methods=['POST'])
@validate_request(AddToCartSchema)
def add_to_cart(data):
    ticket_type = TicketType.query.get_or_404(data['ticket_type_id'])
    
    if not ticket_type.is_available():
        return jsonify({'error': 'Ticket type not available'}), 400
    
    if data['quantity'] > ticket_type.get_available_quantity():
        return jsonify({'error': 'Insufficient tickets available'}), 400
    
    # Get or create cart
    user = get_user()
    if user:
        cart = Cart.query.filter_by(user_id=user.id).first()
    else:
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        cart = Cart.query.filter_by(session_id=session_id).first() if session_id else None
    
    if not cart:
        cart = Cart(user_id=user.id if user else None)
        db.session.add(cart)
        db.session.flush()
    
    # Check if item already in cart
    existing_item = CartItem.query.filter_by(
        cart_id=cart.id,
        ticket_type_id=ticket_type.id
    ).first()
    
    if existing_item:
        new_quantity = existing_item.quantity + data['quantity']
        if new_quantity > ticket_type.get_available_quantity():
            return jsonify({'error': 'Insufficient tickets available'}), 400
        existing_item.quantity = new_quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            ticket_type_id=ticket_type.id,
            quantity=data['quantity'],
            unit_price=ticket_type.price
        )
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify(cart.to_dict()), 201


@tickets_bp.route('/cart', methods=['GET'])
def get_cart():
    user = get_user()
    if user:
        cart = Cart.query.filter_by(user_id=user.id).first()
    else:
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        cart = Cart.query.filter_by(session_id=session_id).first() if session_id else None
    
    if not cart:
        return jsonify({'items': [], 'subtotal': 0})
    
    return jsonify(cart.to_dict())


@tickets_bp.route('/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Verify cart ownership
    user = get_user()
    if user:
        if cart_item.cart.user_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
    else:
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        if cart_item.cart.session_id != session_id:
            return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart'}), 200

