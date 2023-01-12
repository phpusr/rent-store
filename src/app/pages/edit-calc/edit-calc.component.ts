import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Calculation } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface DialogData {
  month: number
  prevCalculations?: Calculation
  calculation?: Calculation
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
      const month = +params['month']
      if (!month) {
        return
      }

      const calculations = this.dataStorage.flatYearCalculations$.getValue()
      const prevCalculations = calculations.find(it => it.month === month - 1)
      const calculation = calculations.find(it => it.month === month)
      this.dialog.open(EditCalcDialog, {
        width: '800px',
        data: { prevCalculations, calculation, month }
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

  month: string
  form: FormGroup
  autoCalcProps: string[]

  constructor(
    public dataStorage: DataStorageService,
    private dialogRef: MatDialogRef<EditCalcDialog>,
    private router: Router,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.autoCalcProps = [
      'hcs.electricityVolumeMonthly', 'hcs.cost',
      'water.hotVolumeMonthly', 'water.coldVolumeMonthly', 'water.cost',
      'heating.convertedVolume', 'heating.convertedVolumeMonthly', 'heating.cost',
      'garbage.cost', 'overhaul.cost'
    ]

    this.month = dataStorage.getMonthName(data.month)
    const prevElectricityVolume = this.data.prevCalculations?.hcs?.electricityVolume || 0

    this.form = fb.group({
      flatId: [dataStorage.currentFlatId$.getValue()],
      year: [dataStorage.currentYear$.getValue()],
      month: [data.month],
      hcs: fb.group({
        electricityVolume: ['', Validators.min(prevElectricityVolume)],
        electricityVolumeMonthly: ['', Validators.min(0)],
        cost: [''],
      }),
      water: fb.group({
        coldVolume: ['', Validators.required],
        coldVolumeMonthly: { value: '', disabled: true },
        hotVolume: ['', Validators.required],
        hotVolumeMonthly: { value: '', disabled: true },
        cost: ['']
      }),
      heating: fb.group({
        volume: ['', Validators.required],
        convertedVolume: { value: '', disabled: true },
        convertedVolumeMonthly: { value: '', disabled: true },
        cost: ['']
      }),
      garbage: fb.group({
        cost: ['']
      }),
      overhaul: fb.group({
        cost: ['']
      })
    })

    this.autoCalcProps.forEach(propName => this.form.get(propName)?.disable())

    if (data.calculation) {
      this.form.setValue(data.calculation)
    }

    this.form.get('hcs.electricityVolume')?.valueChanges.subscribe(val => {
      this.form.patchValue({ hcs: { electricityVolumeMonthly: val - prevElectricityVolume } })
    })
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['../..'])
    })


  }

  onSave() {
    this.autoCalcProps.forEach(propName => this.form.get(propName)?.enable())

    if (this.form.valid) {
      this.dataStorage.saveCalculation(this.form.value)
      this.dialogRef.close()
    }
  }

}
