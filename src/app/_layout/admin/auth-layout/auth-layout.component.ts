import { Component, OnInit } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from '../../../../services/cookie.service';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
    public business: any;
    public businessId: any;

    constructor(private api: Restangular, private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
    }

}
