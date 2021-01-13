import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { PlayerService } from '../player.service';
import { Player } from '../player';
import { GameService } from '../game.service';
import { RandomShipPlacementService } from '../random-ship-placement.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Represents welcome view of the app
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private players: Player[];
  error_message:string;

  /**
   * Injecting player service for communication purpose
   * @param playerService - player communication service to be used
   * @param router - router to be used
   */
  constructor(private playerService: PlayerService,
    private randomShipPlacementService: RandomShipPlacementService,
    private gameService: GameService,
    private translate: TranslateService,
    private router: Router) { }
  
  /**
   * Calls for getPlayers() method on component initialization
   */
  ngOnInit() {
    this.getPlayers();
    this.error_message = ""; 
  }

  /**
   * Adds new player to the list and sends the player to the server
   * @param name - player name
   */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.playerService.addPlayer(name)
      .subscribe(
        () => {
          this.error_message = '';
          this.randomShipPlacementService.createNewSetOfMapsForGivenPlayer(name).subscribe(
          () =>{this.router.navigate(['/waiting-room/' + name])})  
        },
        error => { 
          console.log(error); 
          if (error === 'ROOM_IS_FULL') {
            this.assignErrorMessage('HOME.FULL');
          } else if (error === 'NICKNAME_DUPLICATION') {
            this.assignErrorMessage('HOME.NICKNAME_DUPLICATION');
          } else {
            this.assignErrorMessage('HOME.ERROR');
          }
        }
      );
  }


  /**
   * Delete all players in the frontend, RoomService and GameService
   * @param name - player name
   */
  delete(): void {
    this.playerService.deleteAllPlayers()
      .subscribe(
        () => {this.players = [];}, 
        error => { 
          console.log(error); 
          this.error_message = error;});
    this.gameService.deleteAllPlayers().subscribe();
  }


  private assignErrorMessage(error: string) {
    this.translate
        .get(error)
        .subscribe((error: string) => this.error_message = error);
  }

  /**
   * Gets players list from the server;
   * Can be used to redirect to landing page if list already contains two players
   */
  private getPlayers(): void {
    this.playerService.getPlayers()
    .subscribe(players => this.players = players);
  }
}
