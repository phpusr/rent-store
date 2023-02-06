import { OnInit, Component, Renderer2 } from '@angular/core';
import { DataStorageService } from './services/data_storage.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private dataStorage: DataStorageService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.dataStorage.initValues()
    this.switchMode(false)
  }

  switchMode(isDarkMode: boolean) {
    this.renderer.removeClass(document.body, isDarkMode ? 'theme-light' : 'theme-dark')
    this.renderer.addClass(document.body, isDarkMode ? 'theme-dark' : 'theme-light')
  }

}
