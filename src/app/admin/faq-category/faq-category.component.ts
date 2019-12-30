import { Component, OnInit } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AdminFAQCategoryDialogComponent} from '../faq-category-dialog/faq-category-dialog.component';

@Component({
    selector: 'app-admin-faq-category',
    templateUrl: './faq-category.component.html',
    styleUrls: [
        './faq-category.component.scss'
    ]
})
export class AdminFaqCategoryComponent implements OnInit {
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
            .all('faq-categories')
            .customGET('')
            .subscribe(res => {
                this.categories = res.result;
            });
    }

    onDelete(row) {
        this.api
            .one('faq-categories', row.code)
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
            AdminFAQCategoryDialogComponent,
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
            AdminFAQCategoryDialogComponent,
            { initialState }
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getCategories();
        });
    }
}
