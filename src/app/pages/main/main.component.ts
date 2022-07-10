import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Calculation } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface TableType {
  month: string
  electricityVolume: number
  electricityVolumeMonthly: number
  hcs_cost: number
  coldWaterVolume: number
  coldWaterVolumeMonthly: number
  hotWaterVolume: number
  hotWaterVolumeMonthly: number
  waterCost: number
  heatingVolume?: number
  heatingConvertedVolume?: number
  heatingConvertedVolumeMonthly?: number
  garbageCost?: number
  overhaulCost?: number
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  dataSource: TableType[] = []
  displayedColumns = [
    'month',
    'electricity', 'electricityMonthly', 'hcs_cost',
    'coldWaterVolume', 'coldWaterVolumeMonthly', 'hotWaterVolume', 'hotWaterVolumeMonthly', 'waterCost',
    'heatingVolume', 'heatingConvertedVolume', 'heatingConvertedVolumeMonthly',
    'garbageCost', 'overhaulCost'
  ]
  private calcSub?: Subscription

  constructor(
    public dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.calcSub = this.dataStorage.flatYearCalculations$.subscribe(calculations => {
      this.dataSource = calculations.map(calc => ({
        month: this.dataStorage.getMonthName(calc.month),
        electricityVolume: calc.hcs.electricityVolume,
        electricityVolumeMonthly: calc.hcs.electricityVolumeMonthly,
        hcs_cost: calc.hcs.cost,
        coldWaterVolume: calc.water.coldVolume,
        coldWaterVolumeMonthly: calc.water.coldVolumeMonthly,
        hotWaterVolume: calc.water.hotVolume,
        hotWaterVolumeMonthly: calc.water.coldVolumeMonthly,
        waterCost: calc.water.cost,
        heatingVolume: calc.heating?.volume,
        heatingConvertedVolume: calc.heating?.convertedVolume,
        heatingConvertedVolumeMonthly: calc.heating?.convertedVolumeMonthly,
        garbageCost: calc.garbage?.cost,
        overhaulCost: calc.overhaul?.cost
      }))
    })
  }

  onEditCalc(rowIndex: number) {
    this.router.navigate(['edit-calc', rowIndex + 1], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }
}
