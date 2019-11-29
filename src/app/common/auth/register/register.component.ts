import {Component, NgZone, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CookieService} from '../../../../services/cookie.service';
import {AuthService} from '../../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';

declare var window: any;
declare var FB: any;

@Component({
    selector: 'app-auth-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public business: any;
    public businessId: any;

    public registerForm: FormGroup;
    public submitted = false;
    public notSame = false;
    public agreeTerm = false;
    public model: any;
    public isEmailExisted = false;
    public isDisplayNameExisted = false;
    public isInvalidUserName = false;
    public isVerifyAccount = false;
    private identity_id: any;
    public user: any;
    public isSaving = false;
    public inActiveAccount = false;
    public wrongAuthInfo = false;

    constructor(private api: Restangular,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private cookieService: CookieService,
                private authService: AuthService,
                private toastService: ToastrService,
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
        const isAuthenticated = this.authService.checkAuthentication();
        if (isAuthenticated) {
            this.router.navigate(['/']);
        }
        this.identity_id = this.activatedRoute.snapshot.params.identity_id;
        this.model = {
            user_no: '',
            name: '',
            email: '',
            password: '',
            rePassword: '',
            displayName: ''
        };
        if (this.identity_id !== undefined) {
            this.isVerifyAccount = true;
            this.getUserByUserNo();
        }

        this.registerForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            displayName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rePassword: ['', Validators.required],
            agreeTerm: [false, [Validators.required]]
        });
    }

    // Convenience getter for easy access to form fields
    get form() {
        return this.registerForm.controls;
    }

    checkPasswords(group: FormGroup) {
        const password = group.controls.password.value;
        const confirmPass = group.controls.rePassword.value;

        if (password !== confirmPass) {
            this.notSame = true;
        } else {
            this.notSame = false;
        }
        return null;
    }

    register(data) {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        this.isDisplayNameExisted = false;
        this.isEmailExisted = false;
        this.wrongAuthInfo = false;
        this.inActiveAccount = false;
        const self = this;
        self.api.all('/auth/register').customPOST(data).subscribe(res => {
            this.isSaving = false;
            if (res.result) {
                const responseData = res.result;
                // Wrong email or password, show error
                if (responseData.error) {
                    if (responseData.error === 1) {
                        self.isEmailExisted = true;
                    }
                    if (responseData.error === 2) {
                        self.isDisplayNameExisted = true;
                    }
                    return;
                } else {
                    // Register successfully
                    // Save access_token and user data into cookie with expired time is 60 minutes
                    // Redirect to homepage

                    // If verify account for FB
                    if (self.isVerifyAccount) {
                        data = {
                            identity_id: self.identity_id,
                            user_id: responseData.user.user_no
                        };
                        // self.updateUserID(data, responseData);
                    }

                    self.storeAccessTokenIntoCookie(responseData.access_token, responseData.expires_in, responseData.user);
                }
            }
        });
    }

    updateUserID(data: any, responseData) {
        const self = this;
        this.api.all('/social-user/update').customPOST(data).subscribe(res => {
            const result = res.result;
            if (result.error) {
                self.toastService.error('This account id is not valid');
            } else {
                self.storeAccessTokenIntoCookie(responseData.access_token, responseData.expires_in, res.user);
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
                const accessToken = response.authResponse.accessToken;
                const expriesIn = response.authResponse.expiresIn;
                const userID = response.authResponse.userID;
                const user = self.getUserInfo(response.authResponse.userID, accessToken);
            }
        });
    }

    getUserInfo(userID: string, access_token: string) {
        const self = this;
        FB.api('/' + userID + '/', function (response) {
            if (response && !response.error) {
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
                if (result.identity_id) {
                    self.ngZone.run(() => self.router.navigate(['/register', result.identity_id.user_no])).then();
                }
                if (result.access_token) {
                    self.storeAccessTokenIntoCookie(result.access_token, result.expires_in, result.user);
                }
            });
    }

    storeAccessTokenIntoCookie(accessToken, expiresTime, userInfo) {
        const expiredTime = new Date();
        expiredTime.setTime(expiredTime.getTime() + (expiresTime * 1000));
        this.cookieService.set('X-Token', accessToken, {expires: expiredTime});
        this.cookieService.set('user', JSON.stringify(userInfo), {expires: expiredTime});
        this.router.navigate(['/']);
    }

    checkUserName() {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (!regex.test(this.model.displayName)) {
            this.isInvalidUserName = true;
        } else {
            this.isInvalidUserName = false;
        }
    }

    onSubmit() {
        const self = this;
        this.submitted = true;
        this.checkPasswords(this.registerForm);
        this.checkUserName();
        if (!this.agreeTerm) {
            return;
        }
        // Stop here if form is invalid
        if (this.registerForm.invalid || this.notSame || this.isInvalidUserName) {
            return;
        } else {
            // Register new account
            self.register(self.model);
        }

    }

    getUserByUserNo() {
        this.api.all('usr/get/' + this.identity_id).customGET().subscribe(res => {
            if (res.result) {
                this.model.name = res.result.reg_name;
                this.model.user_no = res.result.user_no;
                this.model.email = res.result.email !== null ? res.result.email : '';
            }
        });
    }
}
