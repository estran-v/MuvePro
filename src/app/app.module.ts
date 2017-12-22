import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {LoginComponent} from './login/login.component';
import {RouterModule} from "@angular/router";
import {DashboardComponent} from './dashboard/dashboard.component';
import {routes} from "./app.routing";
import {AuthService} from "./services/auth.service";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";
import {AuthGuardService} from "./services/auth-guard.service";
import {AuthModule} from "./services/auth.module";
import {AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';
import { MuvesComponent } from './muves/muves.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    MuvesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AuthModule,
  ],
  providers: [
    AuthGuardService,
    AuthService,
    AuthHttp,
    provideAuth({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'accessToken',
      tokenGetter: (() => localStorage.getItem('accessToken')),
      globalHeaders: [{'Content-Type': 'application/json'}],
      noJwtError: true
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
