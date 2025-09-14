
import { Routes } from '@angular/router';
import { SosButton } from './sos-button/sos-button';
import { Responder } from './responder/responder';

export const routes: Routes = [
  {
    path: '',
    component: SosButton,
    pathMatch: 'full' // default route
  },
  {
    path: 'responder',
    component: Responder
  },
  {
    path: '**',
    redirectTo: '' // fallback to SOS Button
  }
];
