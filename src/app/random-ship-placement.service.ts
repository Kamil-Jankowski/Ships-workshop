import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import {throwError } from 'rxjs';

/**
* Service provides communication with RandomShipPlacementService.
* @Injectable - allowing for it to be injected as constructor parameter
*/
@Injectable({
  providedIn: 'root'
})
export class RandomShipPlacementService {
  private randomShipPlacementUrl = 'https://ships-random-placement-service.herokuapp.com/randomplacement';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Using injection of http client
   * @param http - http clientrequired for communication
   */
  constructor(private http: HttpClient) { }

  createNewSetOfMapsForGivenPlayer(name: string){
    let url : string = `${this.randomShipPlacementUrl}/${name}`
    return this.http.post(url, this.httpOptions) 
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  }
}
