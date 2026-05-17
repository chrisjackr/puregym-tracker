import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import psycopg2
from dotenv import load_dotenv
from fastapi.responses import FileResponse


class GymAttedance(BaseModel):
    time: datetime
    gym_id: int
    gym_attendance: int


class GymAttedances(BaseModel):
    gym_attendances: list[GymAttedance]


app = FastAPI()

ORIGINS = [
    "http://localhost:5173",
    f"http://{os.getenv("VITE_API_HOST_ORIGIN")}:5173",
]

load_dotenv()  # loads .env from project root

DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST"),
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("PUREGYM_API_CLIENT_USER"),
    "password": os.getenv("PUREGYM_API_CLIENT_PASSWORD"),
}


def get_db():
    return psycopg2.connect(**DB_CONFIG)


def query_current_gym_attendance(conn):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT time, gym_id, gym_attendance
            FROM puregym_attendance
            ORDER BY time DESC
            LIMIT 1;
            """
        )

        row = cur.fetchone()

        if row is None:
            return None

        time, gym_id, gym_attendance = row

    return {
        "time": time,
        "gym_id": gym_id,
        "gym_attendance": gym_attendance,
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("./favicon.ico")

@app.get("/attendance", response_model=GymAttedance)
def get_current_gym_attendance():
    """Get current gym attendance."""

    conn = get_db()

    try:
        result = query_current_gym_attendance(conn)

        if result is None:
            return None

        return GymAttedance(**result)

    finally:
        conn.close()


if __name__ == "__main__":
    # host="0.0.0.0" (listen on all network interfaces)
    uvicorn.run(app, host="0.0.0.0", port=8000)