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
  public API = 'http://devapi.muve-app.com';

  constructor(public authHttp: AuthHttp,
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
          localStorage.setItem('refreshToken', response.json().refresh_token);
          this.getUserApi().toPromise().then((res) => {
            this.user = res.json();
            localStorage.setItem('user', JSON.stringify(this.user));
            return true;
          }).catch((err) => {
            console.error(err);
          });
        }
      })
      .catch(response => {
        console.log(response.json());
      });
  }

  getUser() {
    if (this.user) {
      return this.user;
    } else if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      return this.user;
    } else {
      return null;
    }
  }

  getUserApi() {
    return this.authHttp.get(this.API + '/me');
  }

  refresh() {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken')});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.API + '/login', {
      'refres_token': localStorage.getItem('refreshToken'),
      'grant_type': 'refresh_token'
    }, options)
      .toPromise()
      .then(response => {
        if (response.json().access_token) {
          localStorage.setItem('accessToken', response.json().access_token);
          localStorage.setItem('refreshToken', response.json().refresh_token);
          return true;
        }
      })
      .catch(response => {
        console.log(response.json());
      });
  }

  getToken() {
    if (this.loggedIn()){
      return localStorage.getItem('accessToken');
    }
    return false;
  }

  loggedIn() {
    if (!tokenNotExpired('accessToken') && localStorage.getItem('refreshToken') === null) {
      return tokenNotExpired('accessToken');
    } else if (!tokenNotExpired('accessToken') && localStorage.getItem('refreshToken') !== null){
      this.refresh().then((res) => {
        return tokenNotExpired('accessToken');
      });
    } else {
      return tokenNotExpired('accessToken');
    }
  }
}
