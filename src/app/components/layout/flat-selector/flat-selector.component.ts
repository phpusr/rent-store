import {Component} from '@angular/core'
import {MatFormField, MatLabel} from '@angular/material/form-field'
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select'
import {DataStorageService} from 'src/app/services/data_storage.service'
import {AsyncPipe} from '@angular/common'

@Component({
  selector: 'app-flat-selector',
  templateUrl: './flat-selector.component.html',
  styleUrls: ['./flat-selector.component.scss'],
  imports: [MatFormField, MatLabel, MatSelect, MatOption, AsyncPipe]
})
export class FlatSelectorComponent {

  constructor(public dataStorage: DataStorageService) { }

  onChangeFlat(selectChange: MatSelectChange) {
    this.dataStorage.setCurrentFlatId(selectChange.value)
  }

}
