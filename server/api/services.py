from flask import request as flask_request
import requests
import redis
import os

redis_uri = os.getenv('REDIS_URI', 'localhost')
RedisService = redis.Redis(host=redis_uri, port=6379)

class DirectusAuthService:

    @staticmethod
    def get_user_id_from_auth_token():
        auth_header = flask_request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        auth_token = auth_header.split(' ')[1]

        directus_uri = os.getenv('DIRECTUS_URI')
        response = requests.get(f"{directus_uri}/users/me", headers={"Authorization": f"Bearer {auth_token}"})
        if response.status_code != 200:
            return None
        
        user_info = response.json()
        return user_info.get('data', {}).get('id', None)