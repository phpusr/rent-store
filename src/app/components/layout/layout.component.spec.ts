import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { LayoutComponent } from './layout.component'

describe('LayoutComponent', () => {
  let component: LayoutComponent
  let fixture: ComponentFixture<LayoutComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([]), provideNoopAnimations()]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })
})
