import {Component, OnInit} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import * as _ from "lodash";

@Component({
  selector: 'app-musique',
  templateUrl: './musique.component.html',
  styleUrls: ['./musique.component.css']
})
export class MusiqueComponent implements OnInit {

  claimActive = true;
  musicActive = false;
  albumActive = false;
  title = '';
  artist = '';
  loading = false;
  noResult = false;
  musics = [];

  constructor(private authHttp: AuthHttp,
              private Auth: AuthService) {
  }

  ngOnInit() {
  }

  searchMusic() {
    this.loading = true;
    this.noResult = false;
    this.authHttp.get(this.Auth.API + '/musics/search?title=' + this.title + '&artist=' + this.artist).toPromise()
      .then((res) => {
        if (res.json().results) {
          let local = _.find(res.json().results, r => r.provider === 'Local');
          this.musics = local.items;
          if (this.musics.length === 0)
            this.noResult = true;
          else
            this.noResult = false;
          this.loading = false;
          console.log(local);
        }
      }).catch((err) => {
      console.error(err);
    });
  }
}
