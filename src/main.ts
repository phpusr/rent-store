import {enableProdMode} from '@angular/core'
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field'
import {bootstrapApplication} from '@angular/platform-browser'
import {provideRouter} from '@angular/router'
import {AppComponent} from './app/app.component'
import {routes} from './app/app.routes'
import {environment} from './environments/environment'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } },
  ]
}).catch(err => console.error(err))
