from fastapi import FastAPI
from routes import router
from config import dependencies

app = FastAPI()

dependencies.create_database()

app.include_router(router)



if __name__ == "__main__":
    app.run(debug=True)