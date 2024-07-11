from flask import Flask, request, jsonify
from flask_cors import CORS

from api.config import Config
from api.views import movie_blueprint
from api.models import *

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

app.register_blueprint(movie_blueprint, url_prefix='/movies')
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'UP', 'message': 'Service is healthy'})

app.run(host='0.0.0.0', port=5000, debug=True)