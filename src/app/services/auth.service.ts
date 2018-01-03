/**
 * Created by Hub-Grade on 17/12/2017.
 */
import {Injectable} from '@angular/core';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Headers, RequestOptions, Http} from '@angular/http';
import {Router} from '@angular/router';

import 'rxjs/add/operator/toPromise';

declare var Smooch: any;

@Injectable()
export class AuthService {
  // jwtHelper: JwtHelper = new JwtHelper();
  public user;
  public API = 'https://devapi.muve-app.com';

  constructor(// public authHttp: AuthHttp,
    private http: Http,
    private router: Router) {
  }

  login(loginCredentials) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.API + '/login', {
      'email': loginCredentials.email,
      'password': loginCredentials.password,
      'grant_type': 'password'
    }, options)
      .toPromise()
      .then(response => {
        if (response.json().access_token) {
          localStorage.setItem('accessToken', response.json().access_token);
          localStorage.setItem('userMail', loginCredentials.email);
          localStorage.setItem('refreshToken', JSON.stringify({'refresh': response.json().refresh_token}));
          return true;
        }
      })
      .catch(response => {
        console.log(response.json());
      });
  }

  loggedIn() {
    return tokenNotExpired('accessToken');
  }
}
