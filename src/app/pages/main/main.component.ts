import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface TableType {
  month: number,
  electricity: number,
  electricityMonthly: number,
  hcs_cost: number
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  dataSource: TableType[] = []
  displayedColumns = ['month', 'electricity', 'electricityMonthly', 'hcs_cost']
  private calcSub?: Subscription

  constructor(public dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.calcSub = this.dataStorage.flatYearCalculations$.subscribe(calculations => {
      this.dataSource = calculations.map(calc => ({
        month: calc.month,
        electricity: calc.hcs.electricity,
        electricityMonthly: calc.hcs.electricityMonthly,
        hcs_cost: calc.hcs.cost
      }))
    })
  }

  ngOnDestroy(): void {
    this.calcSub?.unsubscribe()
  }
}
