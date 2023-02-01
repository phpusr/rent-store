import { Component, OnInit } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Router } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 1px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    public dataStorage: DataStorageService
  ) { }

  ngOnInit(): void {
  }

  exportData(): void {
    const data = {
      currentFlatId: this.dataStorage.currentFlatId$.getValue(),
      currentYear: this.dataStorage.currentYear$.getValue(),
      flats: this.dataStorage.flats$.getValue(),
      calculations: this.dataStorage.calculations$.getValue()
    }
    const blob = new Blob([JSON.stringify(data, null, ' ')])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'export.json'
    a.click()
  }

}
