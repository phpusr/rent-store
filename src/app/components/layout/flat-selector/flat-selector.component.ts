import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select'
import { Subscription } from 'rxjs/internal/Subscription'
import { DataStorageService } from 'src/app/services/data_storage.service'
import { NgFor, AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-flat-selector',
  templateUrl: './flat-selector.component.html',
  styleUrls: ['./flat-selector.component.scss'],
  imports: [MatFormField, MatLabel, MatSelect, NgFor, MatOption, AsyncPipe]
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
    this.dataStorage.setCurrentFlatId(selectChange.value)
  }

  ngOnDestroy(): void {
    this.cfSub?.unsubscribe()
  }

}
