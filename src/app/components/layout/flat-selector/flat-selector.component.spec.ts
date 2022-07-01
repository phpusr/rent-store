import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSelectorComponent } from './flat-selector.component';

describe('FlatSelectorComponent', () => {
  let component: FlatSelectorComponent;
  let fixture: ComponentFixture<FlatSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatSelectorComponent ]
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
