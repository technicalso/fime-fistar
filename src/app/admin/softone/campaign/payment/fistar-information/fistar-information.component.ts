import { Component, OnInit, Inject, PLATFORM_ID, Output, EventEmitter, Input } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'; import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientAdminService } from '../../../../shared/service/httpclient.service';
import { log } from 'util';
;


@Component({
    selector: 'app-admin-campaign-payment-fistar-infor',
    templateUrl: './fistar-information.component.html',
    styleUrls: [
        './fistar-information.component.scss'
    ]
})
export class AdminCampaignPaymentFistarInformationComponent implements OnInit {

    @Output() close = new EventEmitter();
    @Input() data = {};
    @Input() type = {};
    @Input() detail = [];
    depositform: FormGroup;
    withdrawform: FormGroup;
    constructor(
        private formbuilder: FormBuilder,
        private campaignService: HttpClientAdminService,
        private toa: ToastrService
    ) {
    }
    id;
    ngOnInit() {
        this.initFormDebosit();
        this.initFormWithdraw();
    }

    back() {
        this.close.emit(1);
    }

    initFormDebosit() {
        this.depositform = this.formbuilder.group(
            {
                type: [''],
                price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
                deposit_name: ['', Validators.required],
                payed_date: ['', Validators.required],
                cp_id: [''],
                m_ch_id: [''],
                pay_code: ['', Validators.required]
            }
        );
        if (this.data && this.type == 0) {
            console.log("Debosit",this.data['campaigns'][0]['partner_thanh_toan']);
            this.id = this.data['campaigns'][0]['partner_thanh_toan']['id'];
            this.depositform.patchValue(this.data['campaigns'][0]['partner_thanh_toan']);
            this.depositform.get('type').setValue(this.type);
        }
    }

    initFormWithdraw() {
        this.withdrawform = this.formbuilder.group(
            {
                type: [''],
                price: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
                deposit_name: ['', Validators.required],
                payed_date: ['', Validators.required],
                cp_id: [''],
                m_ch_id: [''],
                pay_code: ['', Validators.required],
                bank_account_name: ['', []],
                bank_account_number: ['', [, Validators.pattern('^[0-9]*$')]],
                bank_branch: ['', []],
                bank_name: ['', []],
                bank_swift_code: ['', []],
            }
        );
        if (this.data && this.type == 1) {
            console.log('initFormWithdraw',this.data);
            this.id = this.data['fistar_rut_tien']['id']
            this.withdrawform.patchValue(this.data['fistar_rut_tien']);
            this.withdrawform.get('type').setValue(this.type);
            this.convertDataBank(this.data);

            // this.withdrawform.get('price').setValue(Math.round(this.data['price']));
        }
    }

    convertDataBank(data) {
        console.log('dataForm',data);
        
        this.withdrawform.controls['bank_account_name'].setValue(data['matching']['influencer']['bank_account_name']);
        this.withdrawform.controls['bank_account_number'].setValue(data['matching']['influencer']['bank_account_number']);
        this.withdrawform.controls['bank_branch'].setValue(data['matching']['influencer']['bank_branch']);
        this.withdrawform.controls['bank_name'].setValue(data['matching']['influencer']['bank_name']);   
    }



    deposit() {
        
        this.campaignService.putData(`api/admin/payments/${this.id}`, this.depositform.value).subscribe(
            res => {
                this.toa.success('Update success');
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }

    withdraw() {

        this.campaignService.putData(`api/admin/payments/${this.id}`, this.withdrawform.value).subscribe(
            res => {
                this.toa.success('Update success');
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }
}
