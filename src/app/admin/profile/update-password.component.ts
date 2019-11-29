import {Component, Inject, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './update-password.component.html',
    styleUrls: ['./profile.component.scss']
})
export class AdminUpdatePasswordComponent implements OnInit {
    public env: any;
    public user_no: any;
    public user: any;
    public form: any;
    public submitted = false;
    public error_message = null;

    constructor(
        private api: Restangular,
        public activeRoute: ActivatedRoute,
        private router: Router,
        private toast: ToastrService) {
    }

    ngOnInit() {
        this.env = environment;
        this.user = {};
        this.form = new FormGroup({
            old_password: new FormControl(this.user.old_password, [Validators.required, Validators.minLength(6)]),
            new_password: new FormControl(this.user.new_password, [Validators.required, Validators.minLength(6)]),
            confirm_password: new FormControl(this.user.confirm_password, [Validators.required]),
        });
    }

    save() {
        this.submitted = true;
        if (this.user.new_password !== this.user.confirm_password) {
            return;
        }
        this.api.all('admin/user/change-password').customPOST(this.user).subscribe(res => {
            if (res.result) {
                if (res.result.error) {
                    this.error_message = res.result.message;
                } else {
                    this.toast.success('Change password successfully');
                    this.router.navigate(['/admin/profile']);
                }
            }
        });
    }
}
