from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.config import Config
from app.models import db
from app.routes import register_blueprints


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']))
    
    # Register blueprints
    register_blueprints(app)
    
    return app

