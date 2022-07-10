import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { combineLatest } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'

@Component({
  selector: 'app-edit-calc',
  template: ''
})
export class EditCalcComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.dataStorage.flatYearCalculations$
    ]).subscribe(([params, calculations]) => {
      const calcId = +params['calcId']
      if (!calcId) {
        return
      }

      const calc = calculations[calcId - 1]
      //TODO
      console.log('calc', calc)
    })

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

  constructor(
    private dialogRef: MatDialogRef<EditCalcDialog>,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['..'])
    })
  }

}
