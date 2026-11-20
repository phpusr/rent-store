import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { provideRouter } from '@angular/router'
import { provideNoopAnimations } from '@angular/platform-browser/animations'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideNoopAnimations()]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('should render the layout with a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const element = fixture.nativeElement as HTMLElement
    expect(element.querySelector('app-layout router-outlet')).not.toBeNull()
  })
})
