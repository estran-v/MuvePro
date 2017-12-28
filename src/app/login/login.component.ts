import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public error: string;
  public isLoading: boolean = false;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthService) {
    this.createForm();
  }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    this.error = '';
    this.auth.login(this.loginForm.value).then((res) => {
      this.isLoading = false;
      console.log(this.auth.loggedIn());
      this.router.navigate(['/dashboard']);
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
      remember: true
    });
  }

}
