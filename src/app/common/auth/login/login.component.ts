import {Component, NgZone, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {CookieService} from '../../../../services/cookie.service';
import {environment} from '../../../../environments/environment';

declare var window: any;
declare var FB: any;

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public business: any;
    public businessId: any;

    public loginForm: FormGroup;
    public submitted = false;
    public wrongAuthInfo = false;
    public inActiveAccount = false;
    public model: any;
    private lastPath: any;
    private redirectUrl = '/';
    public isSaving = false;
    public isProcessing = false;

    constructor(private api: Restangular,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private cookie: CookieService,
                private authService: AuthService,
                private cookieService: CookieService,
                private ngZone: NgZone) {
        // This function initializes the FB variable
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

    ngOnInit() {
        this.lastPath = [];
        this.activatedRoute
            .queryParams
            .subscribe((params) => {
               this.redirectUrl = params['redirectUrl'];
            });
        const isAuthenticated = this.authService.checkAuthentication();
        this.lastPath  = this.router.url.split('/');
        if (isAuthenticated) {
            if (this.lastPath.length > 2) {
                this.router.navigate(['/admin']);
            }
            this.router.navigate(['/']);
        }
        this.model = {
            email: '',
            password: '',
        };

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            saveLogin: ['']
        });
    }

    // Convenience getter for easy access to form fields
    get form() {
        return this.loginForm.controls;
    }

    login(data) {
        const self = this;
        this.api.all('auth/login').customPOST(data).subscribe(res => {
            if (res.result) {
                const responseData = res.result;
                // Wrong email or password, show error
                if (responseData.error) {
                    self.wrongAuthInfo = false;
                    self.inActiveAccount = false;
                    if (responseData.errorCode === 1) {
                        self.wrongAuthInfo = true;
                    } else if (responseData.errorCode === 2 ) {
                        self.inActiveAccount = true;
                    }
                    return;
                } else {
                    // Login successfully
                    // Save access_token and user data into cookie with expired time is 60 minutes
                    self.storeAccessTokenIntoCookie(responseData.access_token, responseData.expires_in, responseData.user);
                }
            } else {
                self.wrongAuthInfo = true;
            }
        });
    }

    loginWithFacebook(): void {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        const self = this;
        FB.login(function (response) {
            if (response) {
                if (response.status === 'connected') {
                    const accessToken = response.authResponse.accessToken;
                    const expriesIn = response.authResponse.expiresIn;
                    const userID = response.authResponse.userID;
                    self.getUserInfo(response.authResponse.userID, accessToken);
                }
            }
        });
    }

    getUserInfo(userID: string, access_token: string) {
        const self = this;
        FB.api('/' + userID + '/', function (response) {
            if (response && !response.error) {
                if (self.isProcessing) {
                    return;
                }
                self.isProcessing = true;
                /* handle the result */
                self.sendFBDataToAPI(access_token, userID, response);
            }
        });
    }

    sendFBDataToAPI(accessToken: string, userID: string, responseData: any) {
        const self = this;
        self.api.all('/auth/loginByFacebook')
            .customPOST({'accessToken': accessToken, 'userID': userID, 'data': JSON.stringify(responseData)})
            .subscribe((res: any) => {
                self.isSaving = false;
                const result = res.result;
                if (result.error) {
                    self.wrongAuthInfo = false;
                    self.inActiveAccount = false;
                    if (result.errorCode === 1) {
                        self.wrongAuthInfo = true;
                    } else if (result.errorCode === 2 ) {
                        self.inActiveAccount = true;
                    }
                    return;
                }
                if (result.access_token) {
                    self.storeAccessTokenIntoCookie(result.access_token, result.expires_in, result.user);
                } else if (result.user && result.user.user_no) {
                    self.ngZone.run(() => self.router.navigate(['/register', result.user.user_no])).then();
                }
                if (result.identity_id) {
                    self.ngZone.run(() => self.router.navigate(['/register', result.identity_id.user_no])).then();
                }

            });
    }

    storeAccessTokenIntoCookie(accessToken, expiresTime, userInfo) {
        const expiredTime = new Date();
        expiredTime.setTime(expiredTime.getTime() + (expiresTime * 1000));
        this.cookieService.set('X-Token', accessToken, {expires: expiredTime});
        this.cookieService.set('user', JSON.stringify(userInfo), {expires: expiredTime});
        if (this.lastPath.length > 2) {
            this.router.navigate(['/admin']);
        } else {
            if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
            } else {
                this.router.navigate(['/']);
            }
        }
    }

    // Handle submit form
    onSubmit() {
        const self = this;
        this.submitted = true;
        // Stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        } else {
            // Login account
            self.login(self.model);
        }

    }
}
