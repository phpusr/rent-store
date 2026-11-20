import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { EditFlatComponent } from './edit-flat.component';

describe('EditFlatComponent', () => {
  let component: EditFlatComponent;
  let fixture: ComponentFixture<EditFlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlatComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(EditFlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
