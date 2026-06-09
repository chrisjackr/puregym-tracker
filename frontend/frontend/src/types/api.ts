export interface Gym {
  Id: number;
  Name: string;
  Status: string;
  Location: {
    GeoLocation: {
      Latitude: number;
      Longitude: number;
    };
    Address: {
      Town?: string;
      Postcode: string;
      Country: string;
    };
  };
  ContactInfo: {
    PhoneNumber: string;
    EmailAddress?: string;
  };
  TimeZone: string;
}

export interface Member {
  HomeGym: Gym;
  MemberStatus: string;
  PersonalDetails: {
    FirstName: string;
    LastName: string;
  };
}

export interface AttendancePoint {
  /** ISO timestamp */
  time: string;
  count: number;
}
