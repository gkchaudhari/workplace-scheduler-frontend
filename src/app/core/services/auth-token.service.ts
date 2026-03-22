import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly tokenKey = 'workplace_scheduler_token';

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.tokenKey);
  }
}
