import {Component, OnInit, Inject, PLATFORM_ID, } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-system-notification',
    templateUrl: './notification.component.html',
    styleUrls: [
        './notification.component.scss',
    ]
})
export class AdminNotificationComponent implements OnInit {
    public env;
    public notifications: any;
    public unseen_count;
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                private toast: ToastrService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.unseen_count = 12;
        this.notifications = [];
        this.getSystemNotifications();
    }

    getSystemNotifications() {
        this.api.all('system-notification').customGET().subscribe(res => {
            if (res.result) {
                this.notifications = res.result;
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
                if (item.is_disabled) {
                    showDeactivate = false;
                } else {
                    showActive = false;
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

    onToggle(rows, toggle) {
        const ids = _.map(rows, 'id');

        this.api.all('system-notification').customPUT({ids: ids, toggle: toggle}, 'toggle').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.is_disabled = toggle;
                }

                if (!toggle) {
                    this.toast.success('The system notification has been enable');
                } else {
                    this.toast.success('The system notification has been disable');
                }
                this.selected = [];
            }
        });
    }

    onDelete(rows) {
        const ids = _.map(rows, 'id');

        this.api.all('system-notification').customPOST({ ids: ids }, 'delete').subscribe(res => {
            if (res.result) {
                this.getSystemNotifications();
                this.toast.success('The system notifications has been deleted');
            }
        });
    }
}
