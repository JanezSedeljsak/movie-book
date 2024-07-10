from flask import Blueprint, jsonify, request
from api.models import db, Movie, Rating
from sqlalchemy import func

movie_blueprint = Blueprint('movie_blueprint', __name__)

@movie_blueprint.route('/', methods=['GET'])
def get_movies():
    return jsonify({'working': True})

@movie_blueprint.route('/top/rated', methods=['GET'])
def get_top_rated_movies():
    rated_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .group_by(Movie.id)\
        .having(func.count(Movie.id) >= 50)\
        .order_by(func.avg(Rating.rating).desc())\
        .limit(8)\
        .all()
    
    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        rated_movies
    )))

@movie_blueprint.route('/top/watched', methods=['GET'])
def get_most_watched_movies():
    rated_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .group_by(Movie.id)\
        .having(func.count(Movie.id) >= 50)\
        .order_by(func.count(Movie.id).desc())\
        .limit(8)\
        .all()
    
    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        rated_movies
    )))