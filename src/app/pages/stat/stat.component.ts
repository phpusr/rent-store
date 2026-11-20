import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {combineLatest, Subscription} from 'rxjs'
import {DataStorageService} from 'src/app/services/data_storage.service'
import {UtilsService} from 'src/app/services/utils.service'
import {MatSort, MatSortHeader} from '@angular/material/sort'
import {MatTableDataSource, MatTableModule} from '@angular/material/table'

interface TableType {
  year: number
  allCost: number
  avgCost: number
}

@Component({
  selector: 'app-flats',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  imports: [MatTableModule, MatSort, MatSortHeader]
})
export class StatComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<TableType>([])
  displayColumns = ['year', 'allCost', 'avgCost']
  private calcSub?: Subscription

  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private dataStorage: DataStorageService,
    private utils: UtilsService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.calcSub = combineLatest([
      this.dataStorage.flatCalculations$,
      this.dataStorage.years$
    ]).subscribe(([flatCalculations, years]) => {
      const tableData = []
      for (let index = 0; index < years.length - 1; index++) {
        let calcCount = 0
        const yearSum = flatCalculations.filter(it => {
          return it.year === years[index]
        }).reduce((sum, it) => {
          calcCount++
          return sum + this.utils.getTotalCostCalculation(it)
        }, 0)

        tableData.push({
          year: years[index],
          allCost: yearSum,
          avgCost: calcCount ? yearSum / calcCount : 0
        })
      }
      this.dataSource = new MatTableDataSource(tableData)
      this.dataSource.sort = this.sort
      this.changeDetector.markForCheck()
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }

}
