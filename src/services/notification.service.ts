import {Restangular} from 'ngx-restangular';
import {CookieService} from './cookie.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, observable, Observable, Subject} from 'rxjs';

@Injectable()
export class NotificationService {
    public notificationNumber = new BehaviorSubject(null);

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    getNotificationNumber() {
            this.api.all('notifications/number').customGET('').subscribe(res => {
                if (res.result > 9) {
                    this.notificationNumber.next('9+');
                } else {
                    this.notificationNumber.next(res.result);
                }
            });
    }
}


