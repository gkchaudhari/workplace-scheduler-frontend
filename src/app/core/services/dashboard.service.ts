import { Injectable } from '@angular/core';

import { Booking, DashboardBookings } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getMyBookings(): Promise<DashboardBookings> {
    const bookings: Booking[] = [
      {
        id: 'bk-101',
        title: 'Sprint Planning',
        roomName: 'Atlas Room',
        location: 'Floor 3, East Wing',
        date: '2026-03-21',
        startTime: '11:00',
        endTime: '12:00',
        status: 'active',
        attendeesCount: 8,
        agenda: 'Finalize sprint scope and team allocation.',
      },
      {
        id: 'bk-102',
        title: 'Design Review',
        roomName: 'Nova Room',
        location: 'Floor 2, Collaboration Zone',
        date: '2026-03-21',
        startTime: '15:00',
        endTime: '16:00',
        status: 'upcoming',
        attendeesCount: 5,
        agenda: 'Review booking dashboard UX and API integration status.',
      },
      {
        id: 'bk-103',
        title: 'Client Sync',
        roomName: 'Orion Room',
        location: 'Floor 5, Meeting Hub',
        date: '2026-03-22',
        startTime: '10:30',
        endTime: '11:00',
        status: 'upcoming',
        attendeesCount: 4,
        agenda: 'Weekly sync with client stakeholders.',
      },
    ];

    return Promise.resolve({
      currentBooking: bookings.find((booking) => booking.status === 'active') ?? null,
      upcomingBookings: bookings.filter((booking) => booking.status === 'upcoming'),
    });
  }
}
