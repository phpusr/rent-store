import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { AppModule } from 'src/app/app.module'
import { LayoutComponent } from './layout.component'

describe('LayoutComponent', () => {
  let component: LayoutComponent
  let fixture: ComponentFixture<LayoutComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
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
