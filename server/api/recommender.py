from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
from uuid import uuid4

import pandas as pd
import numpy as np
import pickle
import os

from api.services import RedisService
from api.models import Rating

class Recommender:

    REDIS_KEY = 'recommender:path'
    EXPIRATION = 3000 # 50 minutes

    @staticmethod
    def cached_build() -> "Recommender":
        cached_path = RedisService.get(Recommender.REDIS_KEY)
        if cached_path and os.path.exists(cached_path.decode('utf-8')):
            with open(cached_path.decode('utf-8'), 'rb') as cached_file:
                predictor = pickle.load(cached_file)
                return predictor
            
        ratings = Rating.query.all()
        ratings_df = pd.DataFrame([{'movie_id': str(rating.movie_id), 
                                    'user_id': str(rating.user_id), 
                                    'rating': rating.rating} 
                                    for rating in ratings])
        
        predictor = Recommender(ratings_df)
        model_path = f'/pickles/recommender_{uuid4()}.pkl'
        with open(model_path, 'wb') as cached_file:
            pickle.dump(predictor, cached_file)

        RedisService.setex(Recommender.REDIS_KEY,  
                           Recommender.EXPIRATION, 
                           model_path)
        
        return predictor


    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.m = df.pivot(index='user_id', columns='movie_id', values='rating').fillna(0)

        m_np = self.m.to_numpy()
        k = min(50, min(m_np.shape)-1)
        U, sigma, Vt = svds(m_np, k=k)
        sigma = np.diag(sigma)

        self.predicted_ratings = np.dot(np.dot(U, sigma), Vt)
        self.predicted_ratings_df = pd.DataFrame(self.predicted_ratings, columns=self.m.columns, 
                                                 index=self.m.index)

        self.item_similarity = cosine_similarity(Vt.T)
        self.item_similarity_df = pd.DataFrame(self.item_similarity, index=self.m.columns, 
                                               columns=self.m.columns)
        
    def similar_movies(self, movie_id: str, n=8):
        similar_scores = self.item_similarity_df[movie_id].sort_values(ascending=False)
        similar_movies = similar_scores.head(n + 1).index.tolist()
        similar_movies.remove(movie_id)
        return similar_movies[:n]
    
    def recommend_for_user(self, user_id, n=8):
        user_idx = self.m.index.get_loc(user_id)
        user_ratings = self.predicted_ratings_df.iloc[user_idx].sort_values(ascending=False)
        watched_movies = self.m.loc[user_id][self.m.loc[user_id] > 0].index
        recommendations = user_ratings[~user_ratings.index.isin(watched_movies)].head(n)
        return recommendations.index.tolist()