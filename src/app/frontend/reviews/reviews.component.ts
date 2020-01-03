import {Component, OnInit, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {NgxMasonryOptions, NgxMasonryComponent} from 'ngx-masonry';
import * as moment from 'moment';
import {ShareFacebookService} from '../../../services/share-facebook.service';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import { MetaService } from '@ngx-meta/core';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: [
        './reviews.component.scss',
    ]
})
export class ReviewsComponent implements OnInit {
    public env: any;
    public user: any;
    public reviews = [];
    public top_fimers = [];
    public advertisements = [];
    public categories = [];
    private page = 1;
    public isLoading = true;
    public option = 1;
    public position = 0;
    public mixedData = [];
    public loadedFimer = false;
    public slug: string;
    public tag: string;
    public canLoadMore = false;
    public isEmpty = false;
    public modalRef: BsModalRef;

    @ViewChild('mymasonry') private masonry: NgxMasonryComponent;

    public myOptions: NgxMasonryOptions = {
        horizontalOrder: true,
        gutter: 50,
        transitionDuration: '0s'
    };

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                private shareFacebookService: ShareFacebookService,
                public modalService: BsModalService,
                public meta: MetaService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (window.innerWidth < 1920 && window.innerWidth >= 1280) {
            this.myOptions.gutter = 30;
        } else if (window.innerWidth < 1024 && window.innerWidth > 767) {
            this.myOptions.gutter = 25;
        } else if (window.innerWidth < 426) {
            this.myOptions.gutter = 0;
        }
        if (window.innerWidth < 1024) {
            this.canLoadMore = true;
        }

        this.route.queryParamMap.subscribe(params => {
            if (params.get('hashtag') !== null && params.get('hashtag') !== '') {
                this.tag = params.get('hashtag');
            } else {
                this.tag = '';
            }
        });

        this.route.paramMap.subscribe(params => {
            this.slug = params.get('slug');
            if (this.slug === null) {
                this.slug = 'all';
                this.router.navigate(['reviews/' + this.slug]);
            }
            if (this.slug) {
                this.page = 1;
                this.loadedFimer = false;
                this.getReviews();
            }
        });

        this.env = environment;
        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {};
        }
        this.getSettings();
        this.getTopInteractiveFimers();
        this.getAdvertisements();
        this.getCategories();

        this.meta.setTitle('fi:me / Reviews');
        this.meta.setTag('og:title', 'fi:me / Reviews');
        this.meta.setTag('og:url', environment.url + 'reviews/' + this.slug);
    }

    formatCreatedTime(reviews) {
        for (let i = 0; i < reviews.length; i++) {
            const now = moment();
            const created_time = moment(reviews[i].writng_dt);
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

    getCategories() {
        this.api.all('categories').customGET('').subscribe(res => {
            this.categories = res.result;
        });
    }

    getSettings() {
        this.api.all('settings/getByGroup').customGET('', {group: 'setting'}).subscribe(res => {
            if (res.result) {
                for (let i = 0; i < res.result.length; i++) {
                    if (res.result[i].key === 'review_layout_option') {
                        this.option = res.result[i].value * 1;
                        if (this.option === 2) {
                            this.getTopFimerPosition();
                            this.canLoadMore = false;
                        } else {
                            this.getReviews();
                        }
                        return;
                    }
                }
            }
        });
    }

    getTopFimerPosition() {
        this.api.all('settings/getByGroup').customGET('', {group: 'review_fimer'}).subscribe(res => {
            if (res.result) {
                for (let i = 0; i < res.result.length; i++) {
                    if (res.result[i].key === 'position') {
                        this.position = res.result[i].value * 1;
                        this.getReviews();
                        return;
                    }
                }
            }
        });
    }

    getReviews() {
        return this.api.all('reviews/getNew').customGET('', {
            page: this.page,
            slug: this.slug ? this.slug : '', tag: this.tag
        }).subscribe(res => {
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
                if (this.option === 2) {
                    this.mixedData = [];
                    this.mixingData(this.reviews);
                }
            }
        });
    }

    getTopInteractiveFimers() {
        this.api.all('user-follows/topInteractive').customGET().subscribe(res => {
            if (res.result) {
                this.top_fimers = res.result;
            }
        });
    }

    getAdvertisements() {
        this.api.all('ads/available').customGET().subscribe(res => {
            if (res.result) {
                this.advertisements = res.result;
            }
        });
    }

    mixingData(reviews) {
        for (let i = 0; i < reviews.length; i++) {
            reviews[i].type = 'review';
            this.mixedData.push(reviews[i]);
        }
        for (let i = 0; i < this.advertisements.length; i++) {
            this.advertisements[i].type = 'ad';
            const index = this.advertisements[i].order;
            if (index <= this.mixedData.length && this.mixedData.indexOf(this.advertisements[i]) === -1) {
                this.mixedData.splice(index, 0, this.advertisements[i]);
            }
        }
        if (this.position <= this.mixedData.length && !this.loadedFimer) {
            this.mixedData.splice(this.position, 0, {type: 'fimer'});
            this.loadedFimer = true;
        }
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

                for (let i = 0; i < this.top_fimers.length; i++) {
                    if (this.top_fimers[i].user_no === followed_user_id) {
                        this.top_fimers[i].followed = res.result.followed;
                        this.top_fimers[i].follows = res.result.total;
                        break;
                    }
                }

            }
        });
    }

    // User like
    toggleLikeReview(review) {
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

    onScroll() {
        this.page++;
        this.api.all('reviews/getNew').customGET('', {page: this.page, slug: this.slug ? this.slug : ''}).subscribe(res => {
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
                if (this.option === 2) {
                    this.mixingData(tempReviews);
                }
                if (res.result.current_page >= res.result.last_page) {
                    this.canLoadMore = false;
                    return;
                }
            }
        });
    }

    createReview() {
        this.router.navigate(['/reviews/create']);
    }

    updateLayout() {
        setTimeout(() => {
            this.masonry.layout();
        }, 1500);
    }

    onScrollLargeScreen() {
        if (window.innerWidth >= 1024) {
            this.onScroll();
        } else {
            return;
        }
    }

    shareLink(slug) {
        const href = this.env.url + '/reviews/detail/' + slug;
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

    onTab(slug) {
        if (this.tag && this.tag !== '') {
            this.router.navigate(['/reviews/' + slug], {queryParams: {hashtag: this.tag}});
        } else {
            this.router.navigate(['/reviews/' + slug]);
        }
    }
}
