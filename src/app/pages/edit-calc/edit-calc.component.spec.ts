import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCalcComponent } from './edit-calc.component';

describe('EditCalcComponent', () => {
  let component: EditCalcComponent;
  let fixture: ComponentFixture<EditCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCalcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
