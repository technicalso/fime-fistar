import {Restangular} from 'ngx-restangular';
import {CookieService} from './cookie.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {observable, Observable, Subject} from 'rxjs';

@Injectable()
export class TryService {
    public tryObserve = new Observable<{images: [], cntnts_no: any, comments: any, resourceType: any}>();

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    getTryDetail(trySlug) {
        this.tryObserve = new Observable((observer) => {
            this.api.all('tries/slug').customGET('', { slug: trySlug }).subscribe(res => {
                if (res.result) {
                    observer.next(res.result);
                } else {
                    observer.next(null);
                }
            });
        });
    }
}


