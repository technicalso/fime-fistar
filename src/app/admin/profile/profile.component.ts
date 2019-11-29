import {Component, Inject, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CookieService} from '../../../services/cookie.service';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
    public env: any;
    public user_no: any;
    public user: any;
    public form: any;
    public roles: any;

    constructor(
        private api: Restangular,
        private cs: CookieService,
        public activeRoute: ActivatedRoute,
        private router: Router,
        private toast: ToastrService) {
    }

    ngOnInit() {
        this.env = environment;
        this.user = {};
        this.form = new FormGroup({
            user_no: new FormControl({value: this.user.user_no, disabled: true}, [Validators.required]),
            reg_name: new FormControl(this.user.reg_name, [Validators.required]),
            email: new FormControl(this.user.email, [Validators.required]),
            id: new FormControl(this.user.id, [Validators.required]),
            cellphone: new FormControl(this.user.cellphone, [Validators.required]),
            home_addr1: new FormControl(this.user.home_addr1, [Validators.required]),
            active: new FormControl(this.user.active, [Validators.required]),
            allow_comment: new FormControl(this.user.allow_comment, [Validators.required]),
            allow_review: new FormControl(this.user.allow_review, [Validators.required]),
            delete: new FormControl(this.user.delete, [Validators.required]),
            userRole: new FormControl(this.user.role_id, [])
        });

        if (this.cs.get('X-Token')) {
            this.getProfile();
        }
    }

    getProfile() {
        this.api.all('fimers').customGET('profile').subscribe(res => {
            if (res.result && res.result.isOwner) {
                this.user = res.result;
                this.user.active = 1;
            }
        });
    }

    save() {
        if (this.user.user_no) {
            this.api.all('admin/user/' + this.user.user_no + '/update').customPOST(this.user).subscribe(res => {
                if (res.result) {
                    this.toast.success('Update profile successfully');
                }
            });
        }
    }
}
