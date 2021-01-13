import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationType } from '../notification.message';
import { ActivatedRoute } from '@angular/router';

/**
 * Represents end page to be shown after the game is terminated or ended by one of the player.
 */
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    public translate: TranslateService) {}

  /**
   * On page initialization prints toast notifications about winning/loosing in appropriate language.
   */
  ngOnInit(): void {
    let type :string = this.route.snapshot.paramMap.get('type');
    if(type === "win"){
      this.translate
        .get('TOAST.WIN')
        .subscribe((msg: string) => {this.notificationService.print(msg, NotificationType.warning)});
    }
    else if(type === "loose"){
      this.translate
        .get('TOAST.LOOSE')
        .subscribe((msg: string) => {this.notificationService.print(msg, NotificationType.warning)});
    }
  }
}
