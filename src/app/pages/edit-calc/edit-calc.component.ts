import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Calculation } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'


/* Convert WATS to GKAL */
const GKAL_CONST = 0.00086

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
    const prevColdWaterVolume = this.data.prevCalculations?.water?.coldVolume || 0
    const prevHotWaterVolume = this.data.prevCalculations?.water?.hotVolume || 0
    const prevHeatingVolume = this.data.prevCalculations?.heating?.volume || 0
    const prevHeatingVolumeConverted = prevHeatingVolume * GKAL_CONST

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
        coldVolume: ['', Validators.min(prevColdWaterVolume)],
        coldVolumeMonthly: ['', Validators.min(0)],
        hotVolume: ['', Validators.min(prevHotWaterVolume)],
        hotVolumeMonthly: ['', Validators.min(0)],
        cost: ['']
      }),
      heating: fb.group({
        volume: ['', Validators.min(prevHeatingVolume)],
        convertedVolume: ['', Validators.min(prevHeatingVolumeConverted)],
        convertedVolumeMonthly: ['', Validators.min(0)],
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
    this.form.get('water.coldVolume')?.valueChanges.subscribe(val => {
      this.form.patchValue({ water: { coldVolumeMonthly: val - prevColdWaterVolume } })
    })
    this.form.get('water.hotVolume')?.valueChanges.subscribe(val => {
      this.form.patchValue({ water: { hotVolumeMonthly: val - prevHotWaterVolume } })
    })
    this.form.get('heating.volume')?.valueChanges.subscribe(val => {
      const precision = 10000
      const convertedVolume = Math.round(val * GKAL_CONST * precision) / precision
      const convertedVolumeMonthly = Math.round((convertedVolume - prevHeatingVolumeConverted) * precision) / precision
      this.form.patchValue({ heating: { convertedVolume, convertedVolumeMonthly } })
    })
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['..'])
    })
  }

  onSave() {
    this.autoCalcProps.forEach(propName => this.form.get(propName)?.enable())

    if (this.form.valid) {
      this.dataStorage.saveCalculation(this.form.value)
      this.dialogRef.close()
    }
  }

  onDelete() {
    if (!this.data.calculation) {
      return
    }

    if (confirm(`Are you sure to delete calculation for ${this.data.calculation.month}.${this.data.calculation.year}?`)) {
      this.dataStorage.deleteCalculation(this.data.calculation)
      this.dialogRef.close()
    }
  }

}
