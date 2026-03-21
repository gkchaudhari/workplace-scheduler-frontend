import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  login(payload: LoginRequest): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/Auth/login`, payload));
  }

  signup(payload: SignupRequest): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/Auth/signup`, payload));
  }

  getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    return fallback;
  }
}
