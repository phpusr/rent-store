import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { EditFlatComponent, EditFlatDialog } from './edit-flat.component';

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

  it('should open a flat imported without optional links', () => {
    const flat = { id: 1, address: 'Test address', number: '42' };
    const dialog = TestBed.inject(MatDialog).open(EditFlatDialog, {
      data: { flat, route: TestBed.inject(ActivatedRoute) }
    });

    expect(dialog.componentInstance.form.value).toEqual({
      ...flat,
      hcsLink: null,
      waterLink: null,
      heatingLink: null,
      garbageLink: null,
      overhaulLink: null
    });
    dialog.close();
  });
});
