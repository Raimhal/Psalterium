from .db import Session, Base, engine

def create_database():
    return Base.metadata.create_all(bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
