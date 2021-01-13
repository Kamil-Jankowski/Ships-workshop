import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Player } from '../player';
import { PlayerService } from '../player.service';
import { Square } from '../square';
import { GameService } from '../game.service';
import { ShootMapCellStatus } from '../shoot-map-cell-status.enum';
import { ShipMapCellStatus } from '../ship-map-cell-status.enum';
import { NotificationService } from '../notification.service';
import { NotificationType } from '../notification.message';
import { ButtonStatus } from '../button-status.enum';


/**
 * Represents game view of the app, contains map components in:
 * @see game.component.html
 */
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy{

  static readonly NUMBER_OF_SQUARES : number = 100;
  static readonly NUMBER_OF_PLAYERS_IN_ROOM = 2;
  
  player: Player = {name : ''};
  playerTurn : Player = {name : ''};
  shipMap: Square[] = [];
  shootMap: Square[] = [];

  private opponent: Player = {name : ''};
  private subscription: Subscription;
 
  private isGameSetToPLayersTurn : boolean = false;
  private isFirstTurn : boolean = true;
  
  private hitMessage: string;
  private missMessage: string;
  private turnMessage: string;
  private enemyTurnMessage: string;

  /**
   * Using injection route, and player and message services
   * @param messageService - messaging service used to provide messages on the website
   * @param playerService - player service used to get information about the player from the route
   * @param route - allows to verify player by id using the url which opened the game
   */
  constructor(
    public gameService: GameService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private notificationService: NotificationService) {
      this.hitMessage = 'TOAST.HIT';
      this.missMessage = 'TOAST.MISS';
      this.turnMessage = 'TOAST.YOUR_TURN';
      this.enemyTurnMessage = 'TOAST.ENEMY_TURN';
   }

  ngOnInit(): void {
    this.player = {name : this.route.snapshot.paramMap.get('name')};
    this.getOpponent();
    this.initializeEmptyMaps();
    this.getShootMap();
    this.getShipMap();

    this.subscription = timer(0, 2000)
    .pipe(switchMap(() => this.gameService.getCurrentGameStatus()))
    .subscribe( currentGameStatus => {
        if(currentGameStatus.playerNameWhoMoves === this.player.name && !currentGameStatus.playerLooser){
          if(!this.isGameSetToPLayersTurn)
          {
            this.showMessage(this.turnMessage, NotificationType.info);
            this.getShipMap();
            this.unlockAllShotSquares();
            this.isGameSetToPLayersTurn = true;
            this.isFirstTurn = false;
          }
        }
        else if(currentGameStatus.playerNameWhoMoves === this.opponent.name && !currentGameStatus.playerLooser){
          this.blockAllShotSquares();
          this.isGameSetToPLayersTurn = false;
          if(this.isFirstTurn){
            this.showMessage(this.enemyTurnMessage, NotificationType.info);
            this.isFirstTurn = false;
          }
        }
        else if(currentGameStatus.playerNameWhoMoves === this.opponent.name && currentGameStatus.playerLooser){
          this.router.navigate(['/landing/win']);
        }
        else if(currentGameStatus.playerNameWhoMoves === this.player.name && currentGameStatus.playerLooser){
          this.router.navigate(['/landing/loose']);
        }
        this.playerTurn = {name : currentGameStatus.playerNameWhoMoves};
    } );
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
    this.playerService.deletePlayer(this.player.name).subscribe();
    this.gameService.deletePlayer(this.player.name).subscribe();
  }

  /**
   * Handles the shoot and its response. Changes the button status.
   * @param id - square identification number
   */
  changeStatus(id: number): void {
    if(this.shootMap[id].status != ButtonStatus.EMPTY){
      return;
    }
    this.gameService.shootPlayer(this.player.name, this.opponent.name, id)
      .subscribe(shootResponse =>{
        let cellStatus : ShootMapCellStatus = shootResponse.shootMapCellStatus;
        const currentButton = this.shootMap[id];
        if(cellStatus === ShootMapCellStatus.SHOOT_MAP_SHIP_HIT) {
          currentButton.status = ButtonStatus.HIT;
          this.showMessage(this.turnMessage, NotificationType.info);
          this.showMessage(this.hitMessage, NotificationType.success);
          this.playerTurn = this.player;
          if(shootResponse.winner){
            this.router.navigate(['/landing/win']);
          }
        } else if(cellStatus === ShootMapCellStatus.SHOOT_MAP_MISS){
          currentButton.status = ButtonStatus.MISS;
          this.showMessage(this.enemyTurnMessage, NotificationType.info);
          this.showMessage(this.missMessage, NotificationType.error);
          this.playerTurn = this.opponent;
          this.blockAllShotSquares();
        }
        this.shootMap[id] = currentButton;
    });
  }

  private initializeEmptyMaps() : void {
    for (let i = 0; i <GameComponent.NUMBER_OF_SQUARES; i++) {
      this.shipMap.push({id : i, status : ButtonStatus.EMPTY_BLOCKED});
      this.shootMap.push({id : i, status : ButtonStatus.EMPTY_BLOCKED});
    }
  }

  private getOpponent(): void {
    this.playerService.getPlayers()
    .subscribe(
      players => {
        for(let index =0; index < GameComponent.NUMBER_OF_PLAYERS_IN_ROOM; ++index){
          if(players[index].name != this.player.name){
            this.opponent = players[index];
          }
        }
      });
  }

  private getShootMap(): void {
    this.gameService.getShootMap(this.player.name).subscribe(
      mapShootMap =>{ this.mapShootMapToArray(mapShootMap)}
    );
 }

 private getShipMap(): void {
   this.gameService.getShipMap(this.player.name).subscribe(
     mapShipMap =>{ this.mapShipMapToArray(mapShipMap);}
   );
}

 private mapShootMapToArray(shootMap : Map<number, ShootMapCellStatus>) : void{
   Object.keys(shootMap).forEach(key => {
     this.shootMap[key] = {id : parseInt(key),
        status : shootMap[key] === ShootMapCellStatus.SHOOT_MAP_MISS
         ? ButtonStatus.MISS :ButtonStatus.HIT};
     });
 }

 private mapShipMapToArray(shipMap : Map<number, ShipMapCellStatus>) : void{
   Object.keys(shipMap).forEach( key => {
     this.shipMap[key] = {id : parseInt(key),
      //TODO: change it to switch-case
        status : shipMap[key] === ShipMapCellStatus.SHIP_MAP_MISS ? ButtonStatus.MISS :
        shipMap[key] === ShipMapCellStatus.SHIP_MAP_SHIP 
        ? ButtonStatus.SHIP : ButtonStatus.HIT};
       });
     }  

  private showMessage(message: string, type: NotificationType) {
    this.translate
        .get(message)
        .subscribe((msg: string) => {this.notificationService.print(msg, type)});
  }

  private blockAllShotSquares() : void{
    for(let square of this.shootMap){
        square.status = square.status === ButtonStatus.EMPTY ? ButtonStatus.EMPTY_BLOCKED : square.status;
    }
  }

  private unlockAllShotSquares(): void{
    for(let square of this.shootMap){
      square.status = square.status === ButtonStatus.EMPTY_BLOCKED ? ButtonStatus.EMPTY : square.status;
    }
  }
}
