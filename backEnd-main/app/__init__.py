from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config
from flask_bcrypt import Bcrypt  # Import Bcrypt



# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()  # Initialize Bcrypt


def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}}, 
         methods=["GET", "POST", "DELETE", "PUT", "OPTIONS"])

    # Load configurations
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)  # Initialize Bcrypt with the app


    # Import and register routes
    from app.routes import routes  # Use a relative import to get the routes
    app.register_blueprint(routes)  # Register the blueprint


    return app
    