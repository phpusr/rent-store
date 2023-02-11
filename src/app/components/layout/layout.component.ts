import { Component, OnInit } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isMainPage = false

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 1px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    public router: Router,
    public dataStorage: DataStorageService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isMainPage = event.url == '/' || event.url.startsWith('/main/')
      }
    })
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

  switchTheme({ checked }: MatSlideToggleChange) {
    this.dataStorage.setIsDarkMode(checked)
  }

  switchSplitMode({ checked }: MatSlideToggleChange) {
    let action = ''
    const currentYear = this.dataStorage.currentYear$.getValue()
    if (checked) {
      action = `${currentYear}-${currentYear}`
    } else {
      action = '' + currentYear
    }
    this.router.navigate(['main', action])
  }

}
