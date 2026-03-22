import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {}
