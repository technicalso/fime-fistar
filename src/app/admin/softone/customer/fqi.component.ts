import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'; import { FqiService } from '../service/customer/fqi.service';
import { FormGroup, FormBuilder } from '@angular/forms';
;


@Component({
    selector: 'app-admin-customer-fqi',
    templateUrl: './fqi.component.html',
    styleUrls: [
        './fqi.component.scss'
    ]
})
export class AdminCustomerFQIComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public formSearch: FormGroup;
    data = {
        header: [
            'No',
            'Title',
            'Type',
            'State',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
    };
    listDelete = [];
    newId = [];
    statusSearch;
    isShowNumberTotalDataTable = true;
    numberSelected = 0;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private fqiService: FqiService,
        private formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {
        this.env = environment;

        this.getParamPage();
        this.initForm();
    }

    getParamPage() {
        this.activeRoute.queryParams.subscribe(param => {
            if (this.statusSearch) {
                return this.search(param['page']);
            }
            if (param['page']) {
                this.getData(Number(param['page']));
            } else {
                this.getData(1);
            }
        });
    }

    initForm() {
        this.formSearch = this.formBuilder.group({
            title: [''],
            display: ['all'],
            type: ['all']
        });
    }


    convertData(data) {
        // tslint:disable-next-line:prefer-const
        let arr = [];
        for (let index = 0; index < data.length; index++) {
            let obj = {
                controls: [
                    { value: 'Edit', link: `/admin/customer/faq/add/${data[index]['faq_id']}` },
                    { value: (data[index]['faq_state'] == 1) ? 'Disable' : 'Enable', action: 'disabled', id: data[index] },
                    { value: 'Delete', action: 'delete', id: data[index]['faq_id'] }
                ],
                content: [
                    { title: index + 1 },
                    { title: data[index]['faq_title'] },
                    { title: (data[index]['faq_type'] == 1) ? 'FiStar' : 'Partner', red: 'red' },
                    { title: (data[index]['faq_state'] == 1) ? 'Enabled' : 'Disabled' },
                ],
            };
            arr.push(obj);
        }
        return arr;
    }

    search(page?) {
        if (this.formSearch.value.display === 'all' && this.formSearch.value.type === 'all' && this.formSearch.value.title === '') {
            this.statusSearch = false;
            this.getParamPage();
            this.initForm();
        } else {
            this.statusSearch = true;
            const form = this.formSearch.value;
            this.fqiService.searchFQI(form.title, form.display, form.type, page).subscribe(res => {
                this.data.total_page = res['total'];
                this.data.page = page ? page : 1;
                this.data.list = this.convertData(res['data']);
            }, err => {
                console.log(err);
            });
        }

    }

    getData(param?) {
        let link = '/api/admin/faqs';
        if (param) {
            link = `/api/admin/faqs?page=${param}`;
        }
        this.statusSearch = false;
        this.fqiService.getFQI(link).subscribe(res => {
            if (param) {
                this.data.page = param;
            }
            this.data.total_page = res['total'];
            this.data.list = this.convertData(res['data']);
        }, err => {
            console.log(err);
        });
    }


    resetFormSearch() {
        this.formSearch.controls.title.setValue('');
        this.formSearch.controls.display.setValue('all');
        this.formSearch.controls.type.setValue('all');
    }

    deleteIds() {
        if (this.newId.length > 0) {
            this.delete(this.newId);
        }
    }

    delete(event) {
        const body = {
            faq_ids: Array.isArray(event) ? event : [event]
        }
        this.fqiService.deleteFQI(body).subscribe(res => {
            if (res['success']) {
                this.toast.success('Delete success');
                this.numberSelected = 0;
                this.getData();
            }
        }, err => {
            console.log(err);
        });
    }

    getParams(page) {
        if (this.statusSearch) {
            return this.search(page);
        }
        this.router.navigate([`/admin/customer/faq`], { queryParams: { page: page } });
    }

    getItem(event) {
        // this.listDelete = [];
        this.newId = [];
        // this.listDelete = event.value;
        _.forEach(event.value, (item) => {
            this.newId.push(item.controls[2].id);
        })

        // set number Selected datatable
        this.numberSelected = event.value.length;
    }

    disabled(event) {
        let state = event.faq_state == 1 ? 0 : 1;
        let item = {
            faq_state: state,
            faq_content: event.faq_content,
            faq_title: event.faq_title,
            faq_type: event.faq_type,
        }
        this.fqiService.updateFQI(item, event.faq_id).subscribe(res => {
            this.getData();
        }, err => {
            console.log(err);
        });
    }
}



