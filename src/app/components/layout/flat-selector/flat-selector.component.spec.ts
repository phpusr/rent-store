import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { FlatSelectorComponent } from './flat-selector.component';

describe('FlatSelectorComponent', () => {
  let component: FlatSelectorComponent;
  let fixture: ComponentFixture<FlatSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatSelectorComponent],
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
