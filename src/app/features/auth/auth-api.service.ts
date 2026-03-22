import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthTokenService } from '../../core/services/auth-token.service';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../core/models/auth.model';

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
  private readonly authTokenService = inject(AuthTokenService);
  private readonly baseUrl = environment.apiUrl;

  login(payload: LoginRequest): Promise<AuthResponse> {
    return firstValueFrom(this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, payload)).then((response) => {
      this.storeTokenFromResponse(response);
      return response;
    });
  }

  signup(payload: SignupRequest): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/Auth/signup`, payload)).then((response) => {
      this.storeTokenFromResponse(response);
      return response;
    });
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

  private storeTokenFromResponse(response: unknown): void {
    if (!response || typeof response !== 'object') {
      return;
    }

    const token =
      this.getStringProperty(response, 'token') ??
      this.getStringProperty(response, 'accessToken') ??
      this.getStringProperty(response, 'jwtToken');

    if (token) {
      this.authTokenService.setToken(token);
    }
  }

  private getStringProperty(source: unknown, key: string): string | null {
    if (!source || typeof source !== 'object') {
      return null;
    }

    const value = (source as Record<string, unknown>)[key];
    return typeof value === 'string' && value.trim() ? value : null;
  }
}
