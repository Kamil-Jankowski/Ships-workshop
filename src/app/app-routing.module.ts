import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { GameComponent } from './game/game.component';
import { LandingComponent } from './landing/landing.component';

/**
 * Router configuration mapping urls to angular components;
 * Routing to be changed: default will redirect to home
 */
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'landing/:type', component: LandingComponent},
  { path: 'home', component: HomeComponent },
  { path: 'waiting-room/:name', component: WaitingRoomComponent },
  { path: 'game/:name', component: GameComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }