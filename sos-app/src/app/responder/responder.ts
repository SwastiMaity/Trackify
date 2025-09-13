import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-responder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responder.html',
  styleUrls: ['./responder.css']
})
export class Responder implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private intervalId: any;

  ngAfterViewInit(): void {
    // Initialize map
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Fetch alerts every 5 seconds
    this.fetchAlerts();
    this.intervalId = setInterval(() => this.fetchAlerts(), 5000);
  }

  fetchAlerts() {
    fetch('/alerts')   // your backend endpoint
      .then(res => res.json())
      .then((data: { lat: number, lon: number, timestamp: string }[]) => {
        // Remove old markers
        this.markers.forEach(m => m.remove());
        this.markers = [];

        // Add new markers
        data.forEach(alert => {
          const marker = L.marker([alert.lat, alert.lon], { icon: redIcon })
            .bindPopup(`SOS received at ${alert.timestamp}`)
            .addTo(this.map);
          this.markers.push(marker);
        });
      })
      .catch(err => console.error('Error fetching alerts:', err));
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.map.remove();
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
