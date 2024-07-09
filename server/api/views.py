from flask import Blueprint, jsonify, request

movie_blueprint = Blueprint('movie_blueprint', __name__)

@movie_blueprint.route('/', methods=['GET'])
def get_movies():
    return jsonify({'working': True})