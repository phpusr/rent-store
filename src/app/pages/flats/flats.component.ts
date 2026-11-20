import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Flat } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { MatSort, MatSortHeader } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router'
import { MatAnchor } from '@angular/material/button'

@Component({
  selector: 'app-flats',
  templateUrl: './flats.component.html',
  styleUrls: ['./flats.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, MatAnchor, RouterLink, MatTableModule, MatSort, MatSortHeader]
})
export class FlatsComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<Flat>()
  displayColumns = ['id', 'address', 'number', 'hcsLink', 'waterLink', 'heatingLink', 'garbageLink', 'overhaulLink']
  private flatsSub?: Subscription

  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.flatsSub = this.dataStorage.flats$.subscribe(flats => {
      this.dataSource = new MatTableDataSource(flats)
      this.dataSource.sort = this.sort
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  ngOnDestroy(): void {
    this.flatsSub?.unsubscribe()
  }

  onCreateFlat()  {
    this.router.navigate(['create'])
  }

  onEditFlat(flat: Flat) {
    this.router.navigate([flat.id, 'edit'], { relativeTo: this.route })
  }

}
