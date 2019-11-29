import { Component, OnInit, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'; import { HttpClientAdminService } from '../../../../shared/service/httpclient.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-admin-campaign-payment-manager',
    templateUrl: './manager.component.html',
    styleUrls: [
        './manager.component.scss'
    ]
})
export class AdminCampaignPaymentManagerComponent implements OnInit {
    @Output() close = new EventEmitter();
    data = {
        header: [
            'User No',
            'Name',
            'Review',
            'Campain Name'
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: []
    };
    form: FormGroup;
    step = 1;
    detail;
    type_user = [
        { value: 'campaign_name', title: 'Campaign Name' },
        { value: 'company_name', title: 'Company Name' },
        { value: 'user_no', title: 'User No' },
        { value: 'manager_name', title: 'Manager Name' },
    ];
    type_fistar = [
        { value: 'fullname ', title: 'FiStar name' },
        { value: 'user_no', title: 'User no' }
    ];
    type;
    detaill;
    optionss = [];
    isShowPayment = false;
    dataInfoPayment = {};
    idPayment = 0;
    idPartner = '';
    campain_payment = {
        name: '',
        brand: '',
    };
    isShowInfoBankPayment = true;
    typeShowDataPayment = 'fistar';
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        private formbuilder: FormBuilder,
        private toa: ToastrService,
    ) {

    }

    ngOnInit() {
        // this.initData('', '', '', 1);
        this.initForm();
    }

    initForm() {
        this.form = this.formbuilder.group(
            {
                filter: [''],
                keyword: [''],
                type: ['1']
            }
        );
        this.initData(1, '', '', 1);
        this.resetDefault(1);
    }

    initData(type, filter, filter_value, page) {
        this.data.list = [];
        if (type == 1) {
            this.typeShowDataPayment = 'partner';
            this.isShowInfoBankPayment = false;
            this.campaginService.getData(`api/admin/partners/campaigns/search?filter=${filter}&filter_value=${filter_value}&page=${page}`).subscribe(
                res => {
                    this.data.list = this.convertDataPartner(res['data']);
                    this.data.total_page = res['total'];
                    this.data.page = page;
                }
            );
        }
        if (type == 2) {
            this.typeShowDataPayment = 'fistar';
            this.isShowInfoBankPayment = true;
            this.campaginService.getData(`api/admin/fistars/campaigns/search?filter=${filter}&filter_value=${filter_value}&page=${page}`).subscribe(
                res => {
                    this.data.list = this.getDataFistar(res['data']);
                    this.data.total_page = res['total'];
                    this.data.page = page;
                }
            );
        }

    }

    convertDataPartner(data) {
        let arr = [];
        _.forEach(data, (item) => {
            console.log(item, 'convertDataPartner-115')
            let obj = {
                cp_id: item['cp_id'] || '',
                type: 0,
                item: item || '',
                manage: item.partner_thanh_toan ? 'Completed': 'Manager',
                content: [
                    { title: item['partner']['pid'] },
                    { title: item['partner']['pc_name'] },
                    { title: item['partner']['pm_name'] },
                    { title: item['cp_name'] },
                ]
            };
            arr.push(obj);
        })

        return arr;
    }

    getDataFistar(data) {
        let arr = [];
        _.forEach(data, (item) => {
            console.log(item, 'convertDataPartner-137')
            let obj = {
                id: item['m_id'],
                m_ch_id: item['m_ch_id'],
                type: 1,
                item: item,
                manage: item.fistar_rut_tien ? 'Completed': 'Manager',
                content: [
                    { title: item['matching'] ? item['matching']['uid'] : '' },
                    { title: item['matching']['influencer'] ? item['matching']['influencer']['fullname'] : '' },
                    { title: item['sns'] ? item['sns']['sns_name'] : '' },
                    { title: item['matching']['campaign']['cp_name'] || '' },
                ]
            };
            arr.push(obj);
        });
        return arr;
    }

    getParams(page) {
        this.data.page = page;
        this.initData(this.form.value.type, this.form.value.filter, this.form.value.keyword, page);
    }

    getItem(item) {
        this.isShowPayment = true;
        this.dataInfoPayment = this.converDataPayment(this.typeShowDataPayment, item['item']);
    }

    converDataPayment(type, data_payment) {
        let obj = {};
        if (type == 'partner') {
            let arr = data_payment['partner_thanh_toan'] && data_payment['partner_thanh_toan'] != null ? data_payment['partner_thanh_toan'] : {};
            this.idPayment = data_payment['partner_thanh_toan'] && data_payment['partner_thanh_toan'] != null ? data_payment['partner_thanh_toan']['id'] : 0;
            this.idPartner = data_payment['cp_id'];
            obj = {
                pid: data_payment['p_id'],
                pc_name: data_payment['partner']['pc_name'],
                pm_name: data_payment['partner']['pm_name'],
                cp_name: data_payment['cp_name'],
                cp_brand: data_payment['cp_brand'],
                payment: arr,
            };
        } else {
            this.idPartner = '';
            this.campain_payment.name = data_payment['matching']['campaign']['cp_name'];
            this.campain_payment.brand = data_payment['matching']['campaign']['cp_brand'];
            let arr = data_payment['fistar_rut_tien'] && data_payment['fistar_rut_tien'] != null ? data_payment['fistar_rut_tien'] : {};
            this.idPayment = data_payment['fistar_rut_tien'] && data_payment['fistar_rut_tien'] != null ? data_payment['fistar_rut_tien']['id'] : 0;
            obj = {
                data: data_payment['matching']['influencer'],
                id_ch: data_payment['m_ch_id'],
                sns_id: data_payment['sns_id'],
                payment: arr,
            };
        }
        return obj;
    }

    search() {
        this.initData(this.form.value.type, this.form.value.filter, this.form.value.keyword, 1);
    }

    reset() {
        this.form.reset();
        this.optionss = [];
    }

    closecomponent() {
        this.close.emit(false);
    }

    getStep(evt) {
        this.step = evt;
    }

    resetDefault(value) {
        if (value == 1) {
            this.optionss = this.type_user;
        }
        else if (value == 2) {
            this.optionss = this.type_fistar;
        }
        else {
            this.optionss = [];
        }
        this.form.get('filter').setValue('');
    }
    closeP(evt) {
        this.isShowPayment = evt;
        this.dataInfoPayment = {};
    }

    editPayment(evt) {
        let body = {};
        if (this.idPayment != 0) {
            if (this.typeShowDataPayment == 'partner') {
                body = {
                    deposit_name: evt.deposit_name,
                    pay_code: evt.pay_code,
                    payed_date: evt.payed_date,
                    price: evt.price,
                    type: 0,
                    cp_id: this.idPartner
                }
            }
            else {
                body = evt;
            }
            this.campaginService.putData(`api/admin/payments/${this.idPayment}`, body).subscribe(
                res => {
                    this.successPayment();
                    this.search();
                },
                err => {
                    this.toa.error(err.error.message);
                }
            );
        }
        else {
            this.addhandleItem(evt);
        }

    }

    addhandleItem(evt) {
        let body = {};
        if (this.typeShowDataPayment == 'partner') {
            if (this.idPartner == '') {
                return this.toa.error('Errors');
            }
            body = {
                deposit_name: evt.deposit_name,
                pay_code: evt.pay_code,
                payed_date: evt.payed_date,
                price: evt.price,
                type: 0,
                cp_id: this.idPartner
            }
        }
        else {
            body = evt;
        }
        this.campaginService.postData(`api/admin/payments`, body).subscribe(
            res => {
                this.successPayment();
                this.search();
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }


    successPayment() {
        this.isShowPayment = false;
        // this.initData(this.idCampaign);
        this.toa.success('Update success');
    }
}
