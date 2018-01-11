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
  public lastSender = null;
  public stats = null;
  public latestMuve = null;

  constructor(public auth: AuthService, public authHttp: AuthHttp, public router: Router) {
  }

  ngOnInit() {
    this.getArtistInfos();
    this.getRooms();
    this.getMuves();
  }

  getRooms() {
    this.authHttp.get(this.auth.API + '/rooms').toPromise()
      .then((res) => {
        if (res.json().rooms.length > 0) {
          const latestRoom = _.orderBy(res.json().rooms, 'updatedAt', 'desc')[0];
          this.authHttp.get(this.auth.API + '/rooms/' + latestRoom.id).toPromise()
            .then((response) => {
              const othersMsg = _.filter(response.json().messages, m =>  m.sender !== this.auth.getUser().user.id);
              this.latestMsg = _.orderBy(othersMsg, 'createdAt', 'desc')[0];
              return this.authHttp.get(this.auth.API + '/users/' + this.latestMsg.sender).toPromise()
                .then((resp) => {
                  this.lastSender = resp.json().user;
                }).catch((error) => {
                  console.error(error);
              });
            }).catch((error) => {
              console.error(error);
            });
        }
      }).catch((err) => {
      console.error(err);
    });
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
          this.nextEvent = _.orderBy(eventsToCome, 'date', 'asc')[0];
        }
      }).catch((err) => {
        console.error(err);
      });
  }

  getMuves() {
    return this.authHttp.get(this.auth.API + '/me/muves').toPromise()
      .then((res) => {
        this.latestMuve = _.orderBy(res.json(), 'createdAt', 'desc')[0];
        console.log(this.latestMuve);
      }).catch((err) => {
        console.error(err);
      });
  }

  goTo(page, tabs: string = null) {
    if (!tabs) {
      this.router.navigate([page]);
    } else {
      this.router.navigate([page], {queryParams: {tab: tabs}});
    }
  }
}
