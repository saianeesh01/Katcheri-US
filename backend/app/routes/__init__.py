from app.routes.auth import auth_bp
from app.routes.events import events_bp
from app.routes.tickets import tickets_bp
from app.routes.orders import orders_bp
from app.routes.news import news_bp
from app.routes.club import club_bp
from app.routes.media import media_bp
from app.routes.contact import contact_bp
from app.routes.social import social_bp
from app.routes.admin import admin_bp


def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(events_bp, url_prefix='/api/v1/events')
    app.register_blueprint(tickets_bp, url_prefix='/api/v1')
    app.register_blueprint(orders_bp, url_prefix='/api/v1/orders')
    app.register_blueprint(news_bp, url_prefix='/api/v1/news')
    app.register_blueprint(club_bp, url_prefix='/api/v1/club')
    app.register_blueprint(media_bp, url_prefix='/api/v1/media')
    app.register_blueprint(contact_bp, url_prefix='/api/v1/contact')
    app.register_blueprint(social_bp, url_prefix='/api/v1/social')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')

