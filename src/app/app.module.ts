import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MainComponent } from './pages/main/main.component'
import { LayoutComponent } from './components/layout/layout.component'
import { MatModule } from './modules/mat.module'
import { FlatSelectorComponent } from './components/layout/flat-selector/flat-selector.component';
import { ImportDataComponent, ImportDataDialog } from './pages/import-data/import-data.component'
import { RouterModule, Routes } from '@angular/router';
import { EditCalcComponent, EditCalcDialog } from './pages/edit-calc/edit-calc.component'

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent, children: [
      { path: 'import-data', component: ImportDataComponent },
      { path: 'edit-calc', component: EditCalcComponent }
    ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LayoutComponent,
    FlatSelectorComponent,
    ImportDataComponent,
    ImportDataDialog,
    EditCalcComponent,
    EditCalcDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
