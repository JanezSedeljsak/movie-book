from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from api.views import movie_blueprint

app = Flask(__name__)
# db = SQLAlchemy(app)
# db.init_app(app)

app.register_blueprint(movie_blueprint, url_prefix='/movies')

app.run(host='0.0.0.0', port=5000, debug=True)