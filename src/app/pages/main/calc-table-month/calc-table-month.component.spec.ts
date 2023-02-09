import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcTableMonthComponent } from './calc-table-month.component';

describe('CalcTableMonthComponent', () => {
  let component: CalcTableMonthComponent;
  let fixture: ComponentFixture<CalcTableMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcTableMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcTableMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
