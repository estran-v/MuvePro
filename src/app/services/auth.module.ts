import {NgModule} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'accessToken',
    tokenGetter: (() => localStorage.getItem('accessToken')),
    globalHeaders: [{'Content-Type': 'application/json'}],
    noJwtError: true
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {
}
