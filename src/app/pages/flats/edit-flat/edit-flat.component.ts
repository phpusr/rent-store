import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Flat } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface DialogData {
  route: ActivatedRoute,
  flat: Flat
}

@Component({
  selector: 'app-edit-flat',
  template: ''
})
export class EditFlatComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const flat = this.dataStorage.flats$.getValue().find(it => it.id === +params['flatId'])
      this.dialog.open(EditFlatDialog, {
        width: '800px',
        data: {
          route: this.route,
          flat
        }
      })
    })
  }

}

@Component({
  selector: 'app-edit-flat-dialog',
  templateUrl: './edit-flat.component.html',
  styleUrls: ['./edit-flat.component.scss']
})
export class EditFlatDialog implements OnInit {

  form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<EditFlatDialog>,
    private router: Router,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = fb.group({
      id: [null, Validators.required],
      address: [null, Validators.required],
      number: [null, [Validators.required, Validators.min(0)]]
    })

    if (data.flat) {
      this.form.setValue(data.flat)
    }
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['../..'], { relativeTo: this.data.route })
    })
  }

}
