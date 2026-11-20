import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { CalcTableComponent } from './calc-table/calc-table.component'
import { NgStyle } from '@angular/common'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, CalcTableComponent, NgStyle]
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

  getTableStyles() {
    if (this.isSplitMode()) {
      return {
        width: `calc(50% - 3px)`
      }
    }

    return { width: '100%' }
  }
}
