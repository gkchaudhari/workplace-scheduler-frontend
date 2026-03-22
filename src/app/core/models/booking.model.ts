export interface Booking {
  id: string;
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
