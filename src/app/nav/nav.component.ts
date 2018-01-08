import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public router: Router, public auth: AuthService) {
    console.log(this.router.url.indexOf('muves'));
  }

  ngOnInit() {
  }

  goTo(page) {
    this.router.navigate([page]);
  }

}
