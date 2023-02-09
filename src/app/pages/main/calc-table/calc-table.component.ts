import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { UtilsService } from 'src/app/services/utils.service'

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
  electricityVolume: number
  hcsCost: number
  coldWaterVolume: number
  hotWaterVolume: number
  waterCost: number
  heatingConvertedVolume: number
  heatingCost: number
  garbageCost: number
  overhaulCost: number
  totalCost: number
}

@Component({
  selector: 'app-calc-table',
  templateUrl: './calc-table.component.html',
  styleUrls: ['./calc-table.component.scss']
})
export class CalcTableComponent implements OnInit, OnDestroy {

  @Input() splitModeTable = false
  dataSource: TableType[] = []
  displayedColumns = [
    'electricity', 'electricityMonthly', 'hcsCost',
    'coldWaterVolume', 'coldWaterVolumeMonthly', 'hotWaterVolume', 'hotWaterVolumeMonthly', 'waterCost',
    'heatingVolume', 'heatingConvertedVolume', 'heatingConvertedVolumeMonthly', 'heatingCost',
    'garbageCost', 'overhaulCost', 'totalCost'
  ]
  footerDisplayColumns = ['month', 'hcsCost']
  footerRow: FooterRowType = this.getFooterRowInitValues()
  private calcSub?: Subscription
  private splitSub?: Subscription

  constructor(
    public dataStorage: DataStorageService,
    private utils: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.splitSub = this.dataStorage.isSplitMode$.subscribe(isSplitMode => {
      if (isSplitMode) {
        this.displayedColumns = this.displayedColumns.filter(it => it !== 'month')
      } else {
        if (!this.displayedColumns.includes('month')) {
          this.displayedColumns.unshift('month')
        }
      }
    })

    const calculations = this.splitModeTable ? this.dataStorage.splitFlatYearCalculations$ : this.dataStorage.flatYearCalculations$
    this.calcSub = calculations.subscribe(calculations => {
      this.dataSource = []
      this.footerRow = this.getFooterRowInitValues()
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
          hotWaterVolumeMonthly: calc?.water.hotVolumeMonthly,
          waterCost: calc?.water.cost,
          heatingVolume: calc?.heating.volume,
          heatingConvertedVolume: calc?.heating.convertedVolume,
          heatingConvertedVolumeMonthly: calc?.heating.convertedVolumeMonthly,
          heatingCost: calc?.heating.cost,
          garbageCost: calc?.garbage.cost,
          overhaulCost: calc?.overhaul.cost,
          totalCost: this.utils.getTotalCostCalculation(calc)
        }
        this.dataSource.push(convertedCalc)

        this.footerRow.electricityVolume += calc?.hcs.electricityVolumeMonthly || 0
        this.footerRow.hcsCost += calc?.hcs.cost || 0
        this.footerRow.coldWaterVolume += calc?.water.coldVolumeMonthly || 0
        this.footerRow.hotWaterVolume += calc?.water.hotVolumeMonthly || 0
        this.footerRow.waterCost += calc?.water.cost || 0
        this.footerRow.heatingConvertedVolume += calc?.heating.convertedVolumeMonthly || 0
        this.footerRow.heatingCost += calc?.heating.cost || 0
        this.footerRow.garbageCost += calc?.garbage.cost || 0
        this.footerRow.overhaulCost += calc?.overhaul.cost || 0
        this.footerRow.totalCost += convertedCalc.totalCost
      }
    })
  }

  getCurrentYear() {
    return this.splitModeTable ? this.dataStorage.splitYear$.getValue() : this.dataStorage.currentYear$.getValue()
  }

  getLink(year: number) {
    if (!this.dataStorage.isSplitMode$.getValue()) {
      return ['..', year]
    }

    let action = ''
    if (this.splitModeTable) {
      action = `${this.dataStorage.currentYear$.getValue()}-${year}`
    } else {
      action = `${year}-${this.dataStorage.splitYear$.getValue()}`
    }

    return ['..', action]
  }

  getFooterRowInitValues(): FooterRowType {
    return {
      electricityVolume: 0,
      hcsCost: 0,
      coldWaterVolume: 0,
      hotWaterVolume: 0,
      waterCost: 0,
      heatingConvertedVolume: 0,
      heatingCost: 0,
      garbageCost: 0,
      overhaulCost: 0,
      totalCost: 0
    }
  }

  onEditCalc(calc: TableType) {
    if (this.splitModeTable) {
      return
    }

    this.router.navigate([calc.monthIndex, 'edit'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
    this.splitSub?.unsubscribe()
  }
}
