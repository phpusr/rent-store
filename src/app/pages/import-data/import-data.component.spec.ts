import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDataDialog } from './import-data.component';

describe('ImportDataComponent', () => {
  let component: ImportDataDialog;
  let fixture: ComponentFixture<ImportDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDataDialog ]
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
