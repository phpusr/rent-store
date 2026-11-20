import {Component, OnInit} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {ActivatedRoute, RouterOutlet} from '@angular/router'
import {DataStorageService} from 'src/app/services/data_storage.service'
import {CalcTableComponent} from './calc-table/calc-table.component'
import {NgStyle} from '@angular/common'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [RouterOutlet, CalcTableComponent, NgStyle]
})
export class MainComponent implements OnInit {

  private readonly splitMode = toSignal(this.dataStorage.isSplitMode$, { requireSync: true })

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
    return this.splitMode()
  }

  getTableStyles() {
    if (this.isSplitMode()) {
      return { width: 'calc(50% - 3px)' }
    }

    return { width: '100%' }
  }
}
