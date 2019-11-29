import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {SearchPageReviewsComponent} from './reviews/search-page-reviews.component';
import {SearchPageTriesComponent} from './tries/search-page-tries.component';
import {SearchPageHeaderComponent} from './header/search-page-header.component';
import {SearchPageFimerComponent} from './fimers/search-page-fimer.component';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: [
        './search-page.component.scss',
    ]
})

export class SearchPageComponent implements OnInit {
    public env: any;
    public isLoading = true;
    public filterType;
    public filterTypes = [];
    public searchKey;
    public searchValue;
    public needUpdateContent = false;

    @ViewChild('review') public review: SearchPageReviewsComponent;
    @ViewChild('tries') public tries: SearchPageTriesComponent;
    @ViewChild('header') public header: SearchPageHeaderComponent;
    @ViewChild('fimers') public fimers: SearchPageFimerComponent;

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
        this.filterTypes = ['reviews', 'tries', 'fimers'];


        this.review.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
        });

        this.fimers.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
        });

        this.tries.toggleDone.subscribe(res => {
            this.needUpdateContent = res;
        });

        this.header.toggleDone.subscribe(type => {
            this.needUpdateContent = true;
            this.searchKey = type;
            if (this.searchValue !== null) {
                this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey, searchValue: this.searchValue}});
            } else {
                this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey}});
            }
        });


        this.activeRoute.queryParamMap.subscribe(params => {
            this.searchKey = params.get('searchKey');
            this.searchValue = params.get('searchValue');

            if (this.searchKey === null) {
                this.searchKey = 'reviews';

                if (this.searchValue !== null) {
                    this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey, searchValue: this.searchValue}});
                } else {
                    this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey}});
                }
            }
            this.needUpdateContent = true;
        });
    }

    resetUserData() {
        // this.api.all('usr/' + this.slug).customGET().subscribe(res => {
        //
        // });
    }
}
