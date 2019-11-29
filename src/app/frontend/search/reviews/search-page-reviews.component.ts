import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import * as moment from 'moment';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../services/cookie.service';
import {ActivatedRoute, Route} from '@angular/router';
import {ShareFacebookService} from '../../../../services/share-facebook.service';
import {UsersLikeDialogComponent} from '../../users-like-dialog/users-like-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
    selector: 'app-search-page-reviews',
    templateUrl: './search-page-reviews.component.html',
    styleUrls: [
        './search-page-reviews.component.scss',
    ]
})

export class SearchPageReviewsComponent implements OnInit, OnChanges {
    public env: any;
    public isLoading = false;
    public page = 1;
    public modalRef: BsModalRef;

    @Input()
    public searchValue: any;

    @Input()
    public searchKey: any;

    @Input()
    public needUpdateContent: any;


    public myOptions: NgxMasonryOptions = {
        fitWidth: true,
        gutter: 20,
        horizontalOrder: true,
        transitionDuration: '0s'
    };

    public reviews = [];
    public likes = [];
    public toggleDone: Subject<any>;

    constructor(private cookieService: CookieService,
                private api: Restangular,
                private router: ActivatedRoute,
                public modalService: BsModalService,
                private shareFacebookService: ShareFacebookService) {
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
        if (typeof this.needUpdateContent && this.needUpdateContent && this.searchKey === 'reviews') {
            this.page = 1;
            this.getReviews();
        }
    }

    // User like
    toggleLikeReview(review) {
        this.api.all('user-likes').customPOST({object_id: review.review_no, object_type: 'review'}).subscribe(res => {
            if (res.result) {
                if (res.result.is_liking) {
                    review.is_liked = 1;
                } else {
                    review.is_liked = 0;
                }
                review.total_like = res.result.total;
            }
        });
    }

    getReviews() {
        this.isLoading = true;

        let param = {};
        if (this.searchValue === null) {
            param = {page: this.page};
        } else {
            param = {page: this.page, searchValue: this.searchValue};
        }

        if (this.page === 1) {
            this.reviews = [];
        }

        // this.toggleDone.next(false);

        this.api.all('reviews/getNew').customGET('', param).subscribe(res => {
            this.isLoading = false;
            this.page = res.result.current_page;
            const data = SearchPageReviewsComponent.formatCreatedTime(res.result.data);
            if (data) {
                for (const key in data) {
                    if (res.result.data.hasOwnProperty(key)) {
                        this.reviews.push(res.result.data[key]);
                    }
                }
            }
        });
    }

    onScroll() {
        if (this.searchKey === 'reviews') {
            this.page++;
            this.getReviews();
        }
    }

    shareLink(slug) {
        const href = this.env.url + this.router.url + '/detail/' + slug;
        this.shareFacebookService.share(href);
        this.shareFacebookService.response.subscribe(res => {
        });
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
}
