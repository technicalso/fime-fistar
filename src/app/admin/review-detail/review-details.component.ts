import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';

import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AngularFileUploaderComponent} from 'angular-file-uploader';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './review-details.component.html',
    styleUrls: ['./review-details.component.scss']
})
export class AdminReviewDetailsComponent implements OnInit {
    public env: any;
    public reviewID: any;
    public review: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.review = {
            name: '',
            description: ''
        };

        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.reviewID = params['id'];
        });

        this.getReview();
    }

    getReview() {
        this.api.one('reviews', this.reviewID)
            .get()
            .subscribe(res => {
                this.review = res.result;
            });
    }
}
