import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {ToastrService} from 'ngx-toastr';

declare var window: any;
declare var FB: any;

@Injectable()
export class ShareFacebookService {
    public response = new Observable<any>();

    constructor(private toast: ToastrService,
                @Inject(PLATFORM_ID) private platformId: Object) {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = () => {
            FB.init({
                appId: environment.facebook_app_id,
                xfbml: true,
                version: environment.facebook_app_version
            });
        };
    }

    share(href: string) {
        const self = this;
        this.response = new Observable((observer) => {
            FB.ui({
                method: 'share',
                href: href,
            }, function (response) {
                if (response) {
                    if (!response.error_code) {
                        self.toast.success('Chia sẻ thành công');
                        observer.next(response);
                    }
                }
            });
        });
    }

    loginWithFacebook() {
        const self = this;
        return new Observable((observer) => {
            FB.login(function (response) {
                if (response) {
                    if (response.status === 'connected') {
                        const accessToken = response.authResponse.accessToken;
                        const expriesIn = response.authResponse.expiresIn;
                        const userID = response.authResponse.userID;
                        observer.next(userID);
                    }
                }
                observer.next(null);
            });
        });

    }
}


