import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';

import { ImportDataDialog } from './import-data.component';

describe('ImportDataDialog', () => {
  let component: ImportDataDialog;
  let fixture: ComponentFixture<ImportDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataDialog],
      providers: [
        provideRouter([]),
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
