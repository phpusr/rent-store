import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Router } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @Output() onSwitchTheme = new EventEmitter<boolean>()

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

  switchTheme({ checked }: MatSlideToggleChange) {
    this.onSwitchTheme.emit(checked)
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
