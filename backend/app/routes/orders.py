from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields
from app.models import db, Order, OrderItem, Ticket, Cart, CartItem, TicketType
from app.utils.auth import get_current_user, require_auth
from app.utils.validation import validate_request

orders_bp = Blueprint('orders', __name__)


class CheckoutSchema(Schema):
    email = fields.Email(required=True)
    holder_name = fields.Str()
    holder_email = fields.Email()


@orders_bp.route('/preview', methods=['POST'])
def preview_order():
    """Preview order from cart"""
    user = get_current_user()
    cart = None
    
    if user:
        cart = Cart.query.filter_by(user_id=user.id).first()
    else:
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        cart = Cart.query.filter_by(session_id=session_id).first() if session_id else None
    
    if not cart or cart.items.count() == 0:
        return jsonify({'error': 'Cart is empty'}), 400
    
    subtotal = float(cart.get_total())
    fees = 0  # Can add fees later
    total = subtotal + fees
    
    return jsonify({
        'subtotal': subtotal,
        'fees': fees,
        'total': total,
        'currency': 'USD'
    })


@orders_bp.route('/checkout', methods=['POST'])
@validate_request(CheckoutSchema)
def checkout(data):
    """Create order from cart (payment will be added later)"""
    user = get_current_user()
    cart = None
    
    if user:
        cart = Cart.query.filter_by(user_id=user.id).first()
    else:
        session_id = request.headers.get('X-Session-ID') or request.cookies.get('session_id')
        cart = Cart.query.filter_by(session_id=session_id).first() if session_id else None
    
    if not cart or cart.items.count() == 0:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Validate availability
    for item in cart.items.all():
        ticket_type = TicketType.query.get(item.ticket_type_id)
        if not ticket_type.is_available():
            return jsonify({'error': f'Ticket type {ticket_type.name} is no longer available'}), 400
        if item.quantity > ticket_type.get_available_quantity():
            return jsonify({'error': f'Insufficient tickets for {ticket_type.name}'}), 400
    
    # Create order
    subtotal = float(cart.get_total())
    fees = 0
    total = subtotal + fees
    
    order = Order(
        user_id=user.id if user else None,
        email=data['email'],
        subtotal=subtotal,
        fees=fees,
        total=total,
        status='pending'  # Will be 'paid' after Stripe payment
    )
    db.session.add(order)
    db.session.flush()
    
    # Create order items and tickets
    for cart_item in cart.items.all():
        ticket_type = cart_item.ticket_type
        order_item = OrderItem(
            order_id=order.id,
            event_id=ticket_type.event_id,
            ticket_type_id=ticket_type.id,
            quantity=cart_item.quantity,
            unit_price=cart_item.unit_price
        )
        db.session.add(order_item)
        db.session.flush()
        
        # Create tickets
        holder_name = data.get('holder_name') or (f"{user.first_name} {user.last_name}" if user else None)
        holder_email = data.get('holder_email') or data['email']
        
        for _ in range(cart_item.quantity):
            ticket = Ticket(
                order_item_id=order_item.id,
                holder_name=holder_name,
                holder_email=holder_email
            )
            db.session.add(ticket)
        
        # Update ticket type sold count
        ticket_type.quantity_sold += cart_item.quantity
    
    # Clear cart
    CartItem.query.filter_by(cart_id=cart.id).delete()
    db.session.delete(cart)
    
    db.session.commit()
    
    return jsonify(order.to_dict()), 201


@orders_bp.route('', methods=['GET'])
@require_auth
def list_orders():
    user = get_current_user()
    orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@orders_bp.route('/<int:order_id>', methods=['GET'])
@require_auth
def get_order(order_id):
    user = get_current_user()
    order = Order.query.get_or_404(order_id)
    
    if order.user_id != user.id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(order.to_dict())

