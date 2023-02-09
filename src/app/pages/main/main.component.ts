import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'

const MONTH_COLUMN_WIDTH = 100

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    public dataStorage: DataStorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const years = params['year'].split('-')
      this.dataStorage.setCurrentYear(+years[0])
      this.dataStorage.setSplitYear(+years[1])
    })
  }

  isSplitMode(): boolean {
    return this.dataStorage.isSplitMode$.getValue()
  }

  getMonthColumnStyles() {
    return {
      width: `${MONTH_COLUMN_WIDTH}px`
    }
  }

  getTableStyles() {
    if (this.isSplitMode()) {
      return {
        width: `calc(50% - ${MONTH_COLUMN_WIDTH / 2 + 10}px)`
      }
    }

    return { width: '100%' }
  }
}
