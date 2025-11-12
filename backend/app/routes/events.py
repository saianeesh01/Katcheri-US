from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields
from datetime import datetime
from app.models import db, Event, TicketType
from app.utils.auth import get_current_user, require_admin
from app.utils.validation import validate_request, PaginationSchema

events_bp = Blueprint('events', __name__)


class EventCreateSchema(Schema):
    slug = fields.Str(required=True)
    title = fields.Str(required=True)
    subtitle = fields.Str()
    description = fields.Str()
    venue = fields.Str()
    address = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zip = fields.Str()
    start_datetime = fields.DateTime(required=True)
    end_datetime = fields.DateTime()
    cover_image_url = fields.Str()
    status = fields.Str()


class EventUpdateSchema(Schema):
    slug = fields.Str()
    title = fields.Str()
    subtitle = fields.Str()
    description = fields.Str()
    venue = fields.Str()
    address = fields.Str()
    city = fields.Str()
    state = fields.Str()
    zip = fields.Str()
    start_datetime = fields.DateTime()
    end_datetime = fields.DateTime()
    cover_image_url = fields.Str()
    status = fields.Str()


@events_bp.route('', methods=['GET'])
def list_events():
    query = Event.query
    
    # Filters
    q = request.args.get('q')
    if q:
        query = query.filter(
            (Event.title.contains(q)) |
            (Event.description.contains(q))
        )
    
    date_from = request.args.get('date_from')
    if date_from:
        try:
            date_from_dt = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
            query = query.filter(Event.start_datetime >= date_from_dt)
        except ValueError:
            pass
    
    date_to = request.args.get('date_to')
    if date_to:
        try:
            date_to_dt = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
            query = query.filter(Event.start_datetime <= date_to_dt)
        except ValueError:
            pass
    
    venue = request.args.get('venue')
    if venue:
        query = query.filter(Event.venue.contains(venue))
    
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    if min_price or max_price:
        # Filter by ticket prices
        ticket_query = TicketType.query
        if min_price:
            ticket_query = ticket_query.filter(TicketType.price >= float(min_price))
        if max_price:
            ticket_query = ticket_query.filter(TicketType.price <= float(max_price))
        event_ids = [tt.event_id for tt in ticket_query.all()]
        query = query.filter(Event.id.in_(event_ids))
    
    # Only show published events to non-admins
    user = get_current_user()
    if not user or user.role != 'admin':
        query = query.filter(Event.status == 'published')
    
    # Order by start_datetime
    query = query.order_by(Event.start_datetime.asc())
    
    # Pagination
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'events': [e.to_dict(include_tickets=False) for e in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages
        }
    })


@events_bp.route('/<slug>', methods=['GET'])
def get_event(slug):
    event = Event.query.filter_by(slug=slug).first_or_404()
    
    # Check if user can view draft/archived events
    user = get_current_user()
    if event.status != 'published' and (not user or user.role != 'admin'):
        return jsonify({'error': 'Event not found'}), 404
    
    return jsonify(event.to_dict(include_tickets=True))


@events_bp.route('', methods=['POST'])
@require_admin
@validate_request(EventCreateSchema)
def create_event(data):
    if Event.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': 'Event slug already exists'}), 400
    
    event = Event(**data)
    db.session.add(event)
    db.session.commit()
    
    return jsonify(event.to_dict()), 201


@events_bp.route('/<int:event_id>', methods=['PUT'])
@require_admin
@validate_request(EventUpdateSchema)
def update_event(data, event_id):
    event = Event.query.get_or_404(event_id)
    
    for key, value in data.items():
        setattr(event, key, value)
    
    db.session.commit()
    return jsonify(event.to_dict())


@events_bp.route('/<int:event_id>', methods=['DELETE'])
@require_admin
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'}), 200

