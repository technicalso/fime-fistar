import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {CookieService} from '../../../../services/cookie.service';

@Component({
    selector: 'app-search-page-header',
    templateUrl: './search-page-header.component.html',
    styleUrls: [
        './search-page-header.component.scss',
    ]
})

export class SearchPageHeaderComponent implements OnInit {
    public env: any;
    public isLoading = true;

    @Input()
    public searchKey: any;

    @Input()
    public searchValue: any;

    public toggleDone: Subject<any>;

    constructor(private cookieService: CookieService, private api: Restangular, private route: ActivatedRoute) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;
    }

    ngOnChanges(changes: any) {

    }

    onTab(type) {
        if (type !== this.searchKey) {
            this.toggleDone.next(type);
        }
    }
}
