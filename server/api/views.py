from flask import Blueprint, jsonify, request
from api.models import Movie

movie_blueprint = Blueprint('movie_blueprint', __name__)

@movie_blueprint.route('/', methods=['GET'])
def get_movies():
    return jsonify({'working': True})

@movie_blueprint.route('/top/rated', methods=['GET'])
def get_top_rated_movies():
    movies = Movie.query.all()
    movies_list = [{'id': movie.id, 'title': movie.title} for movie in movies]
    return jsonify(movies_list)