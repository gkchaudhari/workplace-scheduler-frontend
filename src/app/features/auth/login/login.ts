import { Component, inject, signal } from '@angular/core';
import { email, form, required, submit, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);

  protected readonly loginModel = signal({
    email: '',
    password: '',
    rememberMe: true,
  });

  protected readonly form = form(this.loginModel, (s) => {
    required(s.email, { message: 'Email is required.' });
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.password, { message: 'Password is required.' });
  });

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.form, async () => {
      void this.router.navigate(['/dashboard']);
    });
  }
}
