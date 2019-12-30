import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

import * as moment from 'moment';
import * as _ from 'lodash';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {TryDialogComponent} from '../try-dialog/try-dialog.component';
import {SettingService} from '../../../services/setting.service';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [
        './home.component.scss'
    ]
})
export class HomeComponent implements OnInit {
    public message: string;
    public categories: any;
    public env: any;
    public banners = [];
    public products = [];
    public reviews = [];
    public ads = [];
    public hashtags = [];
    public tips = [];
    public reviewPopularCache = [];
    public reviewRecentlyCache = [];
    public currentProduct: any;
    public intervalTime = 0;
    public endTime: any;
    public days = 99;
    public hours = 99;
    public minutes = 99;
    public seconds = 99;
    public typeReview = 'popular'; // Or 'recently'
    public isTryAvailable = false;
    public hotLeftFimers = [];
    public hotRightFimers = [];
    public defaultImage = 'assets/icons/default_image.png';
    public defaultUserAvatar = 'assets/images/user.png';
    public hotFimersFilterTypes = [];
    public hotFimersFilterType;
    public modalRef: BsModalRef;
    public mainTip: any;
    public subTips: any;
    public listTip: any;
    public try_info: string;
    public user: any;

    constructor(private restangular: Restangular,
                private cookieService: CookieService,
                public modalService: BsModalService,
                private router: Router,
                private toast: ToastrService,
                private settingService: SettingService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {};
        }
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
        this.mainTip = {
            title: '',
            content: '',
            slug: '',
            url: '',
            short_description: '',
            id: 0,
            resource_type: 1
        };
        this.subTips = [];
        this.listTip = [];
        this.hotFimersFilterTypes = ['weekly', 'monthly', 'all'];
        this.hotFimersFilterType = this.hotFimersFilterTypes[0];
        this.env = environment;
        this.getBanners();
        this.getTryProduct();
        this.getReviewByType(this.typeReview);
        this.getAds();
        this.getTopHashtags();
        this.getHotFimers();
        this.getTips();
        this.getTopViewTips();
        this.getTryInfo();
    }

    getTryInfo() {
        this.settingService.getSettings().subscribe(res => {
            if (res != null) {
                const data = _.keyBy(res, 'key');
                this.try_info = data.try_info.value;
            }
        });
    }

    // Common
    truncateContent(content: string, maxLength = 250) {
        if (content) {
            // trim the string to the maximum length
            let trimmedString = content.substr(0, maxLength);
            if (trimmedString.length < content.length) {
                if (Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')) === -1) {
                    return trimmedString;
                } else {
                    // re-trim if we are in the middle of a word
                    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
                    trimmedString += '...';
                    return trimmedString;
                }
            } else {
                return trimmedString;
            }
        } else {
            return content;
        }
    }

    // End Common code

    // Dev code
    times(n: number): any[] {
        return Array(n);
    }

    // Banner section
    getBanners() {
        const self = this;
        this.restangular.all('banners').customGET().subscribe(res => {
            if (res.result) {
                const result = res.result;
                self.banners = result;
                self.processBannerData(result);
            }
        });
    }

    processBannerData(data: any) {
        for (let i = 0; i < this.banners.length; i++) {
            if (this.banners[i].resource_type === 1 || this.banners[i].resource_type === 3) {
                this.banners[i].url = this.env.rootHost + this.banners[i].url;
            } else if (this.banners[i].resource_type === 2) {
                // https://www.youtube.com/embed/VIDEO_ID/?param
                this.banners[i].url += '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0';
            }
        }
    }

    // End banner section

    // TryMe section
    getTryProduct() {
        const self = this;
        this.restangular.all('tries/getAvailableTries').customGET().subscribe(res => {
            if (res.result) {
                const result = res.result;
                if (result.length === 0) {
                    return;
                } else {
                    this.isTryAvailable = true;
                }
                for (let i = 0; i < result.length; i++) {
                    result[i].isExpired = false;
                }
                self.products = result;
                this.currentProduct = self.products[0];
                this.endTime = moment.utc(this.currentProduct.event_endde);
                this.countDownTryTime();
            }
        });
    }

    changeProduct(index: number) {
        this.currentProduct = this.products[index];
        this.endTime = moment.utc(this.currentProduct.event_endde);
        this.countDownTryTime();
    }

    countDownTryTime() {
        const countDown = setInterval(() => {
            const now = moment();
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

    // End TryMe section

    // Review section
    getReviewByType(type: string) {
        this.typeReview = type;
        switch (type) {
            case 'popular':
                // If first time call API or data is empty -> call API
                if (this.reviewPopularCache.length === 0) {
                    this.restangular.all('reviews/getByType').customGET(this.typeReview).subscribe(res => {
                        if (res.result) {
                            const data = res.result;
                            this.processProductData(data);
                            // Cache data
                            this.reviewPopularCache = this.reviews.slice();
                        }
                    });
                } else { // Have cached data
                    this.reviews = this.reviewPopularCache;
                }
                break;
            case 'recently':
                // If first time call API or data is empty -> call API
                if (this.reviewRecentlyCache.length === 0) {
                    this.restangular.all('reviews/getByType').customGET(this.typeReview).subscribe(res => {
                        if (res.result) {
                            const data = res.result;
                            this.processProductData(data);
                            // Cache data
                            this.reviewRecentlyCache = this.reviews.slice();
                        }
                    });
                } else { // Have cached data
                    this.reviews = this.reviewRecentlyCache;
                }
                break;
            default:
        }
    }

    processProductData(data: any) {
        // Pick 4 of 12
        const range = Math.min(4, data.length);
        if (range === 0) {
            this.reviews = data;
        }
        for (let i = 0; i < range; i++) {
            this.reviews[i] = data[i];
            this.reviews[i].description = this.truncateContent(data[i].description, 150);

            this.reviews[i].images = null;
            if (this.reviews[i].files.length > 0) {
                this.reviews[i].images = this.reviews[i].files[0].file_cours + '/' + this.reviews[i].files[0].stre_file_nm;
            }
        }
    }

    // User follow
    toggleFollowFimer(followed_user_id) {
        const user = this.cookieService.get('user');
        this.restangular.all('user-follows').customPOST({
            followed_user_id: followed_user_id
        }).subscribe(res => {
            if (res.result) {
                for (let i = 0; i < this.reviews.length; i++) {
                    if (this.reviews[i].user_no === followed_user_id) {
                        this.reviews[i].followed = res.result.followed;
                        this.reviews[i].author_follows = res.result.total;
                    }
                }

                for (let i = 0; i < this.hotLeftFimers.length; i++) {
                    if (this.hotLeftFimers[i].user_no === followed_user_id) {
                        this.hotLeftFimers[i].followed = res.result.followed;
                        this.hotLeftFimers[i].number_of_followers = res.result.total;
                    }
                }

                for (let i = 0; i < this.hotRightFimers.length; i++) {
                    if (this.hotRightFimers[i].user_no === followed_user_id) {
                        this.hotRightFimers[i].followed = res.result.followed;
                        this.hotRightFimers[i].number_of_followers = res.result.total;
                    }
                }
            }
        });
    }

    // User like
    toggleLikeReview(review_id, index) {
        this.restangular.all('user-likes').customPOST({object_id: review_id, object_type: 'review'}).subscribe(res => {
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
        this.restangular.all('user-likes').customPOST({object_id: item.cntnts_no, object_type: 'try'}).subscribe(res => {
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

    // Advertisement section
    getAds() {
        this.restangular.all('ads/available').customGET().subscribe(res => {
            if (res.result) {
                // Just get 4 for display
                for (let i = 0; i < (res.result.length > 4 ? 4 : res.result.length); i++) {
                    this.ads.push(res.result[i]);
                }
            }
        });
    }

    // Hashtags section
    getTopHashtags() {
        this.restangular.all('hashtags').customGET().subscribe(res => {
            if (res.result) {
                this.hashtags = res.result;
            }
        });
    }

    getHotFimers() {
        this.restangular.all('fimers/getHot/' + this.hotFimersFilterType).customGET('', {page: 1}).subscribe(res => {
            if (res.result.data && res.result.data.length > 0) {
                this.hotLeftFimers = res.result.data.slice(0, Math.min(3, res.result.data.length));
                if (res.result.data.length > 3) {
                    this.hotRightFimers = res.result.data.slice(3, Math.min(6, res.result.data.length));
                }
            } else {
                this.hotRightFimers = [];
                this.hotLeftFimers = [];
            }
        });
    }

    getTips() {
        this.restangular.all('tips').customGET('').subscribe(res => {
            if (res.result) {
                this.tips = this.formatCreatedTime(res.result);
                this.mainTip = this.tips[0] ;
            }
        });

        /*this.restangular.all('blogs').customGET('available').subscribe(res => {
            if (res.result) {
                this.tips = res.result;
                for (let i = 0; i < this.tips.length; i++) {
                    // If youtube link, get thumbnail image
                    if (this.tips[i].resource_type === 2) {
                        const paths = this.tips[i].url.split('/');
                        this.tips[i].video_id = paths[paths.length - 1];
                    }
                }
                this.mainTip = this.tips[0];
                for (let i = 1; i < (this.tips.length >= 3 ? 3 : this.tips.length); i++) {
                    this.subTips.push(this.tips[i]);
                }
                for (let i = 3; i < (this.tips.length >= 6 ? 6 : this.tips.length); i++) {
                    this.listTip.push(this.tips[i]);
                }
            }
        });*/
    }

    getTopViewTips() {
        this.restangular.all('tips').customGET('top-view').subscribe(res => {
            if (res.result) {
                this.listTip = this.formatCreatedTime(res.result);
            }
        });
    }

    formatCreatedTime(tips) {
        for (let i = 0; i < tips.length; i++) {
            const now = moment();
            const created_time = tips[i].updated_at ? moment.utc(tips[i].updated_at) : moment.utc(tips[i].created_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                tips[i].time = duration.years();
                tips[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                tips[i].time = duration.months();
                tips[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                tips[i].time = duration.days();
                tips[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                tips[i].time = duration.hours();
                tips[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                tips[i].time = duration.minutes();
                tips[i].timeUnit = 'minute';
            } else {
                tips[i].time = duration.seconds();
                tips[i].timeUnit = 'second';
            }
        }
        return tips;
    }

    searchHotFimers(type) {
        this.hotFimersFilterType = type;
        this.getHotFimers();
    }

    goToFimersPage() {
        this.router.navigate(['/fimers/all']);
    }

    apply(item) {
        let fimer = {reviews: 0};
        this.restangular.all('fimers').customGET('profile').subscribe(res => {
            fimer = res.result;
            if (item.is_try_event === 1) {
                if (fimer.reviews < item.quantity_to_qualify) {
                    const remainingReviews = item.quantity_to_qualify - fimer.reviews;
                    this.toast.error('Bạn chưa đủ điều kiện tham gia try free này. Hãy viết thêm ' + remainingReviews +
                        ' reviews để tham gia');
                    return;
                }
            }

            const initialState = {
                tryItem: item,
                user: fimer
            };
            this.modalRef = this.modalService.show(
                TryDialogComponent,
                {initialState}
            );

            this.modalRef.content.onClose.subscribe(result => {
                item.total_apply = result;
                item.is_joined = true;
            });
        });
    }

    usersLikeDialog(object_id, object_type) {
        this.restangular.all('user-likes/get-list').customGET('',
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
