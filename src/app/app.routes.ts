import { Routes } from '@angular/router'
import { EditCalcComponent } from './pages/main/edit-calc/edit-calc.component'
import { MainComponent } from './pages/main/main.component'
import { TestComponent } from './pages/test/test.component'
import { LocalStorageService } from './services/local_storage.service'

const currentYear = LocalStorageService.currentYear

export const routes: Routes = [
  { path: '', redirectTo: `main/${currentYear}`, pathMatch: 'full' },
  {
    path: 'main/:year',
    component: MainComponent,
    children: [
      {
        path: 'import-data',
        loadComponent: () => import('./pages/import-data/import-data.component').then(m => m.ImportDataComponent)
      },
      { path: ':month/edit', component: EditCalcComponent }
    ]
  },
  {
    path: 'stat',
    loadComponent: () => import('./pages/stat/stat.component').then(m => m.StatComponent)
  },
  {
    path: 'flats',
    loadComponent: () => import('./pages/flats/flats.component').then(m => m.FlatsComponent),
    children: [
      {
        path: ':flatId/edit',
        loadComponent: () => import('./pages/flats/edit-flat/edit-flat.component').then(m => m.EditFlatComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/flats/edit-flat/edit-flat.component').then(m => m.EditFlatComponent)
      }
    ]
  },
  { path: 'test', component: TestComponent }
]
