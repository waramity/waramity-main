from flask import Flask, g, request, redirect, url_for
from flask_babel import Babel
import os

from config import Config
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)

app.debug = False
app.config.from_object(Config)

babel = Babel(app)

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
