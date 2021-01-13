import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

import { ShootMapCellStatus } from './shoot-map-cell-status.enum';
import { ShipMapCellStatus } from './ship-map-cell-status.enum';
import { ShootResponse } from './shoot-response';
import { CurrentGameStatus } from './current-game-status';

/**
* Service provides communication with GameService.
* @Injectable - allowing for it to be injected as constructor parameter
*/
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameUrl = 'https://ships-game-service-backend.herokuapp.com/maps';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Using injection of http client
   * @param http - http clientrequired for communication
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets ship map from GameService.
   * @param name - name of the player, whose ship map is get
   * @returns the Observable of Map of numbers and ShipMapCellStatus
  */

  getShipMap(name: string) : Observable<Map<number, ShipMapCellStatus>>{
    let url : string = `${this.gameUrl}/shipmap/${name}`
    return this.http.get<Map<number, ShipMapCellStatus>>(url, this.httpOptions) 
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets shoot map from GameService.
   * @param name - name of the player, whose shoot map is get
   * @returns the Observable of Map of numbers and ShootMapCellStatus
   */
  getShootMap(name: string) : Observable<Map<number, ShootMapCellStatus>>{
    let url : string = `${this.gameUrl}/shootmap/${name}`
    return this.http.get<Map<number, ShootMapCellStatus>>(url, this.httpOptions) 
      .pipe(catchError(this.handleError));
  }

  /**
   * Posts a new shoot.
   * @param sourceName - name of the player, who shoots
   * @param targetName - name of the player, who is shot
   * @param cellIndex - index of map that is shoot
   * @returns the ShootMapCellSrtatus of shot cell index and winner condition
   */
  shootPlayer(sourceName : string, targetName : string, cellIndex : number) : Observable<ShootResponse>{
    let url : string = `${this.gameUrl}/${sourceName}-vs-${targetName}/${cellIndex}`;
    return this.http.post<ShootResponse>(url, this.httpOptions) 
    .pipe(catchError(this.handleError));
  }

  /**
   * Get current game status.
   * It is used for synchronization betweeen frontend and game service.
   * @returns name of the player whose turn is and looser condition.
   */
  getCurrentGameStatus() : Observable<CurrentGameStatus>{
    let url : string = `${this.gameUrl}/gamestatus`;
    return this.http.get<CurrentGameStatus>(url, this.httpOptions) 
    .pipe(catchError(this.handleError));
  }

  /**
   * Deletes all boards and players in GameService 
   */
  deleteAllPlayers() : Observable<any> {
    return this.http.delete(this.gameUrl, this.httpOptions) 
    .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a player in GameService 
   * @param name - name of the player to delete
   */
  deletePlayer(name : string) : Observable<any> {
    let url: string = `${this.gameUrl}/${name}`;
    return this.http.delete(url, this.httpOptions) 
    .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
}
