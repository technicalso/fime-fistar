import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from '../../../../services/cookie.service';
import { DOCUMENT } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-site-layout',
    templateUrl: './site-layout.component.html',
    styleUrls: ['./site-layout.component.scss']
})


export class SiteLayoutComponent implements OnInit {
    public business: any;
    public businessId: any;
    public offset = 0;

    constructor(private api: Restangular, private router: Router,
        public translate: TranslateService,
        @Inject(DOCUMENT) private document: Document) {
        translate.use('vn');
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.offset = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    }

    ngOnInit() {
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


}
