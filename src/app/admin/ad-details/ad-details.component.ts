import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AdminResourceComponent } from '../resource/resource.component';

@Component({
    selector: 'app-admin-ad-detail',
    templateUrl: './ad-details.component.html',
    styleUrls: ['./ad-details.component.scss']
})
export class AdminAdDetailsComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public adId: any;
    public ad: any;
    public required_upload_file_url: boolean;
    public imageChangedEvent: any;
    public imageBase64: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.adId = params['id'];
        });

        this.required_upload_file_url = false;

        this.ad = {
            is_youtube: false,
            show_on_frontend: false
        };

        this.form = new FormGroup({
            name: new FormControl(this.ad.name, [Validators.required]),
            description: new FormControl(this.ad.description, []),
            url: new FormControl(this.ad.url, []),
            target_url: new FormControl(this.ad.target_url, [Validators.required]),
            order: new FormControl(this.ad.order, []),
            target_type: new FormControl(this.ad.order, []),
            is_youtube: new FormControl(this.ad.url, []),
            show_on_frontend: new FormControl(this.ad.show_on_frontend, [])
        });

        if (this.adId) {
            this.getAd();
        }
    }

    arrayOrder(n: number): any[] {
        return Array(n);
    }

    getAd() {
        this.api
            .one('ads', this.adId)
            .get()
            .subscribe(res => {
                this.ad = res.result;
            });
    }


    save() {
        this.resource.onSave((response) => {
            this.ad.url = response.url + '/' + response.name;
            this.ad.resource_type = response.resource_type;
            this.onSave();
        });
    }

    onSave() {
        if (this.adId) {
            this.api
                .one('ads', this.adId)
                .customPUT(this.ad)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update ad successfully');
                        this.router.navigate(['/admin/ads']);
                    }
                });
        } else {
            this.api
                .all('ads')
                .customPOST(this.ad)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add ad successfully');
                        this.router.navigate(['/admin/ads']);
                    }
                });
        }
    }
}
