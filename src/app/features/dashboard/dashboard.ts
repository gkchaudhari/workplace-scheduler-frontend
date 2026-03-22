import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Booking } from '../../core/models/booking.model';
import { Room } from '../../core/models/room.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  private readonly roomService = inject(RoomService);

  protected readonly currentBooking = signal<Booking | null>(null);
  protected readonly upcomingBookings = signal<Booking[]>([]);
  protected readonly roomStatuses = signal<RoomStatusViewModel[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly totalUpcoming = computed(() => this.upcomingBookings().length);
  protected readonly activeRoomCount = computed(
    () => this.roomStatuses().filter((room) => room.status === 'available').length,
  );

  constructor() {
    void this.loadDashboard();
  }

  private async loadDashboard(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const [bookings, rooms] = await Promise.all([this.loadBookings(), this.loadRooms()]);
      this.roomStatuses.set(this.buildRoomStatuses(rooms, bookings));
    } catch {
      this.errorMessage.set('Unable to load your bookings right now.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadBookings(): Promise<Booking[]> {
    const data = await this.dashboardService.getMyBookings();
    this.currentBooking.set(data.currentBooking);
    this.upcomingBookings.set(data.upcomingBookings);
    return await this.dashboardService.getBookings();
  }

  private async loadRooms(): Promise<Room[]> {
    return await firstValueFrom(this.roomService.getRooms());
  }

  private buildRoomStatuses(rooms: Room[], bookings: Booking[]): RoomStatusViewModel[] {
    const now = new Date();

    return rooms
      .filter((room) => room.isActive)
      .map((room) => {
        const roomBookings = bookings
          .filter((booking) => booking.roomId === room.id)
          .sort(
            (left, right) =>
              this.toDate(left.date, left.startTime).getTime() -
              this.toDate(right.date, right.startTime).getTime(),
          );

        const activeBooking = roomBookings.find((booking) => {
          const start = this.toDate(booking.date, booking.startTime);
          const end = this.toDate(booking.date, booking.endTime);
          return start <= now && end >= now;
        });

        if (activeBooking) {
          return {
            room,
            status: 'occupied' as const,
            headline: `Occupied until ${activeBooking.endTime}`,
            detail: activeBooking.title,
          };
        }

        const nextBooking = roomBookings.find(
          (booking) => this.toDate(booking.date, booking.startTime) > now,
        );

        if (nextBooking) {
          return {
            room,
            status: 'available' as const,
            headline: `Free now until ${nextBooking.startTime}`,
            detail: `Next: ${nextBooking.title}`,
          };
        }

        return {
          room,
          status: 'available' as const,
          headline: 'Free for the rest of the day',
          detail: 'No upcoming bookings scheduled',
        };
      });
  }

  private toDate(date: string, time: string): Date {
    return new Date(`${date}T${time}:00`);
  }
}

interface RoomStatusViewModel {
  room: Room;
  status: 'available' | 'occupied';
  headline: string;
  detail: string;
}
