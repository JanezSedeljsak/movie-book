from flask import Blueprint, jsonify, request as flask_request
from api.models import db, Movie, Rating
from api.services import DirectusAuthService
from sqlalchemy import func

movie_blueprint = Blueprint('movie_blueprint', __name__)

@movie_blueprint.route('/', methods=['GET'])
def get_movies():
    return jsonify({'working': True})

@movie_blueprint.route('/<id>', methods=['GET'])
def get_movie(id: str):
    movie = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.max(Rating.rating).label('maxRating'), 
                                    func.min(Rating.rating).label('minRating'), 
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(Movie.id == id)\
        .group_by(Movie.id)\
        .first()
    
    user_id = DirectusAuthService.get_user_id_from_auth_token()
    movie_rating_by_user = Rating.query.filter(Rating.user_id == user_id, Rating.movie_id == id).first()
    user_rating = movie_rating_by_user.rating if movie_rating_by_user is not None else None
    
    return jsonify({
        **Movie.searilize_movie_with_rating(movie),
        'maxRating': movie.maxRating,
        'minRating': movie.minRating,
        'userRating': user_rating
    })

@movie_blueprint.route('/watched', methods=['GET'])
def get_watched_movies():
    user_id = DirectusAuthService.get_user_id_from_auth_token()
    if user_id is None:
        return jsonify({'error': 'User not authenticated'}), 401

    limit = flask_request.args.get('limit', default=8, type=int)
    viewed_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(Rating.user_id == user_id)\
        .group_by(Movie.id)\
        .limit(limit)\
        .all()
    
    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        viewed_movies
    )))
        

@movie_blueprint.route('/top/rated', methods=['GET'])
def get_top_rated_movies():
    rated_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .group_by(Movie.id)\
        .having(func.count(Movie.id) >= 100)\
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
        .having(func.count(Movie.id) >= 100)\
        .order_by(func.count(Movie.id).desc())\
        .limit(8)\
        .all()
    
    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        rated_movies
    )))