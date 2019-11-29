import {AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../../services/cookie.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NotificationService} from '../../../../services/notification.service';
import {environment} from '../../../../environments/environment';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
    public categories = [];
    public user: any;
    public notificationNumber: any;
    public searchValue = '';
    public searchKey;
    public activeMenu: any;
    public crrUserSlug: any;
    public isToggleMenu = false;
    public isToggleSubMenu = false;
    public env: any;
    public defaultAvatar = 'assets/images/user.png';

    @ViewChild('searchInput') private searchInput: ElementRef;

    ngAfterViewInit() {
    }

    constructor(private api: Restangular,
                private cookie: CookieService,
                private notificationService: NotificationService,
                private router: Router,
                private renderer2: Renderer2,
                private activeRoute: ActivatedRoute,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit() {
        this.env = environment;
        this.user = {};
        if (this.cookie.get('X-Token')) {
            this.getProfile();
        }
        this.getCategories();
        const arr_param = this.router.routerState.snapshot.url.split('/');
        this.activeMenu = arr_param[1];
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                const param = val.url.split('/');
                if (param[1] === 'usr' && this.user !== null && this.user.slug === param[2]) {
                    this.activeMenu = 'usr';
                } else if (param[1] === 'usr') {
                    this.activeMenu = null;
                } else {
                    this.activeMenu = param[1];
                }
            }
        });

        /*
        this.activeRoute.queryParamMap.subscribe(params => {
            this.searchKey = params.get('searchKey');
            this.searchValue = params.get('searchValue');

            if (this.searchKey !== null && this.searchValue !== '') {
                this.searchKey = 'reviews';

                if (this.searchValue !== null) {
                    this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey, searchValue: this.searchValue}});
                } else {
                    this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey}});
                }
            }
        });
        */
    }

    getProfile() {
        this.api.all('fimers').customGET('profile').subscribe(res => {
            if (res.result) {
                this.user = res.result;
                this.crrUserSlug = this.user.slug;
                this.getNotificationNumber();
            } else {
                this.cookie.remove('X-Token');
                this.cookie.remove('user');
            }
        });
    }

    getCategories() {
        this.api.all('categories').customGET('').subscribe(res => {
            this.categories = res.result;
        });
    }

    getNotificationNumber() {
        this.notificationService.getNotificationNumber();
        this.notificationService.notificationNumber.subscribe(res => {
            this.notificationNumber = res;
        });
    }

    logout() {
        this.cookie.remove('X-Token');
        this.cookie.remove('user');
        this.toggleMenu();
        this.router.navigate(['/login']);
    }

    updateNotificationNumber(event) {
        this.getNotificationNumber();
    }

    resetUserTry() {
        this.user.new_tries = 0;
        this.toggleMenu();
    }

    resetUserReview() {
        this.user.new_reviews = 0;
        this.toggleMenu();
    }

    onKeyPress(e) {
        if (e.keyCode === 13) {
            this.searchData();
        }
    }

    search() {
        this.searchInput.nativeElement.focus();
        this.searchData();
    }

    searchData() {
        if (this.searchValue !== null && this.searchValue !== '') {
            this.router.navigate(['/search'], {queryParams: {searchKey: this.searchKey, searchValue: this.searchValue}});
        }
    }

    toggleMenu() {
        this.isToggleMenu = !this.isToggleMenu;
    }

    toggleSubMenu() {
        this.isToggleSubMenu = !this.isToggleSubMenu;
    }

    checkUndefined(value): boolean {
        return typeof value === 'undefined';
    }

    openSearchForm() {
        const searchForm = (<HTMLElement>this.document.querySelector('#mobileSearchForm'));
        searchForm.classList.toggle('active');
    }
}
