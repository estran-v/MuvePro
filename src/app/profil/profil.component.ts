import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import {Router} from "@angular/router";
import {FileUploader, ParsedResponseHeaders, FileItem} from 'ng2-file-upload';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  public user: object = {
    user: {}
  };
  public artist: object = {};
  public uploader: FileUploader;
  public fileToUpload: any;
  public error = {
    msg: '',
    error: false,
  };


  constructor(public auth: AuthService, public authHttp: AuthHttp, public router: Router) {
  }

  ngOnInit() {
    this.authHttp.get(this.auth.API + '/me').toPromise()
      .then(res => {
        this.user = res.json();
        console.log(this.user);
      });
    this.authHttp.get(this.auth.API + '/artists/me').toPromise()
      .then(res => {
        this.artist = res.json();
      });
    const token = localStorage.getItem('accessToken');
    console.log(token);
    this.uploader = new FileUploader({
      url: this.auth.API + '/me/avatar',
      method: 'POST',
      authToken: 'Bearer ' + token,
      autoUpload: true,
    });
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    /*
     this.authHttp.get(this.auth.API + '/me/avatar').toPromise()
     .then(res => {
     console.log(this.artist)
     })
     */
  }

  onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders) {
    console.log(response);
  }

  onErrorItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders) {
    console.log(response);
  }

  public updateInfo(user, artist) {
    this.error.error = false;
    this.error.msg = '';
    // this.upload();
    this.authHttp.put(this.auth.API + '/me', user).toPromise()
      .then(res => {
        if (res.status > 400 && this.error.error == false) {
          this.error.msg = 'Impossible pour le moment essayez plus tard'
          this.error.error = true;
        }
        else {
          this.error.msg = 'Modifications enregistrées'
        }
      });
    this.authHttp.put(this.auth.API + '/artists/me', artist).toPromise()
      .then(res => {
        if (res.status > 400 && this.error.error == false) {
          this.error.msg = 'Impossible pour le moment essayez plus tard'
          this.error.error = true;
        }
        else {
          this.error.msg = 'Modifications enregistrées'
        }
      });
  }
}
