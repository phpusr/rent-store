import { TestBed } from '@angular/core/testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { LocalStorageService } from '../../services/local_storage.service'
import { MainComponent } from './main.component'

describe('MainComponent', () => {
  it('should create', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideRouter([{ path: 'main/:year', component: MainComponent }])
      ]
    })

    const harness = await RouterTestingHarness.create()
    const component = await harness.navigateByUrl(`/main/${LocalStorageService.currentYear}`, MainComponent)
    expect(component).toBeTruthy()
  })
})
