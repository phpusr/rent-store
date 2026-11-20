import { Routes } from '@angular/router'
import { EditFlatComponent } from './pages/flats/edit-flat/edit-flat.component'
import { FlatsComponent } from './pages/flats/flats.component'
import { ImportDataComponent } from './pages/import-data/import-data.component'
import { EditCalcComponent } from './pages/main/edit-calc/edit-calc.component'
import { MainComponent } from './pages/main/main.component'
import { StatComponent } from './pages/stat/stat.component'
import { TestComponent } from './pages/test/test.component'
import { LocalStorageService } from './services/local_storage.service'

const currentYear = LocalStorageService.currentYear

export const routes: Routes = [
  { path: '', redirectTo: `main/${currentYear}`, pathMatch: 'full' },
  {
    path: 'main/:year',
    component: MainComponent,
    children: [
      { path: 'import-data', component: ImportDataComponent },
      { path: ':month/edit', component: EditCalcComponent }
    ]
  },
  { path: 'stat', component: StatComponent },
  {
    path: 'flats',
    component: FlatsComponent,
    children: [
      { path: ':flatId/edit', component: EditFlatComponent },
      { path: 'create', component: EditFlatComponent }
    ]
  },
  { path: 'test', component: TestComponent }
]
