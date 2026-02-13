from flask import request, jsonify
from marshmallow import Schema, fields, ValidationError, validate


def validate_request(schema_class):
    """Decorator to validate request data with marshmallow schema"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            try:
                schema = schema_class()
                if request.is_json:
                    data = schema.load(request.get_json())
                else:
                    data = schema.load(request.form)
                return f(data, *args, **kwargs)
            except ValidationError as err:
                return jsonify({'error': 'Validation failed', 'details': err.messages}), 400
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator


# Common validation schemas
class PaginationSchema(Schema):
    page = fields.Int(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Int(load_default=20, validate=validate.Range(min=1, max=100))

