import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AuthHttp} from "angular2-jwt/angular2-jwt";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public auth: AuthService, public authHttp: AuthHttp) { }

  ngOnInit() {
    console.log(this.auth.loggedIn());
    this.authHttp.get(this.auth.API + '/me').toPromise().then(res => {
      console.log(res);
    });
  }

}
