import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-edit-calc',
  template: ''
})
export class EditCalcComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(EditCalcDialog, {
      width: '800px'
    })
  }

}

@Component({
  selector: 'app-edit-calc-dialog',
  templateUrl: './edit-calc.component.html',
  styleUrls: ['./edit-calc.component.scss']
})
export class EditCalcDialog implements OnInit {

  constructor(private dialogRef: MatDialogRef<EditCalcDialog>) {
  }

  ngOnInit(): void {
  }

}
