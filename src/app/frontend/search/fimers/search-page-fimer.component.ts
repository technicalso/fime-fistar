import {Component, Inject, Input, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../services/cookie.service';

@Component({
    selector: 'app-search-page-fimer',
    templateUrl: './search-page-fimer.component.html',
    styleUrls: [
        './search-page-fimer.component.scss',
    ]
})

export class SearchPageFimerComponent implements OnInit {
    public env: any;

    @Input()
    public searchValue: any;

    @Input()
    public searchKey: any;

    @Input()
    public needUpdateContent: any;

    public defaultAvatar = 'assets/images/user.png';
    public toggleDone: Subject<any>;
    public fimers = [];
    public isLoading = false;
    public page = 1;
    public defaultImage = 'assets/icons/default_image.png';
    public defaultUserAvatar = 'assets/images/user.png';

    public user: any;

    public myOptions: NgxMasonryOptions = {
        horizontalOrder: true,
        gutter: 25,
        transitionDuration: '0s'
    };

    constructor(private cookieService: CookieService, private api: Restangular) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;

        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {};
        }
    }

    toggleFollowFimer(user) {
        this.api.all('user-follows').customPOST({
            followed_user_id: user.user_no
        }).subscribe(res => {
            if (res.result) {
                user.followed = res.result.followed;
                user.number_of_followers = res.result.total;
            }
        });
    }

    ngOnChanges(changes: any) {
        if (typeof this.needUpdateContent && this.needUpdateContent && this.searchKey === 'fimers') {
            this.page = 1;
            this.getFimers();
        }
    }

    getFimers() {
        this.isLoading = true;

        let param = {};
        if (this.searchValue === null) {
            param = {page: this.page};
        } else {
            param = {page: this.page, searchValue: this.searchValue};
        }

        if (this.page === 1) {
            this.fimers = [];
        }

        // this.toggleDone.next(false);

        this.api.all('search/fimers').customGET('', param).subscribe(res => {
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

    onScroll() {
        if (this.searchKey === 'fimers') {
            this.page++;
            this.getFimers();
        }
    }
}
