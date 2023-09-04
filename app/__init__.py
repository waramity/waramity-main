from flask import Flask, g, request, redirect, url_for
from flask_babel import Babel
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient
import os
from flask_socketio import SocketIO

from config import Config
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_login import UserMixin
from bson import ObjectId



load_dotenv()

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)

app.debug = True  # Enable debug mode
app.config.from_object(Config)

babel = Babel(app)
db = SQLAlchemy()
client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])
google_client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])


mongo_client = MongoClient('localhost', 27017)
user_db = mongo_client["user"]
feature_db = mongo_client["feature"]

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

from app.features.main import main as main_blueprint
app.register_blueprint(main_blueprint)

@babel.localeselector
def get_locale():
    if not g.get('lang_code', None):
        g.lang_code = request.accept_languages.best_match(
            app.config['LANGUAGES']) or app.config['LANGUAGES'][0]
    return g.lang_code

@app.route('/')
def index():
    if not g.get('lang_code', None):
        get_locale()
    return redirect(url_for('main.index'))
