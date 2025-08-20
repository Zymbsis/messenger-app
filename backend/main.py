from contextlib import asynccontextmanager

from core.db import close_db, init_db
from fastapi import FastAPI
from routers import auth, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)
