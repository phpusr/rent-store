import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { LocalStorageService } from 'src/app/services/local_storage.service'

interface TableType {
  monthIndex: number
  month: string
  electricityVolume?: number
  electricityVolumeMonthly?: number
  hcs_cost?: number
  coldWaterVolume?: number
  coldWaterVolumeMonthly?: number
  hotWaterVolume?: number
  hotWaterVolumeMonthly?: number
  waterCost?: number
  heatingVolume?: number
  heatingConvertedVolume?: number
  heatingConvertedVolumeMonthly?: number
  heatingCost?: number
  garbageCost?: number
  overhaulCost?: number
  totalCost?: number
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
    'heatingVolume', 'heatingConvertedVolume', 'heatingConvertedVolumeMonthly', 'heatingCost',
    'garbageCost', 'overhaulCost', 'totalCost'
  ]
  currentYear = LocalStorageService.currentYear
  private calcSub?: Subscription

  constructor(
    public dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentYear = +params['year']
      this.dataStorage.setCurrentYear(this.currentYear)
    })

    this.calcSub = this.dataStorage.flatYearCalculations$.subscribe(calculations => {
      this.dataSource = []
      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        const calc = calculations.find(it => it.month === monthIndex)
        const convertedCalc = {
          monthIndex: monthIndex,
          month: this.dataStorage.getMonthName(monthIndex),
          electricityVolume: calc?.hcs.electricityVolume,
          electricityVolumeMonthly: calc?.hcs.electricityVolumeMonthly,
          hcs_cost: calc?.hcs.cost,
          coldWaterVolume: calc?.water.coldVolume,
          coldWaterVolumeMonthly: calc?.water.coldVolumeMonthly,
          hotWaterVolume: calc?.water.hotVolume,
          hotWaterVolumeMonthly: calc?.water.coldVolumeMonthly,
          waterCost: calc?.water.cost,
          heatingVolume: calc?.heating?.volume,
          heatingConvertedVolume: calc?.heating?.convertedVolume,
          heatingConvertedVolumeMonthly: calc?.heating?.convertedVolumeMonthly,
          heatingCost: calc?.heating?.cost,
          garbageCost: calc?.garbage?.cost,
          overhaulCost: calc?.overhaul?.cost,
          totalCost: (calc?.hcs.cost || 0) + (calc?.water.cost || 0) + (calc?.heating?.cost || 0) + (calc?.garbage?.cost || 0) + (calc?.overhaul?.cost || 0)
        }
        this.dataSource.push(convertedCalc)
      }
    })
  }

  onEditCalc(calc: TableType) {
    this.router.navigate([calc.monthIndex, 'edit'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }
}
