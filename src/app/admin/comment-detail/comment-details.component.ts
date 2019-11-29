import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
} from '@angular/core';

import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';

import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './comment-details.component.html',
    styleUrls: ['./comment-details.component.scss']
})
export class AdminCommentDetailsComponent implements OnInit {
    public env: any;
    public commentID: any;
    public comment: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _location: Location
    ) {
    }

    ngOnInit() {
        this.comment = {
            name: '',
            description: ''
        };

        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.commentID = params['id'];
        });

        this.getReview();
    }

    getReview() {
        this.api.one('comments', this.commentID)
            .get()
            .subscribe(res => {
                this.comment = res.result;
            });
    }

    back() {
        this._location.back();
    }
}
