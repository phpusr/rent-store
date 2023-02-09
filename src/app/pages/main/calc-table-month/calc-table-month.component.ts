import { Component, OnInit } from '@angular/core'
import { DataStorageService } from 'src/app/services/data_storage.service'

interface TableType {
  month: string
}

@Component({
  selector: 'app-calc-table-month',
  templateUrl: './calc-table-month.component.html',
  styleUrls: ['./calc-table-month.component.scss']
})
export class CalcTableMonthComponent implements OnInit {

  dataSource: TableType[] = []
  displayedColumns = ['month']

  constructor(dataStorage: DataStorageService) {
    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      this.dataSource.push({ month: dataStorage.getMonthName(monthIndex) })
    }
  }

  ngOnInit(): void {}

}
