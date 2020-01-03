import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { AdminResourceComponent } from '../resource/resource.component';

@Component({
    selector: 'app-admin-brand-dialog',
    templateUrl: './brand-dialog.component.html',
    styleUrls: ['./brand-dialog.component.scss']
})
export class AdminBrandDialogComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;
    public env: any;
    public form: any;
    public brand: any;
    public onClose: Subject<boolean>;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {
        this.env = environment;
        this.onClose = new Subject();

        this.form = new FormGroup({
            name: new FormControl(this.brand.code_nm, [Validators.required])
        });
    }

    save() {
        if (!this.resource.isChanged) {
            this.onSave();
        } else {
            this.resource.onSave((response) => {
                this.brand.file = response.url + '/' + response.name;
                this.onSave();
            });
        }
    }

    onSave() {
        if (this.brand.code) {
            this.api
                .one('brands', this.brand.code)
                .customPUT(this.brand)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Brand has been updated successfully.'
                        );
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                });
        } else {
            this.api
                .all('brands')
                .post(this.brand)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Brand has been created successfully.'
                        );
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                });
        }
    }

    close() {
        this.bsModalRef.hide();
    }
}
