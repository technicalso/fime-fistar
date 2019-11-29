import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from '../../service/system/account.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-admin-system-account',
    templateUrl: './account.component.html',
    styleUrls: [
        './account.component.scss'
    ]
})
export class AdminSystemAccountComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    modalRef: BsModalRef;
    listRole;
    data = {
        header: [
            'No',
            'User No',
            'Name',
            'Phone',
            'Email',
            'Access',
            'Last Login',
            'Date',
            'State',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
    };

    dataAdd = {
        header: [
            'User No',
            'Name',
            'Phone',
            'Access',
        ],
        list: [],
        total_page: 0,
        page: 1,
    };
    saveUser = {};
    formSearch: FormGroup;
    isSearch = false;
    total_item = 0;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private accountService: AccountService,
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.initFormSearch();
        this.initData();
    }

    initFormSearch() {
        this.formSearch = this.formBuilder.group({
            filter: ['USER_NO'],
            keyword: ['']
        });
    }

    initData() {
        this.activeRoute.queryParams.subscribe(param => {
            if (param['page']) {
                this.getListAccount(Number(param['page']));
            } else {
                this.getListAccount();
            }
        });
    }

    convertData(data) {
        let arr = [];
        for (let index = 0; index < data.length; index++) {
            let obj = {
                controls: [
                    { value: 'Edit', link: `/admin/system/account/update/${data[index]['USER_NO']}` },
                    { value: (data[index]['DELETE_AT'] == 'N') ? 'Disable' : 'Enabled', action: 'disabled', id: data[index] },
                    { value: 'Delete', action: 'delete', id: data[index]['USER_NO'] }
                ],
                content: [
                    { title: index + 1 },
                    { title: data[index]['USER_NO'] },
                    { title: data[index]['REG_NAME'] },
                    { title: data[index]['CELLPHONE'] },
                    { title: data[index]['EMAIL'] },
                    { title: data[index]['roles'].length > 0 ? data[index]['roles'][0]['name'] : '' },
                    { title: data[index]['LAST_LOGIN_DT'] ? data[index]['LAST_LOGIN_DT'] : '' },
                    { title: data[index]['created_at'] },
                    { title: data[index]['DELETE_AT'] == 'N' ? 'Enabled' : 'Disable ' },
                    // { title: (data[index]['faq_state'] == 1) ? 'enabled' : 'disabled'},
                ],
            };
            arr.push(obj);
        }
        return arr;
    }

    getListAccount(param?) {
        let link = '/api/admin/user-admin-fime?sort=created_at&order=desc';
        if (param) {
            link = `/api/admin/user-admin-fime?sort=created_at&order=desc&page=${param}`;
        }
        this.isSearch = false;
        this.accountService.getAccount(link).subscribe(res => {
            this.data.list = this.convertData(res['data']);
            this.data.total_page = res['total'];
            this.total_item = res['total'];
            this.data.page = param ? param : 1;
        })
    }

    getParams(page) {
        if (this.isSearch) {
            this.search(page);
        }
        else {
            this.router.navigate([`/admin/system/account`], { queryParams: { page: page } });
        }
    }

    search(param?) {
        if (this.formSearch.value.keyword && this.formSearch.value.keyword != '' && this.formSearch.value.keyword != null) {
            this.isSearch = true;
            let page = param ? param : 1;
            this.accountService.searchAccount(this.formSearch.value.filter, this.formSearch.value.keyword, page).subscribe(res => {
                this.data.page = page;
                this.data.list = this.convertData(res['data']);
                this.total_item = res['total'];
                this.data.total_page = res['total'];
            });
        }
    }

    reset() {
        this.isSearch = false;
        this.formSearch.reset();
        this.formSearch.controls.filter.setValue('USER_NO');
        this.initData();
    }

    save(event) {
        this.saveUser = [];
        this.saveUser = event;
    }

    disabled(event) {
        this.accountService.updateStatus(event.USER_NO).subscribe(res => {
            this.initData();
            this.toast.success('Success');
        }, err => {
            this.toast.error(err.error.message ? err.error.message : 'Error');
        });
    }

    delete(event) {
        let r = window.confirm('Do you delete it?');
        if (r) {
            this.accountService.deleteAccount(event).subscribe(res => {
                this.initData();
                this.toast.success('Success');

            }, err => {
                console.log(err);
                this.toast.error(err.error.message);
            });
        }
    }
}
