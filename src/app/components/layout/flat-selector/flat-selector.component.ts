import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/services/data_storage.service'

@Component({
  selector: 'app-flat-selector',
  templateUrl: './flat-selector.component.html',
  styleUrls: ['./flat-selector.component.scss']
})
export class FlatSelectorComponent implements OnInit {

  constructor(public dataStorage: DataStorageService) { }

  ngOnInit(): void {
    
  }

}
