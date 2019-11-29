import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {MyPageFollowComponent} from './Content/follow/my-page-follow.component';
import {MyPageReviewsComponent} from './Content/reviews/my-page-reviews.component';
import {MyPageTriesComponent} from './Content/tries/my-page-tries.component';
import {MyPageHeaderComponent} from './header/my-page-header.component';

@Component({
    selector: 'app-my-page',
    templateUrl: './my-page.component.html',
    styleUrls: [
        './my-page.component.scss',
    ]
})

export class MyPageComponent implements OnInit {
    public env: any;
    public isLoading = true;
    public filterType;
    public filterTypes = [];
    public user: any;

    public needUpdateContent = false;

    public slug;
    public filterTemp;

    @ViewChild('follower') public follower: MyPageFollowComponent;
    @ViewChild('review') public review: MyPageReviewsComponent;
    @ViewChild('tries') public tries: MyPageTriesComponent;
    @ViewChild('header') public header: MyPageHeaderComponent;

    constructor(private cookieService: CookieService,
                private router: Router,
                private translate: TranslateService,
                private activeRoute: ActivatedRoute,
                private api: Restangular,
                private cd: ChangeDetectorRef,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.env = environment;
        this.user = {};
        this.filterTypes = ['reviews', 'likes', 'try-free', 'followers', 'followings', 'edit'];
        this.slug = this.activeRoute.snapshot.paramMap.get('slug');

        this.getUserInfo();

        this.follower.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
            this.resetUserData();
        });

        this.review.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
            this.resetUserData();
        });
        this.tries.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
            this.resetUserData();
        });

        this.header.toggleDone.subscribe(res => {
            this.needUpdateContent = true;
            this.filterType = res;
            this.router.navigate(['usr/' + this.slug + '/' + this.filterType]);
        });

    }

    resetUserData() {
        this.api.all('usr/' + this.slug).customGET().subscribe(res => {
            this.user = res.result;
        });
    }

    getUserInfo() {
        this.isLoading = true;
        this.api.all('usr/' + this.slug).customGET().subscribe(res => {
            this.user = res.result;
            this.isLoading = false;
            this.needUpdateContent = true;
            this.filterType = this.activeRoute.snapshot.paramMap.get('type');
            if (this.filterTypes.indexOf(this.filterType) === -1) {
                this.filterType = 'reviews';
                this.router.navigate(['usr/' + this.slug + '/' + this.filterType]);
            }

            // this.router.navigate(['usr/' + this.slug + '/' + this.filterType]);
        });
    }
}
