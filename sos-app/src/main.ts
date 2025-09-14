

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch((err: any) => console.error(err));
 import { appConfig } from './app/app.config';