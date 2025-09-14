import { Component } from '@angular/core';
import { SosButton } from './sos-button/sos-button';
import { Responder } from './responder/responder';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app-router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SosButton, Responder, RouterModule],             // ✅ import child component

  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});