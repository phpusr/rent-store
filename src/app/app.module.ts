import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MainComponent } from './pages/main/main.component'
import { LayoutComponent } from './components/layout/layout.component'
import { MatModule } from './mat.module'

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
