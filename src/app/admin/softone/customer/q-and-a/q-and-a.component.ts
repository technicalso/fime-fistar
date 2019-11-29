import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { QaService } from '../../service/customer/qa.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-admin-customer-qa',
    templateUrl: './q-and-a.component.html',
    styleUrls: [
        './q-and-a.component.scss'
    ]
})
export class AdminCustomerQAComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    listDelete = [];
    newId = [];
    public formSearch: FormGroup;
    pathCurrent;

    category: any = [];
    data = {
        header: [
            'No',
            'Date',
            'Name',
            'Title',
            'Type',
            'Category',
            'State',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
    };
    isShowNumberTotalDataTable = true;
    numberSelected = 0;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private qaService: QaService,
        private formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.activeRoute.queryParams.subscribe(param => {
            if (param['page']) {
                if (this.pathCurrent) {
                    this.getData(param['page'], this.pathCurrent);
                } else {
                    this.getData(Number(param['page']));
                }
            } else {
                this.getData(1);
            }
        });
        this.formSearch = this.formBuilder.group({
            qa: [''],
            type: [''],
            cat: [''],
            status: ['']
        });
        this.getCat();
    }

    getData(param, path?) {
        this.qaService.getQA(path ? `/api/admin/qas?${path}&page=${param}` : `/api/admin/qas?page=${param}`).subscribe(res => {
            if (param) {
                this.data.page = param;
            }
            this.data.total_page = res['total'];
            this.data.list = this.convertData(res['data']);
        }, err => {
            console.log(err);
        });
    }

    search() {
        const formValue = this.formSearch.value;
        let path = `keyword=${formValue.qa == null ? '' : formValue.qa}&qa_state=${formValue.status == null ? '' : formValue.status}&qa_type=${formValue.type == null ? '' : formValue.type}&qa_category=${formValue.cat == null ? '' : formValue.cat}`;
        this.pathCurrent = path;
        this.getData(1, path);
    }

    getCat() {
        this.qaService.getCategory().subscribe(res => {
            this.category = res['data'];
        });
    }

    resetFormSearch() {
        this.formSearch.reset();
        this.formSearch.get('type').setValue('');
        this.formSearch.get('cat').setValue('');
        this.formSearch.get('status').setValue('');
        this.pathCurrent = null;
        this.getData(1);
    }

    convertData(data) {
        // tslint:disable-next-line:prefer-const
        let arr = [];
        let cat;
        for (let index = 0; index < data.length; index++) {
            if (data[index]['qa_category'] == 52) {
                cat = 'payments';
            }
            if (data[index]['qa_category'] == 51) {
                cat = 'join process';
            }
            if (data[index]['qa_category'] == 50) {
                cat = 'system';
            }
            let date = this.convertDate(data[index]['created_at']);
            let date_update = data[index]['qa_answer'] != '' && data[index]['updated_at'] ? this.convertDate(data[index]['updated_at']) : '';
            let obj = {
                controls: [
                    { value: 'Answer', link: `/admin/customer/qa/add/${data[index]['qa_id']}` },
                    { value: 'Delete', action: 'delete', id: data[index]['qa_id'] }
                ],
                content: [
                    { title: index + 1 },
                    { title: date, line: true, dateUpdate: date_update },
                    { title: data[index]['display_name'] },
                    { title: data[index]['qa_title'] },
                    { title: data[index]['qa_type'] == 1 ? 'influencer' : 'partner' },
                    { title: cat },
                    { title: data[index]['qa_state'] == 0 ? 'Waiting' : 'Complete' },
                ],
            };
            arr.push(obj);
        }
        return arr;
    }

    convertDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getParams(page) {
        this.router.navigate([`/admin/customer/qa/`], { queryParams: { page: page } });
    }

    deleteIds() {
        if (this.newId.length > 0) {
            this.delete(this.newId);
        }
    }

    delete(event) {
        const body = {
            qa_ids: Array.isArray(event) ? event : [event]
        }
        if (this.confirmDelete()) {
            this.qaService.deleteQA(body).subscribe(res => {
                if (res['success']) {
                    this.toast.success('Delete Success');
                    this.getData(1, this.pathCurrent);
                    this.numberSelected = 0;
                }
            }, err => {
                this.toast.error('Error');
            });
        }
    }

    confirmDelete() {
        let detele = confirm('Do you want to delete Q&A?');
        return detele;
    }

    getItem(event) {
        // this.listDelete = [];
        this.newId = [];
        // this.listDelete = event.value;
        _.forEach(event.value, (item) => {
            this.newId.push(item.controls[1].id);
        })

        // set number Selected datatable
        this.numberSelected = event.value.length;
    }
}
