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
    public pageSize: 10;
    public pageLimitOptions = [];
    public pageIndex = 1;
    public total: any;
    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public modalService: BsModalService
    ) {}

    ngOnInit() {
        this.pageSize = 10;
        this.env = environment;
        this.getCategories();
        this.pageLimitOptions = [
            {value: 5},
            {value: 10},
            {value: 20},
            {value: 25},
            {value: 50}
        ];
    }
    changePageLimit(limit: any): void {
        this.pageSize = limit;
        this.getCategories();
    }
    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getCategories();
    }

    getCategories() {
        this.api
            .all('categories')
            .customGET('',{page: this.pageIndex,pageSize: this.pageSize})
            .subscribe(res => {
                this.categories = res.result.data;
                this.total = res.result.total;
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
