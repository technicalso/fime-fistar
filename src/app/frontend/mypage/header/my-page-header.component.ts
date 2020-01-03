import {Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {CookieService} from '../../../../services/cookie.service';
import { MetaService } from '@ngx-meta/core';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-my-page-header',
    templateUrl: './my-page-header.component.html',
    styleUrls: [
        './my-page-header.component.scss',
    ]
})

export class MyPageHeaderComponent implements OnInit, OnChanges {
    public env: any;
    public isLoading = true;
    public reviewSlug;
    @Input()
    public user: any;

    @Input()
    public filter_section: any;

    @Input()
    public filterType: any;

    public toggleDone: Subject<any>;
    public updateRole = false;

    public defaultAvatar = 'assets/images/user.png';

    constructor(private cookieService: CookieService, 
        private api: Restangular, 
        private route: ActivatedRoute,
        public http: HttpClient,
        public meta: MetaService,
        ) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;
        
        //SHARE META
        this.route.params.subscribe(params => {
            if (params.slug !== null && params.slug !== '') {
                this.reviewSlug = params.slug;
                this.http.get(environment.host + '/usr/' + this.reviewSlug).subscribe((res: any) => {
                    if (res.result) {
                        const url = environment.url + '/usr/' + this.reviewSlug;
                        this.meta.setTitle(res.result.id);
                        this.meta.setTag('og:title', res.result.id);
                        this.meta.setTag('og:description', res.result.self_intro);
                        this.meta.setTag('og:url', url);
                        this.meta.setTag('og:image', environment.rootHost + res.result.pic);
                    }
                });
            }
        });
    }

    ngOnChanges(changes: any) {
        if (this.user && typeof this.user !== 'undefined') {
            const user = this.cookieService.get('user');

            if (user && user.user_no === this.user.user_no) {
                this.updateRole = true;
            } else {
                this.updateRole = false;
            }
        }
    }

    onTab(type) {
        if (type !== this.filterType) {
            this.toggleDone.next(type);
        }
    }

    checkUndefined(value): boolean {
        return typeof value === 'undefined';
    }
}
