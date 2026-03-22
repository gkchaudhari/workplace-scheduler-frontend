import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, min, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { Booking, BookingCreatePayload } from '../../core/models/booking.model';
import { Room } from '../../core/models/room.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormField],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  private readonly roomService = inject(RoomService);

  protected readonly currentBooking = signal<Booking | null>(null);
  protected readonly upcomingBookings = signal<Booking[]>([]);
  protected readonly availableRooms = signal<Room[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly bookingError = signal('');
  protected readonly bookingSuccess = signal('');
  protected readonly isBookingSubmitting = signal(false);
  protected readonly totalUpcoming = computed(() => this.upcomingBookings().length);
  protected readonly activeRoomCount = computed(() => this.availableRooms().length);
  protected readonly bookingModel = signal<BookingCreatePayload>({
    title: '',
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    attendeesCount: 1,
    agenda: '',
  });
  protected readonly bookingForm = form(this.bookingModel, (path) => {
    required(path.title, { message: 'Meeting title is required.' });
    required(path.roomId, { message: 'Select a room.' });
    required(path.date, { message: 'Date is required.' });
    required(path.startTime, { message: 'Start time is required.' });
    required(path.endTime, { message: 'End time is required.' });
    min(path.attendeesCount, 1, { message: 'At least 1 attendee is required.' });
  });

  constructor() {
    void this.loadDashboard();
  }

  protected async bookRoom(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.bookingForm, async () => {
      this.bookingError.set('');
      this.bookingSuccess.set('');
      this.isBookingSubmitting.set(true);

      try {
        const payload = this.bookingForm().value();

        if (payload.startTime >= payload.endTime) {
          this.bookingError.set('End time must be later than start time.');
          return;
        }

        const room = this.availableRooms().find((item) => item.id === Number(payload.roomId));
        if (!room) {
          this.bookingError.set('Selected room is not available.');
          return;
        }

        await this.dashboardService.createBooking(payload, room);
        await this.loadBookings();
        this.bookingModel.set({
          title: '',
          roomId: '',
          date: '',
          startTime: '',
          endTime: '',
          attendeesCount: 1,
          agenda: '',
        });
        this.bookingForm().reset();
        this.bookingSuccess.set(`Booked ${room.name} successfully.`);
      } catch {
        this.bookingError.set('Unable to create the booking right now.');
      } finally {
        this.isBookingSubmitting.set(false);
      }
    });
  }

  private async loadDashboard(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await Promise.all([this.loadBookings(), this.loadRooms()]);
    } catch {
      this.errorMessage.set('Unable to load your bookings right now.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadBookings(): Promise<void> {
    const data = await this.dashboardService.getMyBookings();
    this.currentBooking.set(data.currentBooking);
    this.upcomingBookings.set(data.upcomingBookings);
  }

  private async loadRooms(): Promise<void> {
    const rooms = await firstValueFrom(this.roomService.getRooms());
    this.availableRooms.set(rooms.filter((room) => room.isActive));
  }
}
