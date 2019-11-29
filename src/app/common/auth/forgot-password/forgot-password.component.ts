import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    public loginForm: FormGroup;
    public submitted = false;
    public model: any;
    public isSent = false;

    constructor(private api: Restangular,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authService: AuthService) {
    }

    ngOnInit() {
        const isAuthenticated = this.authService.checkAuthentication();
        if (isAuthenticated) {
            this.router.navigate(['/']);
        }
        this.model = {
            email: '',
        };

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    // Convenience getter for easy access to form fields
    get form() {
        return this.loginForm.controls;
    }

    requestResetPasswordEmail(data: any) {
        const self = this;
        this.api.all('auth/forgotPassword').customPOST(data).subscribe(res => {
            if (res.result) {
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
            this.isSent = true;
            // Request reset email
            self.requestResetPasswordEmail(self.model);
        }

    }
}
