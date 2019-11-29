import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: [
        './privacy-policy.component.scss',
    ]
})

export class PrivacyPolicyComponent implements OnInit {
    public env: any;
    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.env = environment;
        window.scroll(0, 0);
    }
}
