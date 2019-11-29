import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CookieService} from '../../../../services/cookie.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    public business: any;
    public businessId: any;

    public resetPasswordForm: FormGroup;
    public submitted = false;
    public model: any;
    public notSame = false;
    public isSuccess = false;
    public isError = false;

    constructor(private api: Restangular,
                private route: ActivatedRoute,
                private router: Router,
                private toast: ToastrService,
                private activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.model = {
            password: '',
            rePassword: '',
            token: ''
        };

        this.resetPasswordForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            rePassword: ['', Validators.required],
        });
    }

    // Convenience getter for easy access to form fields
    get form() {
        return this.resetPasswordForm.controls;
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

    resetPassword(data: any) {
        const self = this;
        this.api.all('/auth/resetPassword').customPOST(data).subscribe(res => {
           if (res.result) {
               const result = res.result;
               if (result.done) {
                   self.isSuccess = true;
                   this.toast.success('Đặt lại mật khẩu thành công');
                   this.router.navigate(['/login']);
               } else if (result.error) {
                   self.isError = true;
               }
           } else {
           }
        });
    }

    onSubmit() {
        this.submitted = true;

        this.checkPasswords(this.resetPasswordForm);
        // Stop here if form is invalid
        if (this.resetPasswordForm.invalid || this.notSame) {
            return;
        } else {
            // Get token
            const token = this.route.snapshot.paramMap.get('token');
            this.model.token = token;
            this.resetPassword(this.model);
        }

    }
}
