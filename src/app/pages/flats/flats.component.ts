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
  templateUrl: './flats.component.html',
  styleUrls: ['./flats.component.scss']
})
export class FlatsComponent implements OnInit, OnDestroy {

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
      this.dataSource = years.map(year => {
        let yearSum = 0
        const yearFlatCalculations = flatCalculations.filter(it => it.year === year)
        yearFlatCalculations.forEach(it => {
          yearSum += this.utils.getTotalCostCalculation(it)
        })
        return {
          year,
          allCost: yearSum,
          avgCost: yearFlatCalculations.length ? yearSum / yearFlatCalculations.length : 0
        }
      })

      console.log('ds', this.dataSource)
    })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }

}
