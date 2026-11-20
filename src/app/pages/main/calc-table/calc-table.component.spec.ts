import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CalcTableComponent } from './calc-table.component';

describe('CalcTableComponent', () => {
  let component: CalcTableComponent;
  let fixture: ComponentFixture<CalcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcTableComponent],
      providers: [provideRouter([]), provideNoopAnimations()]
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
