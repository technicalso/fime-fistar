import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
import { AdminResourceComponent } from '../resource/resource.component';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './banner-details.component.html',
    styleUrls: ['./banner-details.component.scss']
})
export class AdminBannerDetailsComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public bannerId: any;
    public banner: any;
    public required_upload_file_url: boolean;
    public imageChangedEvent: any;
    public imageBase64: any;
    public invalidMainImage = false;
    public isSubmitted = false;

    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService
    ) { }

    ngOnInit() {
        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.bannerId = params['id'];
        });

        this.required_upload_file_url = false;

        this.banner = {
            is_youtube: false
        };

        this.form = new FormGroup({
            name: new FormControl(this.banner.name, []),
            description: new FormControl(this.banner.description, []),
            target_url: new FormControl(this.banner.target_url, []),
            target_type: new FormControl(this.banner.target_url, []),
            button_text: new FormControl(this.banner.button_text, []),
            period_from: new FormControl(this.banner.period_from, [Validators.required]),
            period_to: new FormControl(this.banner.period_from, [Validators.required]),
        });

        if (this.bannerId) {
            this.getBanner();
        }
    }

    getBanner() {
        this.api
            .one('banners', this.bannerId)
            .get()
            .subscribe(res => {
                this.banner = res.result;
                this.banner.period_from = moment.utc(this.banner.period_from).subtract(1, 'day').toDate();
                this.banner.period_to = moment.utc(this.banner.period_to).subtract(1, 'day').toDate();
            });
    }


    save() {
        this.isSubmitted = true;
        if (!this.resource.isChanged) {
            this.onSave();
        } else {
            this.resource.onSave((response) => {
                if (typeof response === 'undefined' || typeof response.url === 'undefined' || !response.url) {
                    this.invalidMainImage = true;
                    return;
                }
                this.banner.url = response.url + '/' + response.name;
                this.banner.resource_type = response.resource_type;
                this.onSave();
            });
        }
    }

    onSave() {
        if (this.bannerId) {
            this.api
                .one('banners', this.bannerId)
                .customPUT(this.banner)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update banner successfully');
                        this.router.navigate(['/admin/banners']);
                    }
                });
        } else {
            this.api
                .all('banners')
                .customPOST(this.banner)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add banner successfully');
                        this.router.navigate(['/admin/banners']);
                    }
                });
        }
    }
}
