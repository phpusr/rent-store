import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Flat } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-flats',
  templateUrl: './flats.component.html',
  styleUrls: ['./flats.component.scss']
})
export class FlatsComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<Flat>()
  displayColumns = ['id', 'address', 'number']
  private flatsSub?: Subscription

  @ViewChild(MatSort) sort!: MatSort

  constructor(private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.flatsSub = this.dataStorage.flats$.subscribe(flats => {
      this.dataSource = new MatTableDataSource(flats)
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  ngOnDestroy(): void {
    this.flatsSub?.unsubscribe()
  }

}
