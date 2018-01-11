import {BrowserModule} from '@angular/platform-browser';
import { FileUploadModule } from 'ng2-file-upload';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {LoginComponent} from './login/login.component';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {DashboardComponent} from './dashboard/dashboard.component';
import {routes} from "./app.routing";
import {AuthService} from "./services/auth.service";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";
import {AuthGuardService} from "./services/auth-guard.service";
import {AuthModule} from "./services/auth.module";
import {AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';
import {MuvesComponent} from './muves/muves.component';
import {AgmCoreModule} from "@agm/core";
import {Ng2MapModule} from "ng2-map";
import {ClarityModule} from "clarity-angular";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {EventsComponent} from './events/events.component';
import {ArraySortPipe, ChatComponent} from './chat/chat.component';
import {SailsModule} from "angular2-sails";
import {StatsComponent} from './stats/stats.component';
import {MusiqueComponent} from './musique/musique.component';
import {AideComponent} from "./aide/aide.component";
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    MuvesComponent,
    EventsComponent,
    ChatComponent,
    StatsComponent,
    MusiqueComponent,
    ArraySortPipe,
    AideComponent,
    ProfilComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AuthModule,
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCj4RVnfs3eU72CZXDIB9UG4NRt-VF1yOA&libraries=places'}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCj4RVnfs3eU72CZXDIB9UG4NRt-VF1yOA',
    }),
    ClarityModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    SailsModule.forRoot(),
    FileUploadModule,
  ],
  providers: [
    AuthGuardService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
