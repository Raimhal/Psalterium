from fastapi import FastAPI
from routes import router
from config import dependencies
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp, Scope, Receive, Send



app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:4000",
    "http://localhost:63342",
    "http://192.168.0.108:8080",
    "http://192.168.0.108:4000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print(app.middleware_stack.__dict__['app'].__dict__)
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

@app.get("/api/")
def i():
    return 'i'


