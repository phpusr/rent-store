import { OnInit, Component } from '@angular/core';
import { DataStorageService } from './services/data_storage.service'
import { tmpStore } from './services/temp_data'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataStorage.initValues(tmpStore)
    }, 100)
  }

}
