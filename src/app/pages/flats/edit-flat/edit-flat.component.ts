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
        width: '450px',
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
    private dataStorage: DataStorageService,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = fb.group({
      id: [null],
      address: [null, Validators.required],
      number: [null, [Validators.required, Validators.min(0)]],
      hcsLink: [null],
      waterLink: [null],
      heatingLink: [null],
      garbageLink: [null],
      overhaulLink: [null]
    })

    if (data.flat) {
      this.form.setValue(data.flat)
    }
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      const navigationUrl = this.data.flat ? ['../..'] : ['..']
      this.router.navigate(navigationUrl, { relativeTo: this.data.route })
    })
  }

  onSave() {
    if (this.form.valid) {
      this.dataStorage.saveFlat(this.form.value)
      this.dialogRef.close()
    }
  }

  onDelete() {
    const { flat } = this.data
    if (!flat) {
      return
    }

    const confirmText = $localize`:@@flats.edit-flat.delete_confirmation:Are you sure to delete "${flat.address} ${flat.number}"?`

    if (confirm(confirmText)) {
      this.dataStorage.deleteFlat(flat.id)
      this.dialogRef.close()
    }
  }

}
