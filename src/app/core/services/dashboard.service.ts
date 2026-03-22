import { Injectable, signal } from '@angular/core';

import { Booking, BookingCreatePayload, DashboardBookings } from '../models/booking.model';
import { Room } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly bookingsState = signal<Booking[]>([
    {
      id: 'bk-101',
      roomId: 1,
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
      roomId: 2,
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
      roomId: 3,
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
  ]);

  getMyBookings(): Promise<DashboardBookings> {
    const bookings = this.bookingsState();

    return Promise.resolve({
      currentBooking: bookings.find((booking) => booking.status === 'active') ?? null,
      upcomingBookings: bookings.filter((booking) => booking.status === 'upcoming'),
    });
  }

  createBooking(payload: BookingCreatePayload, room: Room): Promise<Booking> {
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      roomId: room.id,
      title: payload.title,
      roomName: room.name,
      location: room.location,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      attendeesCount: payload.attendeesCount,
      agenda: payload.agenda,
      status: this.resolveStatus(payload.date, payload.startTime, payload.endTime),
    };

    this.bookingsState.update((bookings) => [booking, ...bookings]);
    return Promise.resolve(booking);
  }

  private resolveStatus(date: string, startTime: string, endTime: string): Booking['status'] {
    const now = new Date();
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    if (start <= now && end >= now) {
      return 'active';
    }

    if (start > now) {
      return 'upcoming';
    }

    return 'completed';
  }
}
