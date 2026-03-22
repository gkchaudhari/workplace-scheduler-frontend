import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, min, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { Room, RoomUpsertPayload } from '../../core/models/room.model';
import { RoomService } from '../../core/services/room.service';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-rooms',
  imports: [FormField, DatePipe,MatProgressSpinnerModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  private readonly roomService = inject(RoomService);

  protected readonly rooms = signal<Room[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly editingRoomId = signal<number | null>(null);
  protected readonly roomModel = signal<RoomUpsertPayload>(this.createEmptyRoomModel());

  protected readonly roomForm = form(this.roomModel, (path) => {
    required(path.name, { message: 'Room name is required.' });
    required(path.location, { message: 'Location is required.' });
    min(path.capacity, 1, { message: 'Capacity must be at least 1.' });
  });

  protected readonly formTitle = computed(() =>
    this.editingRoomId() ? 'Edit room' : 'Create room',
  );
  protected readonly activeRoomsCount = computed(
    () => this.rooms().filter((room) => room.isActive).length,
  );

  constructor() {
    void this.loadRooms();
  }

  protected async saveRoom(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.roomForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      try {
        const payload = this.roomForm().value();
        const editingId = this.editingRoomId();

        if (editingId) {
          const updatedRoom = await firstValueFrom(this.roomService.updateRoom(editingId, payload));

          if (updatedRoom) {
            this.rooms.update((rooms) =>
              rooms.map((room) => (room.id === editingId ? updatedRoom : room)),
            );
          }
        } else {
          const createdRoom = await firstValueFrom(this.roomService.createRoom(payload));
          this.rooms.update((rooms) => [createdRoom, ...rooms]);
        }

        this.resetForm();
      } catch {
        this.errorMessage.set('Unable to save the room right now.');
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  protected startEdit(room: Room): void {
    this.editingRoomId.set(room.id);
    this.roomModel.set({
      name: room.name,
      location: room.location,
      capacity: room.capacity,
      isActive: room.isActive,
    });
    this.roomForm().reset();
  }

  protected async deleteRoom(id: number): Promise<void> {
    this.errorMessage.set('');

    try {
      await firstValueFrom(this.roomService.deleteRoom(id));
      this.rooms.update((rooms) => rooms.filter((room) => room.id !== id));

      if (this.editingRoomId() === id) {
        this.resetForm();
      }
    } catch {
      this.errorMessage.set('Unable to delete the room right now.');
    }
  }

  protected resetForm(): void {
    this.editingRoomId.set(null);
    this.roomModel.set(this.createEmptyRoomModel());
    this.roomForm().reset();
  }

  private async loadRooms(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const rooms = await firstValueFrom(this.roomService.getRooms());
      this.rooms.set(rooms);
    } catch {
      this.errorMessage.set('Unable to load rooms right now.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private createEmptyRoomModel(): RoomUpsertPayload {
    return {
      name: '',
      location: '',
      capacity: 1,
      isActive: true,
    };
  }
}
