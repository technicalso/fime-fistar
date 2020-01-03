import {Component, OnInit, Inject, PLATFORM_ID, ElementRef, Renderer2} from '@angular/core';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';
import {ShareFacebookService} from '../../../services/share-facebook.service';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import { MetaService } from '@ngx-meta/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-tip-detail',
    templateUrl: './tip-detail.component.html',
    styleUrls: [
        './tip-detail.component.scss',
    ]
})

export class TipDetailComponent implements OnInit {
    public env: any;
    public tip: any;
    public listTip: any;
    public topFimers: any;
    public slug: string;
    public shareLink: string;
    public mainAd: any;
    public otherAds: any;
    public tip_id;
    public intervalTime = 0;
    public products = [];
    public currentProduct: any;
    public endTime: any;
    public days = 99;
    public hours = 99;
    public minutes = 99;
    public seconds = 99;
    public isLoading = true;
    public interval: any;
    public reviews: any;
    public reviewSlug;
    public modalRef: BsModalRef;
    public hotFimers: any;
    public defaultUserAvatar = 'assets/images/user.png';
    public user: any;
    public hashtags;
    public count_down_type = 1;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                private facebookService: ShareFacebookService,
                private elRef: Renderer2,
                public meta: MetaService,
                public http: HttpClient,
                public modalService: BsModalService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {};
        }
        this.env = environment;
        this.shareLink = this.env.url + this.route.url;
        // SHARE META
        this.tip_id = this.route.snapshot.paramMap.get('id');
        this.http.get(environment.host + '/tip/' + this.tip_id).subscribe((res: any) => {
            if (res.result) {
                const url = environment.url + '/tips/' + this.tip_id;
                const image = environment.rootHost + res.result.img_url + '/' + res.result.cover_img1;
                this.meta.setTitle(res.result.subject);
                this.meta.setTag('og:title', res.result.subject);
                this.meta.setTag('og:description', res.result.caption_text);
                this.meta.setTag('og:url', url);
                this.meta.setTag('og:image', image);
            }
        });
        this.tip = {};
        this.listTip = [];
        this.topFimers = [];
        this.mainAd = {};
        this.otherAds = [];
        this.currentProduct = {
            name: '',
            price: 0,
            sale_price: 0,
            resource_type: -1,
            total_apply: 0,
            join_max_count: 0,
            feature_image: '',
            users_liked: []
        };
        this.getTip();
        // this.getTopViewTips();
        // this.getTopInteractiveFimers();
        // this.getAds();
        this.getTopHashtags();
    }

    getTip() {
        this.api.all('tip').customGET(this.tip_id, {}).subscribe(res => {
            if (res.result) {
                this.isLoading = false;
                this.tip = this.formatCreatedTime(res.result);
                if (this.tip.tries && this.tip.tries.length) {
                    this.products = this.tip.tries;
                    this.currentProduct = this.products[0];
                    this.endTime = moment(this.currentProduct.event_endde);
                    this.countDownTryTime();
                }

                if (this.tip.reviews && this.tip.reviews.length) {
                    this.reviews = this.tip.reviews;

                    for (let i = 0; i < this.reviews.length; i++) {
                        this.reviews[i].images = null;
                        if (this.reviews[i].files.length > 0) {
                            this.reviews[i].images = this.reviews[i].files[0].FILE_COURS + '/' + this.reviews[i].files[0].STRE_FILE_NM;
                        }
                    }

                }

                if (this.tip.hotFimers && this.tip.hotFimers.length) {
                    this.hotFimers = this.tip.hotFimers;
                }

            }
        });
    }

    toggleFollowFimer(followed_user_id) {
        this.api.all('user-follows').customPOST({
            followed_user_id: followed_user_id
        }).subscribe(res => {
            if (res.result) {

                for (let i = 0; i < this.topFimers.length; i++) {
                    if (this.topFimers[i].id === followed_user_id) {
                        this.topFimers[i].followed = res.result.followed;
                        this.topFimers[i].follows = res.result.total;
                        break;
                    }
                }

            }
        });
    }

    formatCreatedTime(tip) {
        const now = moment();
        const created_time = tip.updated_at ? moment.utc(tip.updated_at) : moment.utc(tip.created_at);
        const duration = moment.duration(now.diff(created_time));
        if (duration.years() > 0) {
            tip.time = duration.years();
            tip.timeUnit = 'year';
        } else if (duration.months() > 0) {
            tip.time = duration.months();
            tip.timeUnit = 'month';
        } else if (duration.days() > 0) {
            tip.time = duration.days();
            tip.timeUnit = 'day';
        } else if (duration.hours() > 0) {
            tip.time = duration.hours();
            tip.timeUnit = 'hour';
        } else if (duration.minutes() > 0) {
            tip.time = duration.minutes();
            tip.timeUnit = 'minute';
        } else {
            tip.time = duration.seconds();
            tip.timeUnit = 'second';
        }
        return tip;
    }

    scrollToTop(event): void {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 100); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 10);
    }

    // Dev code
    times(n: number): any[] {
        return Array(n);
    }

    countDownTryTime() {
        const countDown = setInterval(() => {
            const now = moment();
            const startTime = moment.utc(this.currentProduct.event_bgnde);
            const endTime = moment.utc(this.currentProduct.event_endde);

            if (startTime > now) {
                // Coming soon
                this.count_down_type = 0;
            } else if (startTime <= now && endTime > now) {
                // Coming soon
                this.count_down_type = 1;
            } else {
                this.count_down_type = 2;
            }


            const remainingTime = moment.duration(this.endTime.diff(now));
            this.days = remainingTime.days();
            this.hours = remainingTime.hours();
            this.minutes = remainingTime.minutes();
            this.seconds = remainingTime.seconds();
            if (this.days <= 0 && this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
                clearInterval(countDown);
                this.days = 0;
                this.hours = 0;
                this.minutes = 0;
                this.seconds = 0;
                this.currentProduct.isExpired = true;
            }
        }, 1000);
    }

    changeProduct(index: number) {
        this.currentProduct = this.products[index];
        this.endTime = moment(this.currentProduct.event_endde);
        this.countDownTryTime();
    }

    // User like
    toggleLikeReview(review_id, index) {
        this.api.all('user-likes').customPOST({object_id: review_id, object_type: 'review'}).subscribe(res => {
            if (res.result) {
                this.reviews[index].like_number = res.result.total;

                if (res.result.is_liking) {
                    this.reviews[index].is_liked = 1;
                } else {
                    this.reviews[index].is_liked = 0;
                }
            }
        });
    }

    toggleLikeTry(item) {
        this.api.all('user-likes').customPOST({object_id: item.cntnts_no, object_type: 'try'}).subscribe(res => {
            if (res.result) {
                item.likes = res.result.total;
                item.users_liked = res.result.users;

                if (res.result.is_liking) {
                    item.is_liked = 1;
                } else {
                    item.is_liked = 0;
                }
            }
        });
    }

    shareTipLink() {
        const href = this.env.url + this.router.url;
        console.log(href);
        
        this.facebookService.share(href);
        this.facebookService.response.subscribe(res => {
            return;
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

    // Hashtags section
    getTopHashtags() {
        this.api.all('hashtags').customGET().subscribe(res => {
            if (res.result) {
                this.hashtags = res.result;
            }
        });
    }

    generateVideoURL(originalURL) {
        if (originalURL.includes('youtu')) {
            // Split url to get video's ID
            const path = originalURL.split('/');
            const videoID = path[path.length - 1];
            if (originalURL.includes('embed')) {
                return originalURL;
            } else {
                return 'https://www.youtube.com/embed/' + videoID + '?autoplay=0&controls=1&showinfo=0';
            }
        }
        return originalURL;
    }
}
