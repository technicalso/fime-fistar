import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotifiService } from '../../service/customer/notifi.service';

@Component({
    selector: 'app-admin-customer-notification',
    templateUrl: './notification.component.html',
    styleUrls: [
        './notification.component.scss'
    ]
})
export class AdminCustomerNotificationComponent implements OnInit {
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
            'Date',
            'Writer',
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
    param_page = 1;
    isShowNumberTotalDataTable = true;
    numberSelected = 0;
    isSearch = false;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private formBuilder: FormBuilder,
        private notiService: NotifiService,
        private activeRoute: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.formSearch = this.formBuilder.group({
            title: [''],
            type: [''],
            state: ['']
        })
        this.initData();

    }

    initData() {
        this.isSearch = false;

        this.activeRoute.queryParams.subscribe(param => {
            if (param['page']) {
                this.getData(Number(param['page']));
            } else {
                this.getData();
            }
        });
    }


    search(page?) {
        this.isSearch = true;
        const formValue = this.formSearch.value;
        let param = page ? page : 1;
        this.notiService.searchNoti(formValue.title, formValue.state, formValue.type, param).subscribe(res => {
            this.data.total_page = res['total'];
            this.data.page = param ? param : 1;
            this.data.list = this.convertData(res['data']);
        }, err => {
            console.log(err);
        });
    }

    convertData(data) {
        let arr = [];
        for (let index = 0; index < data.length; index++) {
            let type;
            switch (data[index]['notice_type']) {
                case 11:
                    type = 'Influencer';
                    break;
                case 22:
                    type = 'Partner';
                    break;
                default:
                    type = 'All';
                    break;
            }
            let obj = {
                controls: [
                    { value: 'Edit', link: `/admin/customer/notification/add/${data[index]['notice_id']}` },
                    { value: (data[index]['notice_state'] == 1) ? 'Disable' : 'Enabled', action: 'disabled', id: data[index] },
                    { value: 'Delete', action: 'delete', id: data[index]['notice_id'] }
                ],
                content: [
                    { title: index + 1 },
                    { title: this.convertDate(data[index]['created_at']) },
                    { title: data[index]['notice_writer'] },
                    { title: data[index]['notice_title'] },
                    { title: type },
                    { title: data[index]['notice_state'] == 1 ? 'Enabled' : 'Disabled' },
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


    getData(param?) {

        let link = '/api/admin/notices';
        if (param) {
            link = `/api/admin/notices?page=${param}`;
        }
        this.notiService.getNoti(link).subscribe(res => {
            if (param) {
                this.data.page = param;
            }
            this.data.total_page = res['total'];
            this.data.page = param ? param : 1;
            this.data.list = this.convertData(res['data']);
        }, err => {
            console.log(err);
        });
    }

    deleteIds() {
        if (this.newId.length > 0) {
            this.delete(this.newId);
        }
    }

    delete(event) {
        const body = {
            notice_ids: Array.isArray(event) ? event : [event]
        }
        this.notiService.deleteNoti(body).subscribe(res => {
            if (res['success']) {
                this.toast.success('Delete Success');
                this.getData();
                this.numberSelected = 0;
            }
        }, err => {
            this.toast.error('Error');
        });
    }

    getItem(event) {
        this.newId = [];
        _.forEach(event.value, (item) => {
            this.newId.push(item.controls[2].id);
        })
        // set number Selected datatable
        this.numberSelected = event.value.length;
    }


    getParams(page) {
        if (this.isSearch) {
            this.search(page);
        }
        else {
            this.router.navigate([`/admin/customer/notification`], { queryParams: { page: page } });
        }
    }

    reset() {
        this.formSearch.reset();
        this.formSearch.controls.state.setValue("");
        this.formSearch.controls.title.setValue("");
        this.formSearch.controls.type.setValue("");
        this.initData();
        this.router.navigate([`/admin/customer/notification`], { queryParams: { page: 1 } });
    }

    disabled(event) {
        let state = event.notice_state == 1 ? 0 : 1;
        let item = {
            notice_title: event.notice_title,
            notice_message: event.notice_message,
            notice_writer: 'admin',
            notice_type: event.notice_type,
            notice_state: state
        }

        this.notiService.updateNoti(item, event.notice_id).subscribe(res => {
            this.getData();
        }, err => {
            console.log(err);
        });
    }
}
