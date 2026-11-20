import {TestBed} from '@angular/core/testing'
import {MATERIAL_ANIMATIONS} from '@angular/material/core'
import {provideRouter} from '@angular/router'
import {RouterTestingHarness} from '@angular/router/testing'
import {LocalStorageService} from '../../services/local_storage.service'
import {DataStorageService} from '../../services/data_storage.service'
import {MainComponent} from './main.component'

describe('MainComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
        provideRouter([{ path: 'main/:year', component: MainComponent }])
      ]
    })
  })

  it('should create', async () => {
    const harness = await RouterTestingHarness.create()
    const component = await harness.navigateByUrl(`/main/${LocalStorageService.currentYear}`, MainComponent)
    expect(component).toBeTruthy()
  })

  it('updates both tables when the comparison years change', async () => {
    spyOnProperty(LocalStorageService, 'currentYear', 'set')
    const harness = await RouterTestingHarness.create()
    const component = await harness.navigateByUrl('/main/2024', MainComponent)
    TestBed.inject(DataStorageService).years$.next([2023, 2024, 2025])

    expect(await harness.navigateByUrl('/main/2024-2023', MainComponent)).toBe(component)
    expect(await harness.navigateByUrl('/main/2025-2024', MainComponent)).toBe(component)

    const tables = harness.routeNativeElement!.querySelectorAll('app-calc-table')
    expect(tables.length).toBe(2)
    expect(tables[0]?.querySelector('[aria-selected="true"]')?.textContent?.trim()).toBe('2025')
    expect(tables[1]?.querySelector('[aria-selected="true"]')?.textContent?.trim()).toBe('2024')
    expect(tables[0]?.querySelector('a[href="/main/2023-2024"]')).not.toBeNull()
    expect(tables[1]?.querySelector('a[href="/main/2025-2023"]')).not.toBeNull()

    await harness.navigateByUrl('/main/2025', MainComponent)
    expect(harness.routeNativeElement!.querySelectorAll('app-calc-table').length).toBe(1)
  })
})
