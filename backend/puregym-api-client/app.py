
import os
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv
from pprint import pprint
import asyncio

import psycopg2
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger
from puregym_attendance import PuregymAPIClient


DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST"),
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("PUREGYM_API_CLIENT_USER"),
    "password": os.getenv("PUREGYM_API_CLIENT_PASSWORD"),
}

# Methods
# -------
# print('get_gym_attendance:', client.get_gym_attendance())
# print('get_list_of_gyms:', client.gyms)
# print('get_gym:', client.get_gym(gym_name='exeter'))
# print('get_home_gym', client.get_home_gym())
# print('get_member_activity:', client.get_member_activity())

def get_gym_attendance(client, gym):
    try:
        return client.gyms[gym], client.get_gym_attendance(gym)
    except Exception as err:
        status = getattr(err.response, "status_code", None)
        if status == 404:
            print(f"{gym} endpoint cannot be reached.")
        else:
            raise

def get_db():
    return psycopg2.connect(**DB_CONFIG)

def insert_data(conn, rows):
    with conn.cursor() as cur:
        cur.executemany(
            """
            INSERT INTO puregym_attendance (time, gym_id, gym_attendance)
            VALUES (%s, %s, %s)
            """,
            rows
        )
    conn.commit()

def job(client):
    print("Running job:", datetime.now(timezone.utc))

    try:
        results = asyncio.run(async_get_all_attendance(client))
        now = datetime.now(timezone.utc)
        rows = [
            (now, result[0], result[1])
            for result in results
        ]

        conn = get_db()
        insert_data(conn, rows)
        conn.close()
        print(f'Inserted {rows}')

    except Exception as e:
        print("Job error:", e)

# ------------------------------

async def async_get_all_attendance(client):
    tasks = [
        asyncio.to_thread(get_gym_attendance, client, gym)
        for gym in ['exeterforestreet'] # in client.gyms
    ]

    results = await asyncio.gather(*tasks)
    results = [r for r in results if r is not None]
    return results

if __name__ == "__main__":

    load_dotenv()  # loads .env from project root

    client = PuregymAPIClient(
        email=os.getenv('email'),
        pin=os.getenv('pin')
    )
    client.get_list_of_gyms()
    client.gym_ids = {v: k for k, v in client.gyms.items()}

    scheduler = BlockingScheduler()
    print(datetime.now())

    # run every 1 minute
    scheduler.add_job(
        job,
        trigger=IntervalTrigger(minutes=1),
        args=[client],
        max_instances=1,
        coalesce=True,
        misfire_grace_time=20,
    )

    scheduler.start()