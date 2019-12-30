import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AdminCategoryDialogComponent } from '../category-dialog/category-dialog.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
    public message: string;
    public categories = [];
    public mappingCategories: any;
    public env: any;
    public modalRef: BsModalRef;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public modalService: BsModalService
    ) {}

    ngOnInit() {
        this.env = environment;
        this.getCategories();
    }

    getCategories() {
        this.api
            .all('categories')
            .customGET('')
            .subscribe(res => {
                this.categories = res.result;
            });
    }

    onDelete(row) {
        this.api
            .one('categories', row.code)
            .customDELETE('')
            .subscribe(res => {
                if (res.result) {
                    this.getCategories();
                    this.toast.success('The category has been deleted');
                }
            });
    }

    addCategory() {
        const initialState = {
            category: {}
        };
        this.modalRef = this.modalService.show(
            AdminCategoryDialogComponent,
            { initialState }
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getCategories();
        });
    }

    editCategory(category) {
        const initialState = {
            category: _.cloneDeep(category)
        };
        this.modalRef = this.modalService.show(
            AdminCategoryDialogComponent,
            { initialState }
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getCategories();
        });
    }
}
