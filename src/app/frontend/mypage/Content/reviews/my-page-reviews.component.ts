import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import * as moment from 'moment';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../../services/cookie.service';
import {UsersLikeDialogComponent} from '../../../users-like-dialog/users-like-dialog.component';
import {ShareFacebookService} from '../../../../../services/share-facebook.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
    selector: 'app-my-page-reviews',
    templateUrl: './my-page-reviews.component.html',
    styleUrls: [
        './my-page-reviews.component.scss',
    ]
})

export class MyPageReviewsComponent implements OnInit, OnChanges {
    public env: any;
    public isLoading = false;
    public page = 1;

    @Input()
    public user: any;

    @Input()
    public data: any;

    @Input()
    public filter_section: any;

    @Input()
    public filterType: any;

    @Input()
    public needUpdateContent: any;


    public myOptions: NgxMasonryOptions = {
        gutter: 50,
        horizontalOrder: true,
        transitionDuration: '0s'
    };

    public reviews = [];
    public likes = [];
    public toggleDone: Subject<any>;

    public modalRef: BsModalRef;

    constructor(private cookieService: CookieService,
                private api: Restangular,
                private router: Router,
                private shareFacebookService: ShareFacebookService,
                public modalService: BsModalService) {
        this.toggleDone = new Subject();
    }

    static formatCreatedTime(reviews) {
        for (let i = 0; i < reviews.length; i++) {
            const now = moment();
            const created_time = moment(reviews[i].updt_dt ? reviews[i].updt_dt : reviews[i].writng_dt);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                reviews[i].time = duration.years();
                reviews[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                reviews[i].time = duration.months();
                reviews[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                reviews[i].time = duration.days();
                reviews[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                reviews[i].time = duration.hours();
                reviews[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                reviews[i].time = duration.minutes();
                reviews[i].timeUnit = 'minute';
            } else {
                reviews[i].time = duration.seconds();
                reviews[i].timeUnit = 'second';
            }
        }
        return reviews;
    }

    ngOnInit(): void {
        this.env = environment;
    }

    ngOnChanges(changes: any) {
        if (typeof this.needUpdateContent && this.needUpdateContent) {
            this.page = 1;
            if (this.filterType && typeof this.filterType !== 'undefined') {
                if (this.filterType === 'reviews') {
                    this.getReviews();
                } else if (this.filterType === 'likes') {
                    this.getLikes();
                }
            }
        }
    }

    // User like
    toggleLikeReview(item) {
        let object_id = 0;
        let object_type = '';
        if (item.is_try) {
            object_id = item.cntnts_no;
            object_type = 'try';
        } else {
            object_id = item.review_no;
            object_type = 'review';
        }
        this.api.all('user-likes').customPOST({object_id: object_id, object_type: object_type}).subscribe(res => {
            if (res.result) {
                if (res.result.is_liking) {
                    item.is_liked = 1;
                } else {
                    item.is_liked = 0;
                }
                item.total_like = res.result.total;

                const crrUser = this.cookieService.get('user');
                if (crrUser && crrUser.user_no === this.user.user_no) {
                    this.toggleDone.next(false);
                }
            }
        });
    }

    getReviews() {
        if (typeof this.user !== 'undefined' && typeof this.user.user_no !== 'undefined') {
            this.isLoading = true;
            if (this.page === 1) {
                this.reviews = [];
            }
            this.api.all('usr-info/reviews').customGET('', {page: this.page, userId: this.user.user_no}).subscribe(res => {
                this.isLoading = false;
                this.page = res.result.current_page;
                const data = MyPageReviewsComponent.formatCreatedTime(res.result.data);
                if (data) {
                    for (const key in data) {
                        if (res.result.data.hasOwnProperty(key)) {
                            this.reviews.push(res.result.data[key]);
                        }
                    }
                }
            });
        }
    }

    getLikes() {
        this.isLoading = true;
        if (this.page === 1) {
            this.likes = [];
        }
        this.api.all('usr-info/likes').customGET('', {page: this.page, userId: this.user.user_no}).subscribe(res => {
            this.isLoading = false;
            this.page = res.result.current_page;
            const data = MyPageReviewsComponent.formatCreatedTime(res.result.data);
            if (data) {
                for (const key in data) {
                    if (res.result.data.hasOwnProperty(key)) {
                        this.likes.push(res.result.data[key]);
                    }
                }
            }
        });
    }

    onScroll() {
        this.page++;
        if (this.filterType === 'reviews') {
            this.getReviews();
        } else if (this.filterType === 'likes') {
            this.getLikes();
        }
    }

    usersLikeDialog(object_id, object_type) {
        this.api.all('user-likes/get-list').customGET('',
            {object_id: object_id, object_type: object_type})
            .subscribe(res => {
                if (res.result) {
                    const initialState = {
                        users: res.result.data,
                        object_id: object_id,
                        object_type: object_type,
                    };
                    this.modalRef = this.modalService.show(
                        UsersLikeDialogComponent,
                        {initialState}
                    );
                }
            });
    }

    shareLink(slug, is_try) {
        let href = '';
        if (!is_try) {
            href = this.env.url + '/reviews/detail/' + slug;
        } else {
            href = this.env.url + '/tries/' + slug;
        }
        console.log(href);
        this.shareFacebookService.share(href);
        this.shareFacebookService.response.subscribe(res => {
        });
    }
}
