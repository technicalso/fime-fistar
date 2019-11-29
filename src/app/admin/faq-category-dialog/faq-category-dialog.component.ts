import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-admin-faq-category-dialog',
    templateUrl: './faq-category-dialog.component.html',
    styleUrls: ['./faq-category-dialog.component.scss']
})
export class AdminFAQCategoryDialogComponent implements OnInit {
    public env: any;
    public form: any;
    public category: any;
    public onClose: Subject<boolean>;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {
        this.onClose = new Subject();

        this.env = environment;

        this.form = new FormGroup({
            name: new FormControl(this.category.name, [Validators.required])
        });
    }

    onSave() {
        if (this.category.code) {
            this.api
                .one('faq-categories', this.category.code)
                .customPUT(this.category)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Category has been updated successfully.'
                        );
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                });
        } else {
            this.api
                .all('faq-categories')
                .post(this.category)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Category has been created successfully.'
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
