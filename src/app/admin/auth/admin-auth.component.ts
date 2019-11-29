import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from '../../../services/cookie.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
    selector: 'app-admin-auth',
    templateUrl: './admin-auth.component.html',
    styleUrls: [
        './admin-auth.component.scss'
    ]
})
export class AdminLoginComponent implements OnInit {
    public env: any;
    public user: any;
    public loginForm: FormGroup;
    public submitted = false;
    public wrongAuthInfo = false;
    public model: any;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private cs: CookieService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.user = {};
        if (this.cs.get('X-Token')) {
            this.getProfile();
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

    get form() {
        return this.loginForm.controls;
    }

    getProfile() {
        this.api.all('fimers').customGET('profile').subscribe(res => {
            if (res.result && res.result.isOwner) {
                this.user = res.result;
                this.router.navigate(['/admin/try']);
            } else {
                this.router.navigate(['/']);
            }
        });
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

    login(data) {
        const self = this;
        this.api.all('auth/login').customPOST(data).subscribe(res => {
            if (res.result) {
                const responseData = res.result;
                // Wrong email or password, show error
                if (responseData.error) {
                    self.wrongAuthInfo = true;
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

    storeAccessTokenIntoCookie(accessToken, expiresTime, userInfo) {
        const expiredTime = new Date();
        expiredTime.setTime(expiredTime.getTime() + (expiresTime * 1000));
        this.cs.set('X-Token', accessToken, {expires: expiredTime});
        this.cs.set('user', JSON.stringify(userInfo), {expires: expiredTime});
        this.getProfile();
    }
}
