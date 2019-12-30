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

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public modalService: BsModalService
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.getBrands();
    }

    getBrands() {
        this.api
            .all('brands')
            .customGET('')
            .subscribe(res => {
                this.brands = res.result;
                this.crrbrands = res.result;
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
        if (this.filter.name !== null && this.filter.name !== '') {
            const val = this.filter.name;
            // filter our data
            this.brands = this.crrbrands.filter(function (d) {
                return d.code_nm.toLowerCase().indexOf(val) !== -1 || !val;
            });

            this.offset = 0;
        } else {
            this.brands = this.crrbrands;
            this.offset = 0;
        }
    }

    onReset() {
        this.filter = {
            name: null
        };
        this.brands = this.crrbrands;
        this.offset = 0;
    }
}
