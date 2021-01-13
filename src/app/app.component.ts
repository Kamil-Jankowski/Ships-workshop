import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Main view of the app.
 * Encapsulates other components.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Ships: The Game';

  constructor(
    private toastr: ToastrService,
    private notificationService: NotificationService,
    public translate: TranslateService
    ){
      translate.addLangs(['en', 'pl']);
      translate.setDefaultLang('en');
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|pl/) ? browserLang : 'en');
    }

    ngOnInit(): void {
    }
  

  switchLang(lang: string) {
    this.translate.use(lang);
  }
  
}
