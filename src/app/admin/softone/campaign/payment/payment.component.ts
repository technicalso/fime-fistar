import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { CommonService } from '../../service/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-campaign-payment',
    templateUrl: './payment.component.html',
    styleUrls: [
        './payment.component.scss'
    ]
})
export class AdminCampaignPaymentComponent implements OnInit {
    idCampaign: any;
    public dataCampaign:any={};
    campain = {
        cp_image: undefined,
        cp_state: 0,
        cp_name: undefined,
        category: {},
        cp_period_start: undefined,
        cp_period_end: undefined,
        cp_total_free: 0,
        cp_total_influencer: undefined,
        cp_product_price: undefined,
        cp_sale_price: undefined,
        keyword: []
    };
    data = {
        header: [
            'Deposit / withdrawal date',
            'Pay Code',
            'Type',
            'Name',
            'Deposit / withdrawal',
            'Name',
            'Deposit / withdrawal price',
            'Campaign',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: []
    };
    partner = {};
    showpopup = false;
    idPayment = 0;
    campain_payment = {
        name: '',
        brand: '',
    };
    dataInfoPayment = {};
    isShowPayment = false;
    isShowInfoBankPayment = true;
    typeShowDataPayment = 'fistar';
    idPartner = '';

    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        public commonService: CommonService,
        private toa: ToastrService,
    ) {

    }

    ngOnInit() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);
            }
        });
    }

    initData(id) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            res => {
                if (res) {
                    this.partner = res['partner'];
                    this.dataCampaign = res;
                    console.log(res,'data');
                    this.campain.cp_image = this.commonService.getImageLink(res['cp_image'], 'campaigns', 'thumbnail');
                    this.campain.cp_state = res['cp_state'];
                    this.campain.cp_name = res['cp_name'];
                    this.campain.category = res['category'];
                    this.campain.cp_period_start = res['cp_period_start'];
                    this.campain.cp_period_end = res['cp_period_end'];
                    this.campain.cp_total_free = res['cp_total_free'];
                    this.campain.cp_total_influencer = res['cp_total_influencer'];
                    this.campain.cp_product_price = res['cp_product_price'];
                    this.campain.cp_sale_price = res['cp_sale_price'];
                    this.data.list = this.convertData(res['payments'], res);
                    this.campain.keyword = res['keywords'];
                    // this.data.page = page;
                    this.data.total_page = res['payments'].length;
                    this.data.defaultList = res['payments'];

                }
                console.log('res', res);
            },
            err => {
            }
        );
    }

    convertData(data, dataAll) {
        let arr = [];
        for (let index = 0; index < data.length; index++) {
            let bankName = data[index]['type'] === 1 && data[index]['match_channel']['matching']['influencer']['bank_name'] ? data[index]['match_channel']['matching']['influencer']['bank_name'] : '';
            let bankAccountNumber = data[index]['type'] === 1 && data[index]['match_channel']['matching']['influencer']['bank_account_number'] ? data[index]['match_channel']['matching']['influencer']['bank_account_number'] : '';

            let obj = {
                id: data[index]['m_id'],
                controls: [
                    { value: 'Edit', action2: true },
                ],
                typePayment: data[index]['type'] === 0 ? 'partner' : 'fistar',
                payment: data[index],
                dataAll: dataAll,
                content: [
                    { title: data[index]['payed_date'] },
                    { title: data[index]['pay_code'] },
                    { title: data[index]['type'] === 0 ? 'Partner' : 'Fistar' },
                    { title: data[index]['type'] === 0 ? (this.partner['pm_name'] ? this.partner['pm_name'] : '') : (data[index]['match_channel']['matching']['influencer']['fullname'] ? data[index]['match_channel']['matching']['influencer']['fullname'] : '') },
                    {
                        title: data[index]['type'] === 1 ? bankName : '',
                        dateUpdate: data[index]['type'] === 1 ? bankAccountNumber : ''
                    },
                    { title: data[index]['deposit_name'] },
                    { title: data[index]['price'] },
                    { title: this.campain.cp_name },
                ]
            };
            arr.push(obj);
        }
        return arr;
    }


    navigateItem(evt) {
        console.log(evt);
        this.isShowPayment = true;
        if (evt['item']['typePayment'] == 'partner') {
            this.isShowInfoBankPayment = false;
            this.typeShowDataPayment = 'partner';
            this.dataInfoPayment = this.converDataPaymentPartner(evt['item']['payment'], evt['item']['dataAll']);
        }
        else {
            this.isShowInfoBankPayment = true;
            this.typeShowDataPayment = 'fistar';
            this.dataInfoPayment = this.converDataPaymentFistar(evt['item']['payment'], evt['item']['dataAll']);
        }
        // this.showpopup = true;
        // console.log('campain', this.campain);
        // console.log('data', this.data);
    }

    converDataPaymentPartner(dataPartner, dataAll) {
        let obj = {};
        this.idPayment = dataPartner['id'];
        obj = {
            pid: dataAll['p_id'],
            pc_name: dataAll['partner']['pc_name'],
            pm_name: dataAll['partner']['pm_name'],
            cp_name: dataAll['cp_name'],
            cp_brand: dataAll['cp_brand'],
            payment: dataPartner,
        };

        return obj;
    }

    converDataPaymentFistar(dataFistar, dataAll) {
        let obj = {};
        this.idPayment = dataFistar['id'];
        this.campain_payment = {
            name: dataAll['cp_name'],
            brand: dataAll['cp_brand'],
        };
        obj = {
            data: dataFistar['match_channel']['matching']['influencer'],
            id_ch: dataFistar['match_channel']['m_ch_id'],
            sns_id: dataFistar['match_channel']['sns_id'],
            payment: dataFistar,

        };
        return obj;
    }

    editPayment(evt) {
        let body = {};
        if (this.idPayment != 0) {
            body = {
                deposit_name: evt.deposit_name,
                pay_code: evt.pay_code,
                payed_date: evt.payed_date,
                price: evt.price,
            }
            this.campaginService.putData(`api/admin/payments/${this.idPayment}`, body).subscribe(
                res => {
                    this.successPayment();
                },
                err => {
                    this.toa.error(err.error.message);
                }
            );
        }

    }

    closePopup(evt) {
        this.showpopup = evt;
    }

    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }

    showPopupAdd() {
        this.showpopup = true;
    }

    editItem(evt) {
        if (this.idPayment != 0) {
            this.campaginService.putData(`api/admin/payments/${this.idPayment}`, evt).subscribe(
                res => {
                    this.successPayment();
                },
                err => {
                    this.toa.error(err.error.message);
                }
            );
        }
    }

    successPayment() {
        this.isShowPayment = false;
        // this.resetCountListItem();
        this.initData(this.idCampaign);
        this.toa.success('Update success');
    }

    converDataPayment(data_payment) {
        let obj = {};
        obj = {
            data: data_payment['match_channel']['matching']['influencer'],
            id_ch: data_payment['m_ch_id'],
            sns_id: data_payment['match_channel']['sns_id'],
            payment: data_payment,
        };
        return obj;
    }

    closeP(evt) {
        this.isShowPayment = evt;
        this.dataInfoPayment = {};
    }
}
