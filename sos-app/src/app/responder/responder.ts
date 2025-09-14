
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';


@Component({
  selector: 'app-responder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './responder.html',
  styleUrls: ['./responder.css']
})
export class Responder implements AfterViewInit, OnDestroy {
  // Admin login state
  isLoggedIn = false;
  username = '';
  password = '';
  loginError: string | null = null;

  // Alerts and map
  alerts: any[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private intervalId: any;

  // Login method (demo: username 'admin', password 'admin123')
  login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      this.isLoggedIn = true;
      this.loginError = null;
      setTimeout(() => this.initMapAndFetch(), 0); // Wait for DOM
    } else {
      this.loginError = 'Invalid username or password.';
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.username = '';
    this.password = '';
    this.loginError = null;
    this.alerts = [];
    if (this.map) {
      this.map.remove();
    }
    clearInterval(this.intervalId);
  }

  refreshAlerts() {
    this.fetchAlerts();
  }

  // Initialize map and start polling
  private initMapAndFetch() {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.fetchAlerts();
    this.intervalId = setInterval(() => this.fetchAlerts(), 5000);
  }

  fetchAlerts() {
    fetch('https://olivaceous-bobette-winterless.ngrok-free.app/alerts')
      .then(res => res.json())
      .then((data: any[]) => {
        this.alerts = data;
        // Remove old markers
        if (this.map) {
          this.markers.forEach(m => m.remove());
          this.markers = [];
          // Add new markers for each SOS location
          data.forEach(alert => {
            if (alert.lat && alert.lon) {
              const marker = L.marker([alert.lat, alert.lon], { icon: redIcon })
                .bindPopup(`SOS received at ${alert.timestamp}<br>ID: ${alert.id}`)
                .addTo(this.map);
              this.markers.push(marker);
            }
          });
          // Optionally, fit map to markers if there are any
          if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.2));
          }
        }
      })
      .catch(err => console.error('Error fetching alerts:', err));
  }

  ngAfterViewInit(): void {
    // Map and polling only after login
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.map) {
      this.map.remove();
    }
  }
}
// Red icon definition
const redIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
