import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { MATERIAL_ANIMATIONS } from '@angular/material/core'
import { LayoutComponent } from './layout.component'

describe('LayoutComponent', () => {
  let component: LayoutComponent
  let fixture: ComponentFixture<LayoutComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([]), { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }]
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
