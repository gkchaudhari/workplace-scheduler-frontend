import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthTokenService } from '../services/auth-token.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);
  const token = authTokenService.getToken();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
