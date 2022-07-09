import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface TableType {
  month: number
  electricity: number
  electricityMonthly: number
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

  constructor(public dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.calcSub = this.dataStorage.flatYearCalculations$.subscribe(calculations => {
      this.dataSource = calculations.map(calc => ({
        month: calc.month,
        electricity: calc.hcs.electricity,
        electricityMonthly: calc.hcs.electricityMonthly,
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

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }
}
