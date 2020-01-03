import {Component, Inject, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-admin-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class AdminUserDetailComponent implements OnInit {
    public env: any;
    public user_no: any;
    public user: any;
    public form: any;
    public roles: any;

    constructor(
        private api: Restangular,
        public activeRoute: ActivatedRoute,
        private router: Router,
        private toast: ToastrService) {
    }

    ngOnInit() {
        this.env = environment;
        this.activeRoute.params.forEach((params: Params) => {
            this.user_no = params['id'];
        });
        this.user = {};
        this.form = new FormGroup({
            user_no: new FormControl({value: this.user.user_no, disabled: true}, [Validators.required]),
            reg_name: new FormControl(this.user.reg_name, [Validators.required]),
            email: new FormControl(this.user.email, [Validators.required]),
            id: new FormControl(this.user.id, [Validators.required]),
            slug: new FormControl(this.user.slug, [Validators.required]),
            cellphone: new FormControl(this.user.cellphone, [Validators.required]),
            home_addr1: new FormControl(this.user.home_addr1, [Validators.required]),
            active: new FormControl(this.user.active, [Validators.required]),
            allow_comment: new FormControl(this.user.allow_comment, [Validators.required]),
            allow_review: new FormControl(this.user.allow_review, [Validators.required]),
            delete: new FormControl(this.user.delete, [Validators.required]),
            userRole: new FormControl(this.user.role_id, [])
        });
        if (this.user_no) {
            this.getUser();
        }

        this.getRoles();
    }

    getUser() {
        this.api
            .one('admin/user/get', this.user_no)
            .get()
            .subscribe(res => {
                this.user = res.result;
                this.user.deleted = this.user.delete_at === 'N' ? 0 : 1;
                this.user.active = this.user.drmncy_at === 'N' ? 1 : 0;
            });
    }

    save() {
        if (this.user_no) {
            this.api.all('admin/user/' + this.user.user_no + '/update').customPOST(this.user).subscribe(res => {
                if (res.result) {
                    this.toast.success('Update user successfully');
                    // this.router.navigate(['/admin/user-management']);
                }
            });
        } else {
            this.api.all('admin/user/add').customPOST(this.user).subscribe(res => {
                if (res.result) {
                    this.toast.success('Add user successfully');
                    this.user = res.result;
                    this.user.deleted = this.user.delete_at === 'N' ? 0 : 1;
                    this.user.active = this.user.drmncy_at === 'N' ? 1 : 0;
                    this.user_no = this.user.user_no;
                }
            });
        }
    }

    getRoles() {
        this.api.all('admin/roles/get-list').customGET().subscribe(res => {
            this.roles = res.result;
        });
    }
}
