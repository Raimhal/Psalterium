from fastapi import FastAPI
from routes import router
from config import dependencies

app = FastAPI()
dependencies.create_database()
# dependencies.set_data_seed()
app.include_router(router)



