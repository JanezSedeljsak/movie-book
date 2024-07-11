from flask import Blueprint, jsonify, request as flask_request
from api.models import db, Movie, Rating
from api.services import DirectusAuthService
from api.recommender import Recommender
from sqlalchemy import and_, func
import uuid

movie_blueprint = Blueprint('movie_blueprint', __name__)

@movie_blueprint.route('/', methods=['GET'])
def get_movies():
    title_query = str(flask_request.args.get('title', default='', type=str)).lower()
    order_query = str(flask_request.args.get('order', default='ascending', type=str)).lower()
    is_ascending = order_query == 'ascending'
    order_field_query = str(flask_request.args.get('order_field', default='title', type=str)).lower()

    query_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(func.lower(Movie.title).like(f"%{title_query}%"))\
        .group_by(Movie.id)
    
    order_column_map = {
        'title': Movie.title,
        'year': Movie.year,
        'rating': func.avg(Rating.rating)
    }

    if order_field_query not in order_column_map:
        return jsonify({'error': f'INVALID_ORDER_FIELD_QUERY ({order_field_query})'}), 400
    
    if is_ascending:
        query_movies = query_movies.order_by(order_column_map[order_field_query])
    else:   
        query_movies = query_movies.order_by(order_column_map[order_field_query].desc())

    movies = query_movies.limit(16).all()
    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        movies
    )))

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

    limit_query = flask_request.args.get('limit', default=8, type=int)
    title_query = str(flask_request.args.get('title', default='', type=str)).lower()

    viewed_movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(and_(Rating.user_id == user_id, func.lower(Movie.title).like(f"%{title_query}%")))\
        .group_by(Movie.id)\
        .limit(limit_query)\
        .all()

    viewed_ids = [row.id for row in viewed_movies]
    movie_stats = db.session.query(Movie.id, func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(Rating.movie_id.in_(viewed_ids))\
        .group_by(Movie.id)\
        .all()
    
    movie_stats_map = {
        stat.id: {
            'avgRating': stat.avgRating, 
            'numberOfRatings': stat.numberOfRatings
        }
        for stat in movie_stats
    }
    
    return jsonify([
        {**Movie.searilize_movie_with_rating(movie), **movie_stats_map[movie.id]}
        for movie in viewed_movies
    ])
        

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


@movie_blueprint.route('/top/similar/<movie_id>', methods=['GET'])
def get_most_similar_movies(movie_id: str):
    predictor = Recommender.cached_build()
    similar_movie_ids = predictor.similar_movies(movie_id)
    uuid_ids = [uuid.UUID(movie_id) for movie_id in similar_movie_ids]

    movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(Movie.id.in_(uuid_ids))\
        .group_by(Movie.id)\
        .all()
    
    movies_map = {str(movie.id): movie for movie in movies}
    result = [movies_map[movie_id] for movie_id in similar_movie_ids]

    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        result
    )))


@movie_blueprint.route('/top/recommendations', methods=['GET'])
def get_recommended_movies():
    user_id = DirectusAuthService.get_user_id_from_auth_token()
    if user_id is None:
        return jsonify({'error': 'User not authenticated'}), 401

    predictor = Recommender.cached_build()
    rec_movie_ids = predictor.recommend_for_user(user_id)
    uuid_ids = [uuid.UUID(movie_id) for movie_id in rec_movie_ids]

    movies = db.session.query(Movie.id, Movie.title, Movie.year, Movie.img_src.label('imgSrc'), 
                                    func.avg(Rating.rating).label('avgRating'),
                                    func.count(Movie.id).label('numberOfRatings'))\
        .join(Rating, Movie.id == Rating.movie_id)\
        .where(Movie.id.in_(uuid_ids))\
        .group_by(Movie.id)\
        .all()
    
    movies_map = {str(movie.id): movie for movie in movies}
    result = [movies_map[movie_id] for movie_id in rec_movie_ids]

    return jsonify(list(map(
        Movie.searilize_movie_with_rating,
        result
    )))