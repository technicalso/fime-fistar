import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from '../../../../services/cookie.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';

@Component({
    selector: 'app-admin-forgot',
    templateUrl: './admin-auth-forgot.component.html',
    styleUrls: [
        './admin-auth-forgot.component.scss'
    ]
})
export class AdminForgotPasswordComponent implements OnInit {
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
            email: ''
        };

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
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

    requestResetPasswordEmail(data: any) {
        const self = this;
        this.api.all('auth/forgotPassword').customPOST(data).subscribe(res => {
            if (res.result) {
                this.toast.success('Please check you inbox to reset password.!');
                this.router.navigate(['/admin/login']);
            }
        });
    }

    // Handle submit form
    onSubmit() {
        const self = this;
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        } else {
            self.requestResetPasswordEmail(self.model);
        }

    }
}
