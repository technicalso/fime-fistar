import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { MetaService } from '@ngx-meta/core';
import { HttpClient } from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(public translate: TranslateService,
                private router: Router,
                meta: MetaService,
                @Inject(PLATFORM_ID) private platformId: Object) {
        translate.setDefaultLang('vn');
        translate.use('vn');
        setTheme('bs4'); // or 'bs3'

    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            if (isPlatformBrowser(this.platformId)) {
                window.scrollTo(0, 0);
            }
        });
    }

    switchLanguage(language: string) {
        this.translate.use(language);
    }
}
