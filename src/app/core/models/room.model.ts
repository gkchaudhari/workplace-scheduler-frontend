export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
}

export interface RoomUpsertPayload {
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
}
