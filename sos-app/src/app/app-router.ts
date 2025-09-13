import { Routes } from '@angular/router';
import { SosButton } from './sos-button/sos-button';
import { Responder } from './responder/responder';

export const routes: Routes = [
  { path: '', component: SosButton },        // victim page
  { path: 'responder', component: Responder } // responder page
];
