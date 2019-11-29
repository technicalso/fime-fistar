import {Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {NotificationService} from '../../../services/notification.service';

@Component({
    selector: 'app-reviews',
    templateUrl: './notification.component.html',
    styleUrls: [
        './notification.component.scss',
    ]
})
export class NotificationComponent implements OnInit {
    public env;
    public notifications = [];
    private page = 0;
    public notificationNumber: any;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private toast: ToastrService,
                @Inject(PLATFORM_ID) private platformId: Object,
                @Inject(DOCUMENT) private document: any) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.getNotificationNumber();
        this.getNotifications();
    }

    markAllAsRead() {
        this.api.all('notifications/mark-all-as-seen').customPUT().subscribe(res => {
            this.notificationService.getNotificationNumber();
            for (let i = 0; i < this.notifications.length; i++) {
                this.notifications[i].is_seen = 1;
            }
        });
    }

    goToNotification(ids, url, is_seen) {
        if (!is_seen) {
            this.api.all('notifications/mark-as-seen').customPOST({ids: ids}).subscribe(res => {
                if (res.result) {
                    this.notificationService.getNotificationNumber();
                    this.document.location.href = url;
                }
            });
        } else {
            this.document.location.href = url;
        }
    }

    getNotifications() {
        this.page = this.page + 1;
        this.api.all('notifications').customGET('', {page: this.page}).subscribe(res => {
                if (res.result) {
                    const result = this.formatCreatedTime(res.result);
                    for (let i = 0; i < result.length; i++) {
                        this.notifications.push(result[i]);
                    }
                }
            });
    }

    getNotificationNumber() {
        this.notificationService.getNotificationNumber();
        this.notificationService.notificationNumber.subscribe(res => {
            this.notificationNumber = res;
        });
    }

    formatCreatedTime(notifications) {
        for (let i = 0; i < notifications.length; i++) {
            const now = moment();
            const created_time = moment(notifications[i].posted_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                notifications[i].time = duration.years();
                notifications[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                notifications[i].time = duration.months();
                notifications[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                notifications[i].time = duration.days();
                notifications[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                notifications[i].time = duration.hours();
                notifications[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                notifications[i].time = duration.minutes();
                notifications[i].timeUnit = 'minute';
            } else {
                notifications[i].time = duration.seconds();
                notifications[i].timeUnit = 'second';
            }
        }
        return notifications;
    }

    onScroll() {
        this.getNotifications();
    }
}
