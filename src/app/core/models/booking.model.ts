export interface Booking {
  id: string;
  roomId?: number;
  title: string;
  roomName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  attendeesCount: number;
  agenda?: string;
}

export interface DashboardBookings {
  currentBooking: Booking | null;
  upcomingBookings: Booking[];
}

export interface BookingCreatePayload {
  title: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  agenda: string;
}
