import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as _ from 'lodash';
import {AdminBrandDialogComponent} from '../brand-dialog/brand-dialog.component';

@Component({
    selector: 'app-admin-brand',
    templateUrl: './brand.component.html',
    styleUrls: ['./brand.component.scss']
})
export class AdminBrandComponent implements OnInit {
    public message: string;
    public brands = [];
    public crrbrands = [];
    public env: any;
    public modalRef: BsModalRef;
    public offset = 0;
    public filter = {
        name: null
    };
    public pageSize = 10;
    public pageLimitOptions = [];
    public total: any;
    public pageIndex = 1;
    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public modalService: BsModalService
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.getBrands();
        this.pageSize = 10;
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
        this.getBrands();
    }
    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getBrands();
    }

    getBrands() {
        this.api
            .all('brands')
            .customGET('',{page: this.pageIndex,pageSize: this.pageSize,name: this.filter.name})
            .subscribe(res => {
                this.brands = res.result.data;
                this.crrbrands = res.result;
                this.total = res.result.total;
            });
    }

    onDelete(row) {
        this.api
            .one('brands', row.code)
            .customDELETE('')
            .subscribe(res => {
                if (res.result) {
                    this.getBrands();
                    this.toast.success('The brand has been deleted');
                }
            });
    }

    addBrand() {
        const initialState = {
            brand: {}
        };
        this.modalRef = this.modalService.show(
            AdminBrandDialogComponent,
            {initialState}
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getBrands();
        });
    }

    editBrand(brand) {
        const initialState = {
            brand: _.cloneDeep(brand)
        };
        this.modalRef = this.modalService.show(
            AdminBrandDialogComponent,
            {initialState}
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getBrands();
        });
    }

    onSearch() {
        this.pageIndex = 1;
        this.getBrands();
    }

    onReset() {
        this.filter = {
            name: null
        };
        this.pageIndex = 1;
        this.getBrands();
    }
}
