import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Booking } from '../../core/models/booking.model';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  protected readonly currentBooking = signal<Booking | null>(null);
  protected readonly upcomingBookings = signal<Booking[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly totalUpcoming = computed(() => this.upcomingBookings().length);

  constructor() {
    void this.loadDashboard();
  }

  private async loadDashboard(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const data = await this.dashboardService.getMyBookings();
      this.currentBooking.set(data.currentBooking);
      this.upcomingBookings.set(data.upcomingBookings);
    } catch {
      this.errorMessage.set('Unable to load your bookings right now.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
