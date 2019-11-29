import {Component, OnInit, Inject, PLATFORM_ID, ElementRef, Renderer2} from '@angular/core';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';
import {ShareFacebookService} from '../../../services/share-facebook.service';

@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: [
        './blog-detail.component.scss',
    ]
})

export class BlogDetailComponent implements OnInit {
    public env: any;
    public blog: any;
    public listblog: any;
    public topFimers: any;
    public slug: string;
    public shareLink: string;
    public mainAd: any;
    public otherAds: any;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                private facebookService: ShareFacebookService,
                private elRef: Renderer2,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.shareLink = this.env.url + this.route.url;
        this.slug = this.route.snapshot.paramMap.get('slug');
        this.blog = {};
        this.listblog = [];
        this.topFimers = [];
        this.mainAd = {};
        this.otherAds = [];
        this.getblog();
        this.getTopViewblogs();
        this.getTopInteractiveFimers();
        this.getAds();
    }

    getblog() {
        this.api.all('blogs').customGET('getBySlug', {slug: this.slug}).subscribe(res => {
            if (res.result) {
                this.blog = this.formatCreatedTime(res.result);
            }
        });
    }

    getTopViewblogs() {
        this.api.all('blogs').customGET('top-view').subscribe(res => {
            if (res.result) {
                this.listblog = res.result.data;
                for (let i = 0; i < this.listblog.length; i++) {
                    // If youtube link, get thumbnail image
                    if (this.listblog[i].resource_type === 2) {
                        const paths = this.listblog[i].url.split('/');
                        this.listblog[i].video_id = paths[paths.length - 1];
                    }
                }
            }
        });
    }

    getTopInteractiveFimers() {
        this.api.all('user-follows/topInteractive').customGET().subscribe(res => {
            if (res.result) {
                this.topFimers = res.result;
            }
        });
    }

    getAds() {
        this.api.all('ads/available').customGET().subscribe(res => {
            if (res.result) {
                if (res.result.length > 0) {
                    this.mainAd = res.result[0];
                    for (let i = 1; i < res.result.length; i++) {
                        this.otherAds.push(res.result[i]);
                    }
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



    formatCreatedTime(blog) {
            const now = moment();
            const created_time = moment(blog.created_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                blog.time = duration.years();
                blog.timeUnit = 'year';
            } else if (duration.months() > 0) {
                blog.time = duration.months();
                blog.timeUnit = 'month';
            } else if (duration.days() > 0) {
                blog.time = duration.days();
                blog.timeUnit = 'day';
            } else if (duration.hours() > 0) {
                blog.time = duration.hours();
                blog.timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                blog.time = duration.minutes();
                blog.timeUnit = 'minute';
            } else {
                blog.time = duration.seconds();
                blog.timeUnit = 'second';
            }
        return blog;
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
}
