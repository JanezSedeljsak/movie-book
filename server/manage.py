from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from api.models import Base, Movie, User, Rating
import pandas as pd
import numpy as np
import logging
from dotenv import load_dotenv
from faker import Faker
import os
import uuid

load_dotenv()
logging.basicConfig(level=logging.INFO)

def batch_insert(session, model_instances):
    session.bulk_save_objects(model_instances)
    session.commit()
    logging.info(f'Inserted {len(model_instances)} records.')

def insert_movies(session, movies_df):
    m_uuids_map = {}
    movies_insert_data = []
    for _, row in movies_df.iterrows():
        movie = Movie(title=row['title'], year=row['year'], 
                      img_src=str(row['imdbPictureURL']).replace('http://ia.media-imdb.com/images', 
                                                                 'https://m.media-amazon.com/images'))
        session.add(movie)
        session.flush()
        m_uuids_map[row['id']] = movie.id
        movies_insert_data.append(movie)
    batch_insert(session, movies_insert_data)
    return m_uuids_map

def insert_ratings(session, ratings_df, m_uuids_map):
    u_uuids_map = {}
    ratings_insert_data = []
    for _, row in ratings_df.iterrows():
        if row['movieID'] in m_uuids_map:
            user_id = u_uuids_map.setdefault(row['userID'], uuid.uuid4())
            rating = Rating(user_id=user_id, movie_id=m_uuids_map[row['movieID']], 
                            rating=float(row['rating']))
            ratings_insert_data.append(rating)
    batch_insert(session, ratings_insert_data)
    return u_uuids_map

def insert_users(session, u_uuids_map):
    fake = Faker()
    users_insert_data = []
    for idx, u_uuid in enumerate(u_uuids_map.values()):
        fname, lname = fake.first_name(), fake.last_name()
        users_insert_data.append(
            User(id=u_uuid, first_name=fname, last_name=lname, 
                 email=f'{fname}.{lname}{idx}@example.com', password=''))
        
    batch_insert(session, users_insert_data)

def main():
    engine = create_engine(os.getenv('DATABASE_URL'))
    Session = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)

    with Session() as session:
        movies_df = pd.read_csv('/data/movies.dat', sep="\t", encoding="windows-1250", on_bad_lines="skip")
        movies_df = movies_df[['id', 'title', 'year', 'imdbPictureURL']]
        movies_df = movies_df.drop_duplicates(subset=['title'])
        m_uuids_map = insert_movies(session, movies_df)

        ratings_df = pd.read_csv('/data/user_ratedmovies.dat', sep="\t", encoding="windows-1250", on_bad_lines="skip")
        ratings_df = ratings_df[['userID', 'movieID', 'rating']]
        u_uuids_map = insert_ratings(session, ratings_df, m_uuids_map)

        insert_users(session, u_uuids_map)

if __name__ == "__main__":
    main()