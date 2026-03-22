import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, min, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { BookingCreatePayload } from '../../../core/models/booking.model';
import { Room } from '../../../core/models/room.model';
import { DashboardService } from '../../../core/services/dashboard.service';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-book-room',
  imports: [FormField],
  templateUrl: './book-room.html',
  styleUrl: './book-room.css',
})
export class BookRoom {
  private readonly roomService = inject(RoomService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  protected readonly availableRooms = signal<Room[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isSubmitting = signal(false);
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
  protected readonly roomCount = computed(() => this.availableRooms().length);

  constructor() {
    void this.loadRooms();
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.bookingForm, async () => {
      this.errorMessage.set('');
      this.successMessage.set('');
      this.isSubmitting.set(true);

      try {
        const payload = this.bookingForm().value();

        if (payload.startTime >= payload.endTime) {
          this.errorMessage.set('End time must be later than start time.');
          return;
        }

        const room = this.availableRooms().find((item) => item.id === Number(payload.roomId));
        if (!room) {
          this.errorMessage.set('Selected room is not available.');
          return;
        }

        await this.dashboardService.createBooking(payload, room);
        this.successMessage.set(`Booked ${room.name} successfully.`);
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
      } catch {
        this.errorMessage.set('Unable to create the booking right now.');
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  protected goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  private async loadRooms(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const rooms = await firstValueFrom(this.roomService.getRooms());
      this.availableRooms.set(rooms.filter((room) => room.isActive));
    } catch {
      this.errorMessage.set('Unable to load available rooms right now.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
