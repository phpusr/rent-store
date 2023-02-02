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
  hcsCost?: number
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

interface FooterRowType {
  hcsCost: number
  waterCost: number
  heatingCost: number
  garbageCost: number
  overhaulCost: number
  totalCost: number
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
    'electricity', 'electricityMonthly', 'hcsCost',
    'coldWaterVolume', 'coldWaterVolumeMonthly', 'hotWaterVolume', 'hotWaterVolumeMonthly', 'waterCost',
    'heatingVolume', 'heatingConvertedVolume', 'heatingConvertedVolumeMonthly', 'heatingCost',
    'garbageCost', 'overhaulCost', 'totalCost'
  ]
  footerDisplayColumns = ['month', 'hcsCost']
  footerRow: FooterRowType = { hcsCost: 0, waterCost: 0, heatingCost: 0, garbageCost: 0, overhaulCost: 0, totalCost: 0 }
  private calcSub?: Subscription

  constructor(
    public dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dataStorage.setCurrentYear(+params['year'])
    })

    this.calcSub = this.dataStorage.flatYearCalculations$.subscribe(calculations => {
      this.dataSource = []
      this.footerRow = { hcsCost: 0, waterCost: 0, heatingCost: 0, garbageCost: 0, overhaulCost: 0, totalCost: 0 }
      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        const calc = calculations.find(it => it.month === monthIndex)
        const convertedCalc = {
          monthIndex: monthIndex,
          month: this.dataStorage.getMonthName(monthIndex),
          electricityVolume: calc?.hcs.electricityVolume,
          electricityVolumeMonthly: calc?.hcs.electricityVolumeMonthly,
          hcsCost: calc?.hcs.cost,
          coldWaterVolume: calc?.water.coldVolume,
          coldWaterVolumeMonthly: calc?.water.coldVolumeMonthly,
          hotWaterVolume: calc?.water.hotVolume,
          hotWaterVolumeMonthly: calc?.water.coldVolumeMonthly,
          waterCost: calc?.water.cost,
          heatingVolume: calc?.heating.volume,
          heatingConvertedVolume: calc?.heating.convertedVolume,
          heatingConvertedVolumeMonthly: calc?.heating.convertedVolumeMonthly,
          heatingCost: calc?.heating.cost,
          garbageCost: calc?.garbage.cost,
          overhaulCost: calc?.overhaul.cost,
          totalCost: (calc?.hcs.cost || 0) + (calc?.water.cost || 0) + (calc?.heating.cost || 0) + (calc?.garbage.cost || 0) + (calc?.overhaul.cost || 0)
        }
        this.dataSource.push(convertedCalc)

        this.footerRow.hcsCost += calc?.hcs.cost || 0
        this.footerRow.waterCost += calc?.water.cost || 0
        this.footerRow.heatingCost += calc?.heating.cost || 0
        this.footerRow.garbageCost += calc?.garbage.cost || 0
        this.footerRow.overhaulCost += calc?.overhaul.cost || 0
        this.footerRow.totalCost += convertedCalc.totalCost
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
