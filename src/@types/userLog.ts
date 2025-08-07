export interface UserLog {
  uuid: string;
  event: string;
  module: string;
  referenceUuid: string;
  latitude: string;
  longitude: string;
  macAddress: string;
  ipAddress: string;
  regionName: string;
  city: string;
  description: string;
  creator: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isActive: boolean;
  createdAt: string;
}
