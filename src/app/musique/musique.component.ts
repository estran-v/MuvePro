import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import * as _ from "lodash";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {forEach} from "@angular/router/src/utils/collection";
import {ActivatedRoute, Router} from "@angular/router";

@Pipe({
  name: 'sort'
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}


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
  musicToAdd;
  musicToAddDone = false;
  albumId = 0;
  claimModal = false;
  addAlbumModal = false;
  addToAlbumModal = false;
  loadingClaimModal = false;
  loadingAddAlbumModal = false;
  loadingAddToAlbumModal = false;
  alreadyClaimed = false;
  artistId = 0;
  public newAlbumForm = new FormGroup({
    releaseDate: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    tag: new FormControl(''),
    label: new FormControl(''),
    prod: new FormControl(''),
  });
  public editAlbumForm = new FormGroup({
    releaseDate: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    tag: new FormControl(''),
    label: new FormControl(''),
    prod: new FormControl(''),
  });
  deleteAlbum;
  deleteAlbumModal = false;
  editAlbum;
  editAlbumModal = false;
  loadingEditAlbumModal = false;

  constructor(private authHttp: AuthHttp,
              private Auth: AuthService,
              private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => {
        if (params.tab) {
          switch (params.tab) {
            case 'album' :
              this.claimActive = false;
              this.musicActive = false;
              this.albumActive = true;
              break;
          }
        }
        console.log(params);
      });
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
          this.myAlbums.forEach((album) => {
            if (_.filter(this.myMusics, m => m.album === album.id))
              album['nbMusic'] = _.filter(this.myMusics, m => m.album === album.id).length;
            else
              album['nbMusic'] = 0;
          });
          this.myMusics.forEach((music) => {
            if (music.album !== null) {
              const album = _.find(this.myAlbums, a => a.id === music.album);
              music['albumName'] = album.name;
            }
          });
        }
      }).catch((err) => {
        console.error(err);
      });
  }

  searchMusic() {
    this.musics = [];
    this.loading = true;
    this.musicToClaimDone = false;
    this.alreadyClaimed = false;
    this.noResult = false;
    this.authHttp.get(this.Auth.API + '/musics/search?title=' + this.title + '&artist=' + this.artist).toPromise()
      .then((res) => {
        if (res.json().results) {
          let local = _.find(res.json().results, r => r.provider === 'Local');
          console.log(this.myMusics);
          local.items.forEach((item) => {
            if (!_.find(this.myMusics, m => m.title === item.title)) {
              this.musics.push(item);
            }
          });
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
        if (res.json()[0]) {
          this.myMusics.push(res.json()[0]);
        }
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

  addToAlbum() {
    this.loadingAddToAlbumModal = true;
    this.authHttp.post(this.Auth.API + '/musics/' + this.musicToAdd.id + '/album', {album: this.albumId}).toPromise()
      .then((res) => {
        this.loadingAddToAlbumModal = false;
        this.musicToAddDone = true;
      }).catch((err) => {
      console.error(err);
    });
  }

  createEditAlbum() {
    this.editAlbumForm = new FormGroup({
      releaseDate: new FormControl(new Date(this.editAlbum.releaseDate), Validators.required),
      name: new FormControl(this.editAlbum.name, Validators.required),
      tag: new FormControl(this.editAlbum.tag),
      label: new FormControl(this.editAlbum.label),
      prod: new FormControl(this.editAlbum.prod),
    });
  }

  doDeleteAlbum() {
    this.authHttp.delete(this.Auth.API + '/albums/' + this.deleteAlbum.id).toPromise()
      .then((res) => {
        this.myAlbums.splice(this.myAlbums.indexOf(this.deleteAlbum), 1);
        this.deleteAlbum = null;
        this.deleteAlbumModal = false;
      }).catch((err) => {
      console.error(err);
    });
  }

  doEditAlbum() {
    this.loadingEditAlbumModal = true;
    this.editAlbumForm.value.releaseDate = new Date(this.editAlbumForm.value.releaseDate);
    this.authHttp.put(this.Auth.API + '/albums/' + this.editAlbum.id, this.editAlbumForm.value)
      .toPromise()
      .then((res) => {
        if (res.json()[0]) {
          const beforeEdit = _.find(this.myAlbums, m => m.id === res.json()[0].id);
          this.myAlbums[this.myAlbums.indexOf(beforeEdit)] = res.json()[0];
          this.editAlbumForm.reset();
          this.loadingEditAlbumModal = false;
          this.editAlbumModal = false;
        }
      }).catch((err) => {
      console.error(err);
    });
  }
}
