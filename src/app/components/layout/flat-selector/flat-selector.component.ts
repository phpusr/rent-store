import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select'
import { Subscription } from 'rxjs/internal/Subscription'
import { DataStorageService } from 'src/app/services/data_storage.service'

@Component({
  selector: 'app-flat-selector',
  templateUrl: './flat-selector.component.html',
  styleUrls: ['./flat-selector.component.scss']
})
export class FlatSelectorComponent implements OnInit, OnDestroy {

  currentFlatId?: number
  private cfSub?: Subscription

  constructor(public dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.cfSub = this.dataStorage.currentFlat$.subscribe(flat => {
      this.currentFlatId = flat?.id
    })
  }

  onChangeFlat(selectChange: MatSelectChange) {
    this.dataStorage.currentFlatId$.next(selectChange.value)
  }

  ngOnDestroy(): void {
    this.cfSub?.unsubscribe()
  }

}
