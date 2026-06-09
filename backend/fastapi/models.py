from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class GymAttedancePoint(BaseModel):
    time: datetime
    gym_attendance: int

class GymAttedance(BaseModel):
    gym_id: int
    data: list[GymAttedancePoint]


### PureGym API MODELS

class Address(BaseModel):
    Line1: Optional[str] = None
    Line2: Optional[str] = None
    Line3: Optional[str] = None
    Town: str
    County: Optional[str] = None
    Province: Optional[str] = None
    Postcode: str
    Country: str


class GeoLocation(BaseModel):
    Longitude: float
    Latitude: float


class Location(BaseModel):
    Address: Address
    GeoLocation: GeoLocation


class AccessOptions(BaseModel):
    PinAccess: bool
    QrCodeAccess: bool


class OpeningHour(BaseModel):
    DayOfWeek: str
    StartTime: str
    EndTime: str
    IsHoliday: bool


class OpeningHours(BaseModel):
    IsAlwaysOpen: bool
    OpeningHours: list[OpeningHour] | str | list[str]


class GymAccess(BaseModel):
    GymAccessOptions: Optional[AccessOptions] = None
    OpeningHours: OpeningHours
    StandardOpeningTimes: list[OpeningHour]
    ReopenDate: str


class ContactInfo(BaseModel):
    PhoneNumber: str
    EmailAddress: Optional[str] = None


class Gym(BaseModel):
    Id: int
    Name: str
    Status: str
    Location: Location
    GymAccess: GymAccess
    ContactInfo: ContactInfo
    TimeZone: str

class MemberId(BaseModel):
    ExternalId: str
    CompoundId: str


class MemberContactDetails(BaseModel):
    PhoneNumber: str
    EmailAddress: str


class PersonalDetails(BaseModel):
    FirstName: str
    LastName: str
    DateOfBirth: str
    ContactDetails: MemberContactDetails
    Address: Address


class Member(BaseModel):
    Id: MemberId
    PersonalDetails: PersonalDetails
    HomeGym: Gym
    GymAccessPin: str
    SuspendedReason: str
    MemberStatus: str
