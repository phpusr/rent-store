import {Component} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {BreakpointObserver} from '@angular/cdk/layout'
import {Observable} from 'rxjs'
import {filter, map, shareReplay} from 'rxjs/operators'
import {NavigationStart, Router, RouterLink} from '@angular/router'
import {DataStorageService} from 'src/app/services/data_storage.service'
import {MatSlideToggle, MatSlideToggleChange} from '@angular/material/slide-toggle'
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav'
import {MatToolbar} from '@angular/material/toolbar'
import {MatListItem, MatNavList} from '@angular/material/list'
import {AsyncPipe} from '@angular/common'
import {MatAnchor, MatIconButton} from '@angular/material/button'
import {MatIcon} from '@angular/material/icon'
import {FlatSelectorComponent} from './flat-selector/flat-selector.component'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatToolbar,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSlideToggle,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    MatAnchor,
    FlatSelectorComponent,
    AsyncPipe,
  ]
})
export class LayoutComponent {

  isMainPage = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map(event => event.url === '/' || event.url.startsWith('/main/'))
  ), { initialValue: false })

  private readonly currentYear = toSignal(this.dataStorage.currentYear$, { requireSync: true })

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

  getImportDataLink(): string[] {
    return ['/main', '' + this.currentYear(), 'import-data']
  }

  exportData(): void {
    const confirmText = $localize`:@@layout.export_data.confirmation_text:Are you sure to export data?`
    if (!confirm(confirmText)) {
      return
    }

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
