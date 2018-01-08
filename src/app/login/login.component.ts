import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {AuthHttp} from 'angular2-jwt';
import {Http} from '@angular/http';
import {until} from 'selenium-webdriver';
import elementIsSelected = until.elementIsSelected;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public error: string;
  public isLoading: boolean = false;
  public isSend: boolean = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthService,
              private http: Http,
              private authHttp: AuthHttp) {
    this.createForm();
    if (this.auth.loggedIn())
      this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
    if (this.auth.loggedIn())
      this.router.navigate(['/dashboard']);
  }

  login() {
    this.isLoading = true;
    this.error = '';
    this.auth.login(this.loginForm.value).then((res) => {
      this.isLoading = false;
      this.auth.getUserApi().subscribe((user) => {
        let checkUser = user.json();
        console.log(checkUser.user.isArtist);
        if (this.loginForm.value.typeAccount === 'Ypro') {
          if (checkUser.user.isArtist === true) {
            this.router.navigate(['/dashboard']);
          } else {
            console.log('compte pro non valide');
          }
        } else {
            this.authHttp.post(this.auth.API + '/artists/request', {name: this.loginForm.value.sendName}).toPromise().then((res) => {
            this.isSend = true;
            console.log(this.loginForm.value.sendName);
            }).catch((err) => {
            this.error = 'oui';
            this.isLoading = false;
            console.log(err);
           });
        }
        });
    }).catch((err) => {
      this.error = 'oui';
      this.isLoading = false;
      console.log(err);
    });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
      typeAccount: 'Ypro',
      sendName: '',
    });
  }

}
