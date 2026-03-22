import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Room, RoomUpsertPayload } from '../models/room.model';
import { Observable } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private httpClient: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.httpClient.get<Room[]>(`${environment.apiUrl}/Rooms/GetAll`);
  }

  createRoom(payload: RoomUpsertPayload): Observable<Room> {
    const room: Room = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...payload,
    };
    return this.httpClient.post<Room>(`${environment.apiUrl}/Rooms/Create`, room);
  }

  updateRoom(id: number, payload: RoomUpsertPayload): Observable<Room | null> {
    return this.httpClient.put<Room>(`${environment.apiUrl}/Rooms/Update/${id}`, payload);
  }

  deleteRoom(id: number): Observable<Room> {
    return this.httpClient.delete<Room>(`${environment.apiUrl}/Rooms/Delete/${id}`);
  }
}
