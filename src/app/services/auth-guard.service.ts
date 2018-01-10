import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.auth.refresh();
    }
    return false;
  }
}
