/**
 * Created by Hub-Grade on 17/12/2017.
 */
import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {MuvesComponent} from "./muves/muves.component";
import {EventsComponent} from "./events/events.component";
import {ChatComponent} from "./chat/chat.component";

export const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'muves', component: MuvesComponent, canActivate: [AuthGuardService]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuardService]},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuardService]}
];
