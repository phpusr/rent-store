import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DataStorageService } from 'src/app/services/data_storage.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    public dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }
}
