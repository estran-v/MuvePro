import { Component, OnInit } from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import {toPromise} from 'rxjs/operator/toPromise';
import Chart from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})

export class StatsComponent implements OnInit {
  noMuves = false;
  nbrTotalListen = 0;
  nbrTotalLike = 0;
  nbrTotalMuves = 0;
  nbrMale = 0;
  nbrFemale = 0;
  nbrOther = 0;
  nbrTotalListener = 0;
  constructor(private authHttp: AuthHttp,
              private auth: AuthService) {
  }
  ngOnInit() {
    this.getTotalMuves();
    this.getTotalListen();
    this.getTotalLike();
    this.getTotalListener();
    // this.drawChartListener();
    }

  getTotalMuves() {
    this.auth.getUserApi().subscribe((user) => {
      let checkMuve = user.json();
      this.nbrTotalMuves = checkMuve.muves.created;
      if (checkMuve.user.muves.length === 0) {
        this.noMuves = true;
      }
    });
  }

  getTotalListen() {
    this.authHttp.get(this.auth.API + '/artists/me').toPromise()
      .then((res) => {
        let x = 0;
        let tempMusics = res.json().musics;
        let tempMusicsLenght = tempMusics.length;
        while (x < tempMusicsLenght){
          this.authHttp.get(this.auth.API + '/musics/' + tempMusics[x].id).toPromise()
            .then((res) => {
              if (res.json()) {
                let i = 0;
                let temp = res.json().listeningCount;
                let tempLenght = temp.length;
                while (i < tempLenght) {
                  this.nbrTotalListen += temp[i].count;
                  i++;
                }
              }
            });
          x++;
        }
      }).catch((err) => {
      console.error(err);
    });
  }

  getTotalLike() {
    this.authHttp.get(this.auth.API + '/me/muves').toPromise()
      .then((res) => {
        let y = 0;
        let tempLike = res.json();
        let tempLikeLenght = tempLike.length;
        while (y < tempLikeLenght) {
          this.authHttp.get(this.auth.API + '/muves/' + tempLike[y].id).toPromise()
            .then((res) => {
              if (res.json()) {
                let tempCheckLike = res.json();
                this.nbrTotalLike += tempCheckLike.like.length;
              }
            });
          y++;
        }
      }).catch((err) => {
      console.error(err);
    });
  }

  getTotalListener() {
    this.authHttp.get(this.auth.API + '/artists/me').toPromise()
      .then((res) => {
        let x = 0;
        let tempMusics = res.json().musics;
        let tempMusicsLenght = tempMusics.length;
        while (x < tempMusicsLenght){
          this.authHttp.get(this.auth.API + '/musics/' + tempMusics[x].id).toPromise()
            .then((res) => {
              if (res.json()) {
                let i = 0;
                let temp = res.json().listeningCount;
                let tempLenght = temp.length;
                console.log(temp);
                while (i < tempLenght) {
                  this.authHttp.get(this.auth.API + '/users/' + temp[i].user).toPromise()
                    .then((res) => {
                      let genderType = res.json().user.gender;
                      console.log(genderType);
                      if (genderType === 'male') {
                        this.nbrMale++;
                      }
                      if (genderType === 'female') {
                        this.nbrFemale++;
                      }
                      if (genderType === 'other') {
                        this.nbrOther++;
                      }
                      this.nbrTotalListener++;
                      console.log('   ' + this.nbrOther);
                      console.log(this.nbrTotalListener);

                    });
                  i++;
                }
              }
            });
          console.log('final ' + this.nbrOther);
          x++;
        }
      }).catch((err) => {
      console.error(err);
    });
  }

  drawChartListener() {
    let ctx = document.getElementById('chartListener');
    console.log(this.nbrOther);
    let chartListener = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Homme', 'Femme', 'Autre'],
        datasets: [{
          label: 'Genre',
          data: [this.nbrMale, this.nbrFemale, this.nbrOther],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      }
    });
    console.log('yolo');
  }
}

