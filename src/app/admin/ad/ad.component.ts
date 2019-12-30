import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-ads',
    templateUrl: './ad.component.html',
    styleUrls: [
        './ad.component.scss'
    ]
})
export class AdminAdsComponent implements OnInit {
    public message: string;
    public ads = [];
    public env: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.env = environment;
        this.getAds();
    }

    getAds() {
        this.api.all('ads').customGET('').subscribe(res => {
            this.ads = res.result;
        });
    }

    onToggle(row) {
        this.api.one('ads', row.id).customPUT({}, 'toggle').subscribe(res => {
            if (res.result) {
                row.is_disabled = res.result.is_disabled;
                if (row.is_disabled) {
                    this.toast.success('The ad has been disabled');
                } else {
                    this.toast.success('The ad has been enabled');
                }
            }
        });
    }

    onDelete(row) {
        this.api.one('ads', row.id).customDELETE('').subscribe(res => {
            if (res.result) {
                this.getAds();
                this.toast.success('The ad has been deleted');
            }
        });
    }
}
