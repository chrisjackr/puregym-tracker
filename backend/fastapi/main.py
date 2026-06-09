import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.responses import FileResponse
from queries import get_db, query_gym_attendance
from models import GymAttedance, Gym, Member

# PureGym Client
# from puregym_attendance import PuregymAPIClient
from dotenv import load_dotenv
import requests

class PuregymAPIClient():
    headers = {'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'PureGym/1523 CFNetwork/1312 Darwin/21.0.0'}
    home_gym_id = None
    gyms = None
    
    def __init__(self, email, pin):
        self.session = requests.session()
        data = {
            'grant_type': 'password',
            'username': email,
            'password': pin,
            'scope': 'pgcapi',
            'client_id': 'ro.client'
        }
        response = self.session.post('https://auth.puregym.com/connect/token', headers=self.headers, data=data)
        if response.status_code == 200:
            self.headers['Authorization'] = 'Bearer ' + response.json()['access_token']
        else:
            return response.raise_for_status()
    
    def get_gyms(self):
        response = self.session.get(f'https://capi.puregym.com/api/v2/gyms', headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            return ValueError('Response '+str(response.status_code))

    def get_member(self):
        response = self.session.get('https://capi.puregym.com/api/v2/member', headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            return ValueError('Response '+str(response.status_code))

app = FastAPI()

ORIGINS = [
    "http://localhost:5173",
    f"http://{os.getenv("VITE_FRONTEND_HOST_ORIGIN")}:5173",
]

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

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/ready")
async def ready():
    """Check if FastAPI is ready."""
    conn = get_db()
    date = "2026-06-09 12:00:00"
    try:
        query_gym_attendance(conn, gym_id=208, start=date, end=date)
        return {"status": "ready"}
    except Exception:
        return {"status": "not-ready"}

@app.get("/gyms", response_model=list[Gym])
def get_gyms():
    """Get list of gyms."""

    client = PuregymAPIClient(
        email=os.getenv('email'),
        pin=os.getenv('pin')
    )
    gym_info = client.get_gyms()
    return [Gym(**gym) for gym in gym_info]

@app.get("/member", response_model=Member)
def get_member():
    """Get member info."""

    client = PuregymAPIClient(
        email=os.getenv('email'),
        pin=os.getenv('pin')
    )
    member_info = client.get_member()
    return Member(**member_info)

@app.get("/attendance/{gym_id}/now", response_model=GymAttedance)
def get_current_gym_attendance(gym_id: int):
    """Get current gym attendance."""

    conn = get_db()
    now = datetime.now()
    start = now - timedelta(minutes=1)
    end = now
    try:
        result = query_gym_attendance(conn, gym_id, start, end)

        if result is None:
            return None

        return GymAttedance(**result)

    finally:
        conn.close()

@app.get("/attendance/{gym_id}", response_model=GymAttedance)
def get_gym_attendance(gym_id: int, start: str, end: str):
    """Get current gym attendance."""

    conn = get_db()

    try:
        result = query_gym_attendance(conn, gym_id, start, end)

        if result is None:
            return None

        return GymAttedance(**result)

    finally:
        conn.close()


if __name__ == "__main__":
    load_dotenv() 
    # host="0.0.0.0" (listen on all network interfaces)
    uvicorn.run(app, host="0.0.0.0", port=8000)
