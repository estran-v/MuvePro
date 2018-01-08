import {Component, OnInit} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import * as _ from "lodash";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  myMusics = [];
  myAlbums = [];
  musicToClaim;
  musicToClaimDone = false;
  claimModal = false;
  addAlbumModal = false;
  loadingClaimModal = false;
  loadingAddAlbumModal = false;
  alreadyClaimed = false;
  artistId = 45;
  public newAlbumForm = new FormGroup({
    releaseDate: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    tag: new FormControl(''),
    label: new FormControl(''),
    prod: new FormControl(''),
  });

  constructor(private authHttp: AuthHttp,
              private Auth: AuthService) {
  }

  ngOnInit() {
    this.getMyMusics();
  }

  getMyMusics() {
    return this.authHttp.get(this.Auth.API + '/artists/me').toPromise()
      .then((res) => {
        if (res.json()) {
          this.artistId = res.json().id;
          this.myMusics = res.json().musics;
          this.myAlbums = res.json().albums;
        }
      }).catch((err) => {
        console.error(err);
      });
  }

  searchMusic() {
    this.loading = true;
    this.musicToClaimDone = false;
    this.alreadyClaimed = false;
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
        }
      }).catch((err) => {
      console.error(err);
    });
  }

  confirmClaim() {
    this.loadingClaimModal = true;
    const artist = this.Auth.getUser().user;
    this.authHttp.post(this.Auth.API + '/musics/' + this.musicToClaim.id.split('-')[1] + '/claim', {
      artist: artist
    })
      .toPromise()
      .then((res) => {
        this.musicToClaimDone = true;
        this.loadingClaimModal = false;
      }).catch((err) => {
      if (err.text() === 'music already owned') {
        this.alreadyClaimed = true;
        this.loadingClaimModal = false;
      }
    });
  }

  closeClaimModal() {
    this.musicToClaimDone = false;
    this.alreadyClaimed = false;
    this.claimModal = false;
  }

  createAlbum() {
    this.loadingAddAlbumModal = true;
    this.newAlbumForm.value.releaseDate = new Date(this.newAlbumForm.value.releaseDate);
    this.authHttp.post(this.Auth.API + '/albums', this.newAlbumForm.value)
      .toPromise()
      .then((res) => {
        this.myAlbums.push(res.json());
        this.newAlbumForm.reset();
        this.loadingAddAlbumModal = false;
        this.addAlbumModal = false;
      }).catch((err) => {
        console.error(err);
    });
  }
}
