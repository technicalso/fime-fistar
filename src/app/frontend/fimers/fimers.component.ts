import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NgxMasonryOptions} from 'ngx-masonry';

@Component({
    selector: 'app-home',
    templateUrl: './fimers.component.html',
    styleUrls: [
        './fimers.component.scss'
    ]
})
export class FimersComponent implements OnInit {
    public env: any;
    public filter_section = [];
    public fimers = [];
    public filterType;
    public filterTypes = [];
    public limit = 10;
    public offset = 0;
    public defaultImage = 'assets/icons/default_image.png';
    public defaultUserAvatar = 'assets/images/user.png';
    public page = 1;
    public isLoading = true;
    public user: any;

    public myOptions: NgxMasonryOptions = {
        horizontalOrder: true,
        gutter: 25,
        transitionDuration: '0s'
    };

    constructor(private cookieService: CookieService,
                private router: Router,
                private translate: TranslateService,
                private activeRoute: ActivatedRoute,
                private api: Restangular,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.env = environment;
        this.filterTypes = ['all', 'weekly', 'monthly', 'new_member'];
        this.resetFilterSection();
        this.activeRoute.params.forEach((params: Params) => {
            this.filterType = params['type'];

            if (this.filterTypes.indexOf(this.filterType) === -1) {
                this.filterType = 'all';
            }
            this.resetFilterActive();
            this.router.navigate(['/fimers/' + this.filterType]);
        });
        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {};
        }
        this.getFimers();
    }

    getFimers() {
        this.isLoading = true;
        this.api.all('fimers/get/' + this.filterType).customGET('', {page: this.page}).subscribe(res => {
            this.isLoading = false;
            this.page = res.result.current_page;
            if (res.result.data) {
                for (const key in res.result.data) {
                    if (res.result.data.hasOwnProperty(key)) {
                        this.fimers.push(res.result.data[key]);
                    }
                }
            }
        });
    }

    // Dev code
    times(n: number): any[] {
        return Array(n);
    }

    onSearch(filter) {
        this.fimers = [];
        this.page = 1;
        this.filterType = filter.filterType;
        this.resetFilterSection();
        this.resetFilterActive();
        this.router.navigate(['/fimers/' + this.filterType]);
        this.fimers = [];
        this.getFimers();
    }

    resetFilterSection() {
        this.filter_section = [
            {
                'filterType': 'all',
                'translateKey': 'fimers.sort.all',
                'active': false
            },
            {
                'filterType': 'weekly',
                'translateKey': 'fimers.sort.weekly',
                'active': false
            },
            {
                'filterType': 'monthly',
                'translateKey': 'fimers.sort.monthly',
                'active': false
            },
            {
                'filterType': 'new_member',
                'translateKey': 'fimers.sort.new_member',
                'active': false
            }
        ];
    }

    resetFilterActive() {
        this.filter_section[this.filterTypes.indexOf(this.filterType)].active = true;
    }

    onScroll() {
        this.page++;
        this.getFimers();
    }

    toggleFollowFimer(followed_user) {
        const user = this.cookieService.get('user');
        this.api.all('user-follows').customPOST({
            followed_user_id: followed_user.user_no
        }).subscribe(res => {
            if (res.result) {
                followed_user.followed = res.result.followed;
                followed_user.number_of_followers = res.result.total;
            }
        });
    }
}
