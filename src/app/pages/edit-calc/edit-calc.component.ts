import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { take } from 'rxjs'
import { Calculation } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface DialogData {
  calculation: Calculation
}

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
    this.route.params.subscribe(params => {
      const calcId = +params['calcId']
      if (!calcId) {
        return
      }

      this.dataStorage.flatYearCalculations$.pipe(take(1)).subscribe(calculations => {
        const calculation = calculations[calcId - 1]
        this.dialog.open(EditCalcDialog, {
          width: '800px',
          data: { calculation }
        })
      })
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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    //TODO
    console.log('data', this.data)

    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['..'])
    })
  }

}
