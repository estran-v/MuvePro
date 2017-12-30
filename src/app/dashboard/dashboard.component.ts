import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import {EventsComponent} from '../events/events.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public nextEvent;

  constructor(public auth: AuthService, public authHttp: AuthHttp) { }

  ngOnInit() {
    console.log(this.auth.loggedIn());

    this.authHttp.get(this.auth.API + '/me').toPromise().then(res => {
      console.log(res);
    });
    console.log('lol');

  }
  getEvents() {
    return this.authHttp.get(this.auth.API + '/me/events').toPromise()
      .then((res) => {
        res.json().results.forEach(event => {
          if (new Date() < new Date(event.date)) {
            console.log(Date);
          }
        });
      }).catch((err) => {
        console.error(err);
      });
  }
}
