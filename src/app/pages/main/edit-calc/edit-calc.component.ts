import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Calculation, Flat } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'


/* Convert KWats to GCal */
const GCAL_CONST = 0.00086

interface DialogData {
  route: ActivatedRoute
  month: number
  prevCalculation?: Calculation
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
      const year = this.dataStorage.currentYear$.getValue() || 0
      const month = +params['month']
      if (!month) {
        return
      }

      const calculations = this.dataStorage.flatCalculations$.getValue()
      const prevCalculationYear = month === 1 ? year - 1 : year
      const prevCalculationMonth = month === 1 ? 12 : month - 1
      const prevCalculation = calculations.find(it => it.year === prevCalculationYear && it.month === prevCalculationMonth)
      const calculation = calculations.find(it => it.year === year && it.month === month)
      this.dialog.open(EditCalcDialog, {
        width: '800px',
        data: { route: this.route, prevCalculation, calculation, month }
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

  monthName: string
  form: FormGroup
  currentFlat: Flat
  autoCalcProps = [
    'hcs.electricityVolumeMonthly',
    'water.hotVolumeMonthly', 'water.coldVolumeMonthly',
    'heating.convertedVolume', 'heating.convertedVolumeMonthly'
  ]
  costProps = [
    'hcs.cost', 'water.cost', 'heating.cost', 'garbage.cost', 'overhaul.cost'
  ]

  constructor(
    public dataStorage: DataStorageService,
    private dialogRef: MatDialogRef<EditCalcDialog>,
    private router: Router,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.currentFlat = dataStorage.currentFlat$.getValue()!
    this.monthName = dataStorage.getMonthName(data.month)
    const prevElectricityVolume = data.prevCalculation?.hcs.electricityVolume || 0
    const prevColdWaterVolume = data.prevCalculation?.water.coldVolume || 0
    const prevHotWaterVolume = data.prevCalculation?.water.hotVolume || 0
    const prevHeatingVolume = data.prevCalculation?.heating.volume || 0
    const prevHeatingVolumeConverted = prevHeatingVolume * GCAL_CONST

    this.form = fb.group({
      flatId: [dataStorage.currentFlatId$.getValue()],
      year: [dataStorage.currentYear$.getValue()],
      month: [data.month],
      hcs: fb.group({
        electricityVolume: [null, [Validators.required, Validators.min(prevElectricityVolume)]],
        electricityVolumeMonthly: [null, [Validators.required, Validators.min(0)]],
        cost: [null, Validators.min(0)],
      }),
      water: fb.group({
        coldVolume: [null, [Validators.required, Validators.min(prevColdWaterVolume)]],
        coldVolumeMonthly: [null, [Validators.required, Validators.min(0)]],
        hotVolume: [null, [Validators.required, Validators.min(prevHotWaterVolume)]],
        hotVolumeMonthly: [null, [Validators.required, Validators.min(0)]],
        cost: [null, Validators.min(0)]
      }),
      heating: fb.group({
        volume: [null, [Validators.required, Validators.min(prevHeatingVolume)]],
        convertedVolume: [null, [Validators.required, Validators.min(prevHeatingVolumeConverted)]],
        convertedVolumeMonthly: [null, [Validators.required, Validators.min(0)]],
        cost: [null, Validators.min(0)]
      }),
      garbage: fb.group({
        cost: [null, Validators.min(0)]
      }),
      overhaul: fb.group({
        cost: [null, Validators.min(0)]
      })
    })

    // Auto calc props disabling
    this.autoCalcProps.forEach(propName => this.form.get(propName)?.disable())

    if (data.calculation) {
      this.form.setValue(data.calculation)
    } else {
      this.costProps.forEach(propName => this.form.get(propName)?.disable())
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
      const convertedVolume = Math.round(val * GCAL_CONST * precision) / precision
      const convertedVolumeMonthly = Math.round((convertedVolume - prevHeatingVolumeConverted) * precision) / precision
      this.form.patchValue({ heating: { convertedVolume, convertedVolumeMonthly } })
    })
  }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['../..'], { relativeTo: this.data.route })
    })
  }

  getTitle() {
    const currentYear = this.dataStorage.currentYear$.getValue()
    if (this.data.calculation) {
      return $localize`:@@main.edit-calc.edit_title:Edit calculation for ${this.monthName} ${currentYear}`
    }

    return $localize`:@@main.edit-calc.add_title:Add calculation for ${this.monthName} ${currentYear}`
  }

  onSave() {
    this.autoCalcProps.forEach(propName => this.form.get(propName)?.enable())
    this.costProps.forEach(propName => this.form.get(propName)?.enable())

    if (this.form.valid) {
      this.dataStorage.saveCalculation(this.form.value)
      this.dialogRef.close()
    }
  }

  onDelete() {
    if (!this.data.calculation) {
      return
    }

    const confirmationText = $localize`:@@main.edit-calc.confirm_delete:Are you sure to delete calculation for ${this.monthName} ${this.data.calculation.year}?`
    if (confirm(confirmationText)) {
      this.dataStorage.deleteCalculation(this.data.calculation)
      this.dialogRef.close()
    }
  }

  fillLastMonthGarbageCost() {
    this.form.patchValue({ garbage: { cost: this.data.prevCalculation?.garbage.cost } })
  }

  fillLastMonthOverhaulCost() {
    this.form.patchValue({ overhaul: { cost: this.data.prevCalculation?.overhaul.cost } })
  }

}
