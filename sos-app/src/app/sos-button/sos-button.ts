import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sos-button',
  standalone: true,             // ✅ standalone component
  imports: [CommonModule],      // ✅ so *ngIf works
  templateUrl: './sos-button.html',
  styleUrls: ['./sos-button.css']
})
export class SosButton {
  loading = false;
  lastCoords: { lat: number; lon: number; timestamp: number } | null = null;
  errorMsg: string | null = null;

  sendSOS() {
    this.loading = true;
    this.errorMsg = null;

    if (!navigator.geolocation) {
      this.errorMsg = 'Geolocation is not supported by your browser.';
      this.loading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.loading = false;
        const { latitude, longitude } = pos.coords;
        const timestamp = pos.timestamp;

        this.lastCoords = { lat: latitude, lon: longitude, timestamp };

        // 🔗 Fake fetch (since no backend yet)
        fetch('/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.lastCoords)
        }).catch(() => {});

        // 📱 Generate SMS deep link
        const smsLink = `sms:?body=SOS! I need help at [${latitude}, ${longitude}]`;
        window.location.href = smsLink;
      },
      (err) => {
        this.loading = false;
        this.errorMsg = 'Could not fetch location: ' + err.message;
      }
    );
  }
}
