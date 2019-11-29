import {Component, Inject, Input, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../../services/cookie.service';

@Component({
    selector: 'app-my-page-follow',
    templateUrl: './my-page-follow.component.html',
    styleUrls: [
        './my-page-follow.component.scss',
    ]
})

export class MyPageFollowComponent implements OnInit {
    public env: any;

    @Input()
    public user: any;

    @Input()
    public filterType: any;

    @Input()
    public needUpdateContent: any;

    public defaultAvatar = 'assets/images/user.png';
    public toggleDone: Subject<any>;
    public followers = [];
    public followings = [];
    public isLoading = false;
    public page = 1;
    public currentUser: any;

    public myOptions: NgxMasonryOptions = {
        fitWidth: true,
        gutter: 20,
        horizontalOrder: true,
        transitionDuration: '0s'
    };

    constructor(private cookieService: CookieService, private api: Restangular) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;
        this.currentUser = this.cookieService.get('user') || {};
    }

    toggleFollowFimer(user) {
        this.api.all('user-follows').customPOST({followed_user_id: user.user_no}).subscribe(res => {
            if (res.result) {
                user.followed = res.result.followed;
                user.number_of_followers = res.result.total;

                const crrUser = this.cookieService.get('user');

                if (crrUser && crrUser.user_no === this.user.user_no) {
                    this.toggleDone.next(false);
                }

            }
        });
    }

    ngOnChanges(changes: any) {
        if (typeof this.needUpdateContent && this.needUpdateContent) {
            this.page = 1;
            if (this.filterType && typeof this.filterType !== 'undefined') {
                if (this.filterType === 'followers') {
                    this.getFollowers();
                } else if (this.filterType === 'followings') {
                    this.getFollowings();
                }
            }
        }
    }

    getFollowers() {
        if (typeof this.user !== 'undefined' && typeof this.user.user_no !== 'undefined') {
            this.isLoading = true;
            if (this.page === 1) {
                this.followers = [];
            }
            this.api.all('usr-info/followers').customGET('', {page: this.page, user_no: this.user.user_no}).subscribe(res => {
                this.isLoading = false;
                this.page = res.result.current_page;
                if (res.result.data) {
                    for (const key in res.result.data) {
                        if (res.result.data.hasOwnProperty(key)) {
                            this.followers.push(res.result.data[key]);
                        }
                    }
                }
            });
        }
    }

    getFollowings() {
        this.isLoading = true;
        if (this.page === 1) {
            this.followings = [];
        }
        this.api.all('usr-info/followings').customGET('', {page: this.page, user_no: this.user.user_no}).subscribe(res => {
            this.isLoading = false;
            this.page = res.result.current_page;
            if (res.result.data) {
                for (const key in res.result.data) {
                    if (res.result.data.hasOwnProperty(key)) {
                        this.followings.push(res.result.data[key]);
                    }
                }
            }
        });
    }

    onScroll() {
        this.page++;
        if (this.filterType === 'followers') {
            this.getFollowers();
        } else if (this.filterType === 'followings') {
            this.getFollowings();
        }
    }
}
