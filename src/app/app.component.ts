import {Component, OnInit, Renderer2} from '@angular/core'
import {DataStorageService} from './services/data_storage.service'
import {LayoutComponent} from './components/layout/layout.component'
import {RouterOutlet} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [LayoutComponent, RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private dataStorage: DataStorageService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.dataStorage.initValues()
    this.dataStorage.isDarkMode$.subscribe(this.switchMode.bind(this))
  }

  switchMode(isDarkMode: boolean) {
    this.renderer.removeClass(document.body, isDarkMode ? 'theme-light' : 'theme-dark')
    this.renderer.addClass(document.body, isDarkMode ? 'theme-dark' : 'theme-light')
  }

}
