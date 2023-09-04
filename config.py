import os
from dotenv import dotenv_values

config = dotenv_values(".env")

class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = config['SECRET_KEY']
    LANGUAGES = ['th', 'en']

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')

class ProductionConfig(Config):
    pass

config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)
