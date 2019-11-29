import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FistarService } from '../../service/fistar/fistar.service';
import { ConstantPool } from '@angular/compiler';


@Component({
    selector: 'app-admin-fistar-basic',
    templateUrl: './basic.component.html',
    styleUrls: [
        './basic.component.scss'
    ]
})
export class AdminFistarBasicComponent implements OnInit {
    public env: any;
    public fistar: any = [];
    public id: string;
    public form: any;
    constructor(
        private api: Restangular,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private fistarService: FistarService,
        private toast: ToastrService) {
    }

    ngOnInit() {
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.form = new FormGroup({
            uid: new FormControl(this.fistar.uid, []),
            fullname: new FormControl(this.fistar.fullname, []),
            id: new FormControl(this.fistar.id, []),
            email: new FormControl(this.fistar.email, [Validators.email]),
            phone: new FormControl(this.fistar.phone, []),
            active: new FormControl(this.fistar.fime && this.fistar.fime.DELETE_AT === 'Y' || []),
            allow_comment: new FormControl(this.fistar.fime && this.fistar.fime.allow_comment, []),
            allow_review: new FormControl(this.fistar.fime && this.fistar.fime.allow_review, []),
            fimer: new FormControl(this.fistar.fimer, []),
            fistar: new FormControl(this.fistar.fistar, []),
            address: new FormControl(this.fistar.address, []),

        });
        this.getfistars();
    }

    getfistars() {
        this.fistarService.getFistar(this.id).subscribe((res: any) => {
            this.fistar = res;
            // this.fistar.active = (this.fistar.fime.DELETE_AT === 'Y');
            this.fistar.active = this.fistar.active;
            this.fistar.allow_comment = this.fistar.fime.allow_comment;
            this.fistar.allow_review = this.fistar.fime.allow_review;
            switch (this.fistar.fime.role_id) {
                case 1:
                    this.fistar.fimer = true;
                    this.fistar.fistar = true;
                    break;
                case 2:
                    this.fistar.fimer = true;
                    break;
                case 4:
                    this.fistar.fistar = true;
                    break;
            }
        });
    }

    updateBasicFistar() {
        console.log(this.fistar);
        let data: any = {};
        data = {
            fullname: this.fistar.fullname,
            type: 'basic_infomation',
            uid: this.fistar.uid,
            email: this.fistar.email,
            id: this.fistar.id,
            address: this.fistar.address,
            phone: this.fistar.phone,
            // delete_at: this.fistar.active ? 'Y' : 'N',
            allow_comment: this.fistar.allow_comment,
            allow_review: this.fistar.allow_review,
            active: this.fistar.active,
            fimer: this.fistar.fimer,
            fistar: this.fistar.fistar
        };
        console.log(data, 'hehehehehe dataaaa');
        this.fistarService.updateFistar(data).subscribe(res => {
            console.log(res);
            this.toast.success("Update basic information successfully");
            this.router.navigate(['/admin/fistar']);
        }, (err) => {
            var result = Object.keys(err.error.errors).map(function (key) {
                return [Number(key), err.error.errors[key]];
            });
            console.log(result);
            result.forEach(element => {
                this.toast.error(element[1]);
            });
            // err.error.errors.forEach(element => {
            //     element.bank_swift_code;
            // });
        });
    }



}
