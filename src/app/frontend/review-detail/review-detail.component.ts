import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnChanges,
    OnInit,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReviewService} from '../../../services/review.service';
import {environment} from '../../../environments/environment';
import {ShareFacebookService} from '../../../services/share-facebook.service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import * as moment from 'moment';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: [
        './review-detail.component.scss',
    ]
})

export class ReviewDetailComponent implements OnInit, AfterViewChecked {
    public images = [];
    public user;
    public review;
    public reviewSlug;
    public isLoading;
    public env;
    public modalRef: BsModalRef;
    @ViewChild('comment') comment: ElementRef;
    private page = 1;
    public canLoadMore = false;
    public isEmpty = false;
    public reviews: any;

    public myOptions: NgxMasonryOptions = {
        horizontalOrder: true,
        gutter: 0,
        transitionDuration: '0s'
    };

    @ViewChild('mymasonry') private masonry: NgxMasonryComponent;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private reviewService: ReviewService,
                private shareFacebookService: ShareFacebookService,
                private router: Router,
                private route: ActivatedRoute,
                private toast: ToastrService,
                public modalService: BsModalService,
                @Inject(PLATFORM_ID) private platformId: Object,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.review = {};
        this.reviews = [];
        this.user = this.cookieService.get('user') || {};
        // this.reviewSlug = this.route.snapshot.paramMap.get('slug');
        this.route.params.subscribe(params => {
            if (params.slug !== null && params.slug  !== '') {
                this.reviewSlug = params.slug;
                this.isLoading = true;
                this.page = 1;
                this.reviews = [];
                this.reviewService.getReviewDetail(this.reviewSlug);
                this.reviewService.reviewObser.subscribe(data => {
                    this.isLoading = false;
                    if (data) {
                        this.review = data;
                        this.styleImageDescription();
                        this.getReviews();
                    } else {
                        this.router.navigate(['/']);
                    }
                });
            }
        });
    }

    scrollToElement($element): void {
        $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }

    updateCommentCount(count) {
        this.review.comment_number = count;
    }

    shareLink() {
        const href = this.env.url + this.router.url;
        this.shareFacebookService.share(href);
        this.shareFacebookService.response.subscribe(res => {
            return;
        });
    }

    toggleLikeReview() {
        this.api.all('user-likes').customPOST({
            object_id: this.review.review_no,
            object_type: 'review',
        })
            .subscribe(res => {
                if (res.result) {
                    if (res.result.is_liking) {
                        this.review.is_liked = 1;
                    } else {
                        this.review.is_liked = 0;
                    }

                    this.review.like_number = res.result.total;
                    this.review.users_liked = res.result.users;
                }
            });
    }

    deleteReview() {
        this.api.all('reviews/delete').customPOST({ids: [this.review.review_no]}).subscribe(res => {
            if (res.result) {
                this.toast.success('Xóa review thành công');
                this.router.navigate(['/reviews']);
            } else {
                this.toast.error('Bạn không có quyền xóa bài viết này');

            }
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

    // Bottom list reviews
    getReviews() {
        return this.api.all('reviews/getNewAfter').customGET('', {
            page: this.page,
            review_id: this.review.review_no
        }).subscribe(res => {
            this.styleImageDescription();
            if (res.result) {
                if (window.innerWidth < 1024) {
                    this.canLoadMore = true;
                }
                if (res.result.current_page >= res.result.last_page) {
                    this.canLoadMore = false;
                }
                this.isLoading = false;
                this.reviews = [];
                this.reviews = this.formatCreatedTime(res.result.data);
                if (this.reviews.length === 0) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                }
                for (let i = 0; i < this.reviews.length; i++) {
                    this.reviews[i].images = null;
                    if (this.reviews[i].files.length > 0) {
                        this.reviews[i].images = this.reviews[i].files[0].file_cours + '/' + this.reviews[i].files[0].stre_file_nm;
                    }
                }
            }
        });
    }
    formatCreatedTime(reviews) {
        for (let i = 0; i < reviews.length; i++) {
            const now = moment();
            const created_time = moment.utc(reviews[i].writng_dt);
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
                reviews[i].timeUnit = duration.seconds();
            } else {
                reviews[i].time = duration.seconds();
                reviews[i].timeUnit = 'second';
            }
        }
        return reviews;
    }

    onScroll() {
        this.page++;
        this.api.all('reviews/getNewAfter').customGET('', {
            page: this.page,
            review_id: this.review.review_no
        }).subscribe(res => {
            if (res.result) {
                const tempReviews = [];
                res.result.data = this.formatCreatedTime(res.result.data);
                for (let i = 0; i < res.result.data.length; i++) {
                    res.result.data[i].images = null;
                    if (res.result.data[i].files.length > 0) {
                        res.result.data[i].images = res.result.data[i].files[0].file_cours + '/' + res.result.data[i].files[0].stre_file_nm;
                    }
                }
                for (let i = 0; i < res.result.data.length; i++) {
                    this.reviews.push(res.result.data[i]);
                    tempReviews.push(res.result.data[i]);
                }
                if (res.result.current_page >= res.result.last_page) {
                    this.canLoadMore = false;
                    return;
                }
            }
        });
    }

    // User follow
    toggleFollowFimer(followed_user_id) {
        this.api.all('user-follows').customPOST({
            followed_user_id: followed_user_id
        }).subscribe(res => {
            if (res.result) {
                for (let i = 0; i < this.reviews.length; i++) {
                    if (this.reviews[i].user_no === followed_user_id) {
                        this.reviews[i].followed = res.result.followed;
                        this.reviews[i].author_follows = res.result.total;
                    }
                }
            }
        });
    }

    toggleLikeReviews(review) {
        this.api.all('user-likes').customPOST({
            object_id: review.review_no,
            object_type: 'review'
        })
            .subscribe(res => {
                if (res.result) {
                    if (res.result.is_liking) {
                        review.is_liked = 1;
                    } else {
                        review.is_liked = 0;
                    }
                    review.like_number = res.result.total;
                }
            });
    }


    updateLayout() {
        setTimeout(() => {
            this.masonry.layout();
        }, 1000);
    }

    styleImageDescription() {
        const ckEditorImg = document.querySelectorAll('.description-block img');
        for (let i = 0; i < ckEditorImg.length; i++) {
            (<HTMLElement>ckEditorImg[i]).style.maxWidth = '100%';
            (<HTMLElement>ckEditorImg[i]).style.objectFit = 'cover';
            if (window.innerWidth < 481) {
                (<HTMLElement>ckEditorImg[i]).style.maxHeight = '200px';
            } else {
                (<HTMLElement>ckEditorImg[i]).style.maxHeight = '350px';
            }
        }
    }

    ngAfterViewChecked(): void {
        this.styleImageDescription();
    }

}
