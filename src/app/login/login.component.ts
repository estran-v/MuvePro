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
  public errorPro: string;
  public isLoading: boolean = false;
  public isSend: boolean = false;
  public faq = [
    {
      q: 'Je débute dans la musique, je n’ai donc quasiment pas de public encore, puis-je prétendre à obtenir un compte Pro sur Muve ?',
      a: 'Bien sûr ! Le but de Muve étant de promouvoir la musique d’un artiste (ou sa propre musique), nous ne nous limitons pas à la taille de l’audience d’un artiste !',
    }, {
      q: 'Je suis un artiste, et j’aimerais utiliser votre application pro, comment faire ?',
      a: 'Rendez-vous sur le site notre application pro (pro.muve-app.com) et effectuez une demande de création de compte. Une fois votre identité prouvée, vous pourrez accéder à votre compte.',
    }, {
      q: 'J’ai fais ma demande de création de compte il y a une heure, et je n’ai toujours pas reçu de mail de confirmation, suis-je inéligible ?',
      a: 'Il se peut que le temps de la vérification d’identitée varie selon le nombre de requête que nous recevons, mais la durée moyenne d’une vérification va de 12 à 24h',
    }, {
      q: 'Ai-je droit à autant de Muve sponsorisés que je le désire ?',
      a: 'Non, le nombre de Muves sponsorisés que vous pouvez poster est limité.',
    }, {
      q: 'Je prépare bientôt un concert à Paris, puis-je utiliser votre application pour le faire savoir à mes utilisateurs ?',
      a: 'Oui, vous pouvez créer un salon de discussion avec vos followers afin de les tenir au courant de l’évènement.',
    }, {
      q: 'Puis-je savoir si mes musiques sont écoutées dans le monde entier, ou seulement en France ?',
      a: 'Vous aurez accès aux statistiques de vos Muves dans le monde entier.',
    }, {
      q: 'Je suis un petit artiste local, vais-je devoir payer autant que les artistes internationaux ?',
      a: 'Non, rassurez-vous, les coûts d’utilisation s’adapteront à vos besoins.',
    }, {
      q: 'Mon Muve sponsorisé n’est pas visible, que dois-je faire ?',
      a: 'Envoyez directement un mail au support, nous réglerons votre problème au plus vite.',
    }, {
      q: 'Je me suis trompé de musique en créant mon Muve, puis-je la changer ?',
      a: 'Non, mais rien ne vous empêche de supprimer le Muve en question et d’en recréer un nouveau.',
    }, {
      q: 'J’aimerais augmenter la durée de mes Muves sponsorisés, est-ce possible ?',
      a: 'Oui c’est possible.',
    }, {
      q: 'Je suis nouveau sur l’application, comment m’en servir?',
      a: 'Pas de panique, une page d’aide est présente sur l’application afin de vous guider.',
    },
  ];

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
    this.errorPro = '';
    this.auth.login(this.loginForm.value).then((res) => {
      this.isLoading = false;
      this.auth.getUserApi().subscribe((user) => {
        let checkUser = user.json();
        console.log(checkUser.user);
        if (this.loginForm.value.typeAccount === 'Ypro') {
          if (checkUser.user.isArtist === true) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorPro = 'oui';
            this.isLoading = false;
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
