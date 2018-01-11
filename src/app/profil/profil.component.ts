import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import {Router} from "@angular/router";
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  public user : object = {
    user : {}
  };
  public artist : object = {};
  public uploader:FileUploader = new FileUploader({url: this.auth.API});
  public error = {
    msg : '',
    error : false,
  };

  public upload() {
    let i = 0;
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      let responsePath = JSON.parse(response);
      console.log(responsePath);
    };
  }

  public updateInfo(user, artist) {
    this.error.error = false;
    this.error.msg = '';
    this.upload();
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

  constructor(public auth: AuthService, public authHttp: AuthHttp, public router: Router) { }

  ngOnInit() {
    this.uploader = new FileUploader({ url: this.auth.API + '/me/avatar', method: 'POST' });
    this.authHttp.get(this.auth.API + '/me').toPromise()
      .then(res => {
        this.user = res.json();
        console.log(this.user);
      });
    this.authHttp.get(this.auth.API + '/artists/me').toPromise()
      .then(res => {
        this.artist = res.json();
      });
/*
    this.authHttp.get(this.auth.API + '/me/avatar').toPromise()
      .then(res => {
        console.log(this.artist)
      })
*/
  }


}
