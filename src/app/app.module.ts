import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieInterceptor } from './CookieInterceptor';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  /**
   * Declaration list of components used within the application
   */
  declarations: [
    AppComponent,
    HomeComponent,
    WaitingRoomComponent,
  ],
  imports: [
    BrowserModule,
    // Routing between components allows to address them directly
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    // Material package modules used for map display
    MatGridListModule,
    MatButtonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: CookieInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
