import { Component, OnInit } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { ImportDataDialog } from 'src/app/pages/import-data/import-data.component'
import { MatDialog } from '@angular/material/dialog'

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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.onImportData()
  }

  onImportData() {
    this.dialog.open(ImportDataDialog, {
      width: '400px'
    })
  }

}
