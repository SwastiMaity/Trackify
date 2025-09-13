import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sos-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sos-button.html',
  styleUrls: ['./sos-button.css']
})
export class SosButton {
  loading = false;
  lastCoords: { lat: number; lon: number; timestamp: string } | null = null;
  errorMsg: string | null = null;
  showConfirmation = false;

  confirmSOS() {
    this.showConfirmation = true;
  }

  cancelSOS() {
    this.showConfirmation = false;
  }

  sendSOS() {
    this.showConfirmation = false;
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
        // Convert timestamp to ISO format
        const timestamp = new Date(pos.timestamp).toISOString();

        this.lastCoords = { lat: latitude, lon: longitude, timestamp };

        fetch('https://olivaceous-bobette-winterless.ngrok-free.app/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.lastCoords)
        })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Failed to send SOS');
          }
          const data = await response.json();
          alert('SOS sent! Alert ID: ' + data.id);
        })
        .catch((err) => {
          this.errorMsg = 'SOS request failed: ' + err.message;
        });

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

  // --- Alert Management Methods ---
  async getAllAlerts() {
    try {
      const res = await fetch('https://olivaceous-bobette-winterless.ngrok-free.app/alerts');
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return await res.json();
    } catch (err: any) {
      this.errorMsg = err.message;
      return [];
    }
  }

  async getAlertById(alertId: number) {
    try {
      const res = await fetch(`https://olivaceous-bobette-winterless.ngrok-free.app/alerts/${alertId}`);
      if (!res.ok) throw new Error('Failed to fetch alert');
      return await res.json();
    } catch (err: any) {
      this.errorMsg = err.message;
      return null;
    }
  }

  async updateAlert(alertId: number, lat: number, lon: number, timestamp: string) {
    try {
      const res = await fetch(`https://olivaceous-bobette-winterless.ngrok-free.app/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, timestamp })
      });
      if (!res.ok) throw new Error('Failed to update alert');
      return await res.json();
    } catch (err: any) {
      this.errorMsg = err.message;
      return null;
    }
  }

  async deleteAlert(alertId: number) {
    try {
      const res = await fetch(`https://olivaceous-bobette-winterless.ngrok-free.app/alerts/${alertId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete alert');
      return await res.json();
    } catch (err: any) {
      this.errorMsg = err.message;
      return null;
    }
  }
}