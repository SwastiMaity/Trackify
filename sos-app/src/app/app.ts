import { Component } from '@angular/core';
import { SosButton } from './sos-button/sos-button';
import { Responder } from './responder/responder';

import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SosButton, Responder, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}