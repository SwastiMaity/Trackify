import { Component } from '@angular/core';
import { SosButton } from './sos-button/sos-button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SosButton],             // ✅ import child component
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
