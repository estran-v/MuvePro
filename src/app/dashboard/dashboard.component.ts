import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import {EventsComponent} from '../events/events.component';
import * as _ from 'lodash';
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public nextEvent = null;
  public latestAlbum = null;
  public latestMsg = null;
  public stats = null;
  public latestMuve = null;

  constructor(public auth: AuthService, public authHttp: AuthHttp, public router: Router) {
  }

  ngOnInit() {
    this.authHttp.get(this.auth.API + '/me').toPromise().then(res => {
      console.log(res.json());
    });
    this.getArtistInfos();
  }

  getArtistInfos() {
    return this.authHttp.get(this.auth.API + '/artists/me').toPromise()
      .then((res) => {
        const albumToRelease = _.filter(res.json().albums, a => new Date(a.releaseDate).getTime() <= new Date().getTime());
        if (albumToRelease.length > 0) {
          this.latestAlbum = _.orderBy(albumToRelease, 'releaseDate', 'desc')[0];
        }
        const eventsToCome = _.filter(res.json().events, e => new Date(e.date).getTime() >= new Date().getTime());
        if (eventsToCome.length > 0) {
          this.nextEvent = _.orderBy(eventsToCome, 'date', 'desc')[0];
        }
        console.log(res.json());
      }).catch((err) => {
        console.error(err);
      });
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

  goTo(page, tabs: string = null) {
    if (!tabs) {
      this.router.navigate([page]);
    } else {
      this.router.navigate([page], { queryParams: { tab: tabs } });
    }
  }
}
