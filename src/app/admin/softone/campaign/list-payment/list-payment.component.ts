import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TabsModule } from 'ngx-bootstrap/tabs';


@Component({
    selector: 'app-admin-campaign-list-payment',
    templateUrl: './list-payment.component.html',
    styleUrls: [
        './list-payment.component.scss'
    ]
})
export class AdminCampaignListPaymentComponent implements OnInit {
    public fistars:any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
    ) { 

    }

    ngOnInit() {
        this.env = environment;
        this.getFistars();
    }

    getFistars(){
        this.fistars = [
            {   
                id: 1,
                name: "banner1", 
                withdrawal_date: '2019/05/26 21:00',
                Pay_Code: 'Pay100',
                type: 'Partner', 
                withdrawal_account: "Vin Bank 1254565822", 
                Campaign: "Son kem lì BBIA LAST VELVET LIP TINT" ,
                withdrawal_price: "+ 500,000 VND",
            },
            
            {   
                id: 1,
                name: "banner1", 
                withdrawal_date: '2019/05/26 21:00',
                Pay_Code: 'Pay100',
                type: 'Partner', 
                withdrawal_account: "Vin Bank 1254565822", 
                Campaign: "Son kem lì BBIA LAST VELVET LIP TINT" ,
                withdrawal_price: "+ 500,000 VND",
            },
            {   
                id: 1,
                name: "banner1", 
                withdrawal_date: '2019/05/26 21:00',
                Pay_Code: 'Pay100',
                type: 'Partner', 
                withdrawal_account: "Vin Bank 1254565822", 
                Campaign: "Son kem lì BBIA LAST VELVET LIP TINT" ,
                withdrawal_price: "+ 500,000 VND",
            },
            {   
                id: 1,
                name: "banner1", 
                withdrawal_date: '2019/05/26 21:00',
                Pay_Code: 'Pay100',
                type: 'Partner', 
                withdrawal_account: "Vin Bank 1254565822", 
                Campaign: "Son kem lì BBIA LAST VELVET LIP TINT" ,
                withdrawal_price: "+ 500,000 VND",
            },

           
          
        ];
        
    }
    
}
