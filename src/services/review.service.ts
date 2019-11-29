import {Restangular} from 'ngx-restangular';
import {CookieService} from './cookie.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {observable, Observable, Subject} from 'rxjs';

@Injectable()
export class ReviewService {
    public reviewObser = new Observable<{review_no: number, comment_number: 0, images: [], resourceType: any}>();

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    getReviewDetail(reviewSlug) {
        this.reviewObser = new Observable((observer) => {
            this.api.all('reviews/detail').customGET(reviewSlug).subscribe(res => {
                if (res.result) {
                    observer.next(res.result);
                } else {
                    observer.next(null);
                }
            });
        });
    }
}


