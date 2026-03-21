import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormField, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly router = inject(Router);

  protected readonly signupModel = signal({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  protected readonly form = form(this.signupModel, (s) => {
    required(s.fullName, { message: 'Full name is required.' });
    required(s.email, { message: 'Email is required.' });
    email(s.email, { message: 'Enter a valid email address.' });
    required(s.password, { message: 'Password is required.' });
    minLength(s.password, 8, { message: 'Password must be at least 8 characters.' });
    required(s.confirmPassword, { message: 'Confirm your password.' });
    required(s.agreeToTerms, { message: 'Accept the terms to continue.' });
  });

  protected readonly passwordMismatch = computed(() => {
    const value = this.form().value();
    const confirmTouched = this.form.confirmPassword().touched();
    return confirmTouched && value.password !== value.confirmPassword;
  });

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.form, async () => {
      if (this.form().value().password !== this.form().value().confirmPassword) {
        return;
      }

      //make an api call to save the data

      void this.router.navigate(['/dashboard']);
    });
  }
}
