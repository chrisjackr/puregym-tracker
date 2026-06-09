from datetime import datetime
import os
import psycopg2
from dotenv import load_dotenv


load_dotenv()  # loads .env from project root

DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST"),
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("PUREGYM_API_CLIENT_USER"),
    "password": os.getenv("PUREGYM_API_CLIENT_PASSWORD"),
}


def get_db():
    return psycopg2.connect(**DB_CONFIG)


def query_current_gym_attendance_now(conn, gym_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT time, gym_id, gym_attendance
            FROM puregym_attendance
            WHERE gym_id = %s
            ORDER BY time DESC
            LIMIT 1;
            """, (gym_id,)
        )

        row = cur.fetchone()

        if row is None:
            return None

        time, _, gym_attendance = row

        data = [{
            "time": time,
            "gym_attendance": gym_attendance
        }]

    return {
        "gym_id": gym_id,
        "data": data,
    }

def query_current_gym_attendance(conn, gym_id: int, start: datetime, end: datetime):
    start = start.strftime("%Y-%m-%d %H:%M:%S")
    end = end.strftime("%Y-%m-%d %H:%M:%S")
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT time, gym_id, gym_attendance
            FROM puregym_attendance
            ORDER BY time ASC
            WHERE gym_id = %s
            AND time >= %s AND time <= %s;
            """, (gym_id, start, end)
        )

        rows = cur.fetchall()

        data: list[dict[str, str | int]] = []
        for row in rows:
            if row is None:
                pass
            time, _, gym_attendance = row
            data.append({
                "time": time,
                "gym_attendance": gym_attendance
            })

    return {
        "gym_id": gym_id,
        "data": data,
    }