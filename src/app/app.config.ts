import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { routes } from './app.routes';
import { InMemoryDataService } from './services/in-memory-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync(),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 })
    ),
    importProvidersFrom(NgxSkeletonLoaderModule.forRoot()),
    provideHotToastConfig({
      position: 'bottom-right',
      autoClose: true
    })
  ]
};
