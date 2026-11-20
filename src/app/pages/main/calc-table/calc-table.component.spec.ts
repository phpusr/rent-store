import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { CalcTableComponent } from './calc-table.component';

describe('CalcTableComponent', () => {
  let component: CalcTableComponent;
  let fixture: ComponentFixture<CalcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcTableComponent],
      providers: [provideRouter([]), { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }]
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
