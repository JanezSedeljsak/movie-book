import os

class Config:
    HOST = 'database'
    DB_NAME = os.getenv('POSTGRES_DB')
    DB_USER = os.getenv('POSTGRES_USER')
    DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{HOST}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False