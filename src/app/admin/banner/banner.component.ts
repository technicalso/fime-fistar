import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './banner.component.html',
    styleUrls: [
        './banner.component.scss'
    ]
})
export class AdminBannerComponent implements OnInit {
    public message: string;
    public banners = [];
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
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.env = environment;
        this.getBanners();
    }

    getBanners() {
        this.selected = [];

        this.api.all('banners/all').customGET('').subscribe(res => {
            this.banners = res.result;
            for (let i = 0; i < this.banners.length; i++) {
                this.banners[i].period_from = moment.utc(this.banners[i].period_from).toDate();
                this.banners[i].period_to = moment.utc(this.banners[i].period_to).toDate();
            }
        });
    }

    onToggle(rows, togggle) {
        const ids = _.map(rows, 'id');

        this.api.all('banners').customPUT({ ids: ids, toggle: togggle }, 'toggle').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.is_disabled = togggle;
                }

                if (togggle) {
                    this.toast.success('The banner has been disabled');
                } else {
                    this.toast.success('The banner has been enabled');
                }
                this.selected = [];
            }
        });
    }

    onDelete(rows) {
        const ids = _.map(rows, 'id');

        this.api.all('banners').customPOST({ ids: ids }, 'deleteMulti').subscribe(res => {
            if (res.result) {
                this.getBanners();
                this.toast.success('The banner has been deleted');
            }
        });
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        if (this.selected.length > 0) {
            this.showDelete = true;

            let showDeactivate = true;
            let showActive = true;
            for (const item of this.selected) {
                if (!item.is_disabled) {
                    showActive = false;
                } else {
                    showDeactivate = false;
                }
            }

            this.showDeactivate = showDeactivate;
            this.showActive = showActive;
        } else {
            this.showDeactivate = false;
            this.showActive = false;
            this.showDelete = false;
        }
    }

    onToggleMulti(toggle) {
        if (this.selected.length > 0) {
            this.onToggle(this.selected, toggle);
        }
    }

    onDeleteMulti() {
        if (this.selected.length > 0) {
            this.onDelete(this.selected);
        }
    }
}
