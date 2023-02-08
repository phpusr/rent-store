import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcTableComponent } from './calc-table.component';

describe('CalcTableComponent', () => {
  let component: CalcTableComponent;
  let fixture: ComponentFixture<CalcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
