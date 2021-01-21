import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
  
import { Observable, throwError } from 'rxjs';

import { Player } from './player';
import { StatusWithToken } from './StatusWithToken';

/**
* Service provides communication with backend for players requests.
* @Injectable - allowing for it to be injected as constructor parameter
*/
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersUrl = 'https://ships-room-service-backend.herokuapp.com/room';
  

  /**
   * Using injection of http client
   * @param http - http clientrequired for communication
   */
  constructor(private http: HttpClient) { }
  
  /** GET players from the server */
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersUrl).pipe(catchError(this.handleError));
  }

  /**
   * POST: add a new player to the server
   * @param player - player to be added
   */
  addPlayer(name: string): Observable<StatusWithToken> {
    let url: string = `${this.playersUrl}/${name}`;
    return this.http.post<StatusWithToken>(url, {}).pipe(catchError(this.handleError));
  }
  
  /**
   * DELETE: deletes the player from the server
   * @param name - player name to be removed from the server
   */
  deletePlayer(name: string): Observable<Player> {
    const url = `${this.playersUrl}/${name}`;

    return this.http.delete<Player>(url).pipe(catchError(this.handleError));
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
}
