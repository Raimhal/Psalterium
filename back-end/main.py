from fastapi import FastAPI
from routes import router
from config import dependencies
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp, Scope, Receive, Send



app = FastAPI()

origins = [
    "http://localhost",
    "http://192.168.0.108",
    "http://localhost:8060",
    "http://192.168.0.108:8060",
    "http://127.0.0.1:8060"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimpleASGIMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        await self.app(scope, receive, send)
        client = scope["client"]
        print(f"[CLIENT]: {client}")


app.add_middleware(SimpleASGIMiddleware)

dependencies.create_database()
app.include_router(router)

