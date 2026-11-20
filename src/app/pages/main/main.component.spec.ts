import { TestBed } from '@angular/core/testing'
import { MATERIAL_ANIMATIONS } from '@angular/material/core'
import { provideRouter } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { LocalStorageService } from '../../services/local_storage.service'
import { MainComponent } from './main.component'

describe('MainComponent', () => {
  it('should create', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
        provideRouter([{ path: 'main/:year', component: MainComponent }])
      ]
    })

    const harness = await RouterTestingHarness.create()
    const component = await harness.navigateByUrl(`/main/${LocalStorageService.currentYear}`, MainComponent)
    expect(component).toBeTruthy()
  })
})
