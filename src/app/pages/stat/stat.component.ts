import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, combineLatest } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { UtilsService } from 'src/app/services/utils.service'

interface TableType {
  year: number
  allCost: number
  avgCost: number
}

@Component({
  selector: 'app-flats',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit, OnDestroy {

  dataSource: TableType[] = []
  displayColumns = ['year', 'allCost', 'avgCost']
  private calcSub?: Subscription

  constructor(
    private dataStorage: DataStorageService,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.calcSub = combineLatest([
      this.dataStorage.flatCalculations$,
      this.dataStorage.years$
    ]).subscribe(([flatCalculations, years]) => {
      for (let index = 0; index < years.length - 1; index++) {
        let calcCount = 0
        const yearSum = flatCalculations.filter(it => {
          return it.year === years[index]
        }).reduce((sum, it) => {
          calcCount++
          return sum + this.utils.getTotalCostCalculation(it)
        }, 0)

        this.dataSource.push({
          year: years[index],
          allCost: yearSum,
          avgCost: calcCount ? yearSum / calcCount : 0
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }

}
