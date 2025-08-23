from contextlib import asynccontextmanager

from core.db import close_db, init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, chats, users, websockets


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(chats.router)
app.include_router(websockets.router)
