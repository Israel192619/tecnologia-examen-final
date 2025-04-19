  import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { LoginComponent } from './auth/login/login.component';
  import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
  import { importProvidersFrom } from '@angular/core';
  import { ToastrModule } from 'ngx-toastr';
  import { provideAnimations } from '@angular/platform-browser/animations';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';

  import { routes } from './app.routes';

  export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimations(),
      importProvidersFrom(NgbModule),
      importProvidersFrom(ToastrModule.forRoot(),
      FormsModule,
      ReactiveFormsModule )],
  };
