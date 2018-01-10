import { Component, OnInit } from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import Dygraph from 'dygraphs';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})

export class StatsComponent implements OnInit {
  noMuves = false;
  constructor(private authHttp: AuthHttp,
              private auth: AuthService) {
  }
  ngOnInit() {
    this.auth.getUserApi().subscribe((user) => {
    let checkMuve = user.json();
    if (checkMuve.user.muves.length === 0){
      this.noMuves = true;
    }
    console.log(this.noMuves);
    });
  }

  drawGraphTotal(){
    // this.authHttp.get(this.Auth.API + 'music/search?title=');
      const t = new Dygraph(document.getElementById('graphTotal'),
        'Date, Vue\n' + '2008-05-07,75\n' + '2008-05-08,150\n' + '2008-05-09,0\n');
  }
  drawGraphLike(){

    const l = new Dygraph(document.getElementById('graphLike'),
      'Date, Vue\n' + '2008-05-07,75\n' + '2008-05-08,50\n' + '2008-05-09,0\n');
  }
  drawGraphMuve(){
    const l = new Dygraph(document.getElementById('graphLike'),
      'Date, Vue\n' + '2008-05-07,75\n' + '2008-05-08,50\n' + '2008-05-09,0\n');
  }
  drawGraphRange(){
    const l = new Dygraph(document.getElementById('graphLike'),
      'Date, Vue\n' + '2008-05-07,75\n' + '2008-05-08,50\n' + '2008-05-09,0\n');
  }
  }
