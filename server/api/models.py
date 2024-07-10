from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
import os

db = SQLAlchemy()
Base = db.Model

class Movie(Base):
    __tablename__ = 'movies'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String)
    year = db.Column(db.Integer)
    img_src = db.Column(db.String)

    @staticmethod
    def searilize_movie_with_rating(data):
        return {
            'id': data.id,
            'title': data.title,
            'year': data.year,
            'imgSrc': data.imgSrc,
            'avgRating': data.avgRating,
            'numberOfRatings': data.numberOfRatings
        }


class User(Base):
    __tablename__ = 'directus_users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)

class Rating(Base):
    __tablename__ = 'ratings'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True))
    movie_id = db.Column(UUID(as_uuid=True))
    rating = db.Column(db.Float)
