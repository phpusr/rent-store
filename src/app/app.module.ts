import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MainComponent } from './pages/main/main.component'
import { LayoutComponent } from './components/layout/layout.component'
import { MatModule } from './modules/mat.module'
import { FlatSelectorComponent } from './components/layout/flat-selector/flat-selector.component'
import { ImportDataComponent, ImportDataDialog } from './pages/import-data/import-data.component'
import { RouterModule, Routes } from '@angular/router'
import { EditCalcComponent, EditCalcDialog } from './pages/main/edit-calc/edit-calc.component'
import { LocalStorageService } from './services/local_storage.service'
import { ReactiveFormsModule } from '@angular/forms'
import { CalcTableComponent } from './pages/main/calc-table/calc-table.component'
import { CalcTableMonthComponent } from './pages/main/calc-table-month/calc-table-month.component'
import { StatComponent } from './pages/stat/stat.component'
import { TestComponent } from './pages/test/test.component'
import { FlatsComponent } from './pages/flats/flats.component'
import { EditFlatComponent, EditFlatDialog } from './pages/flats/edit-flat/edit-flat.component'

const currentYear = LocalStorageService.currentYear

const routes: Routes = [
  { path: '', redirectTo: `main/${currentYear}`, pathMatch: 'full' },
  { path: 'main/:year', component: MainComponent, children: [
      { path: 'import-data', component: ImportDataComponent },
      { path: ':month/edit', component: EditCalcComponent }
    ]
  },
  { path: 'stat', component: StatComponent },
  { path: 'flats', component: FlatsComponent, children: [
      { path: ':flatId/edit', component: EditFlatComponent },
      { path: 'create', component: EditFlatComponent }
    ]
  },
  { path: 'test', component: TestComponent }
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
    EditCalcDialog,
    CalcTableComponent,
    CalcTableMonthComponent,
    StatComponent,
    TestComponent,
    FlatsComponent,
    EditFlatComponent,
    EditFlatDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { enableTracing: false }),
    ReactiveFormsModule,
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
