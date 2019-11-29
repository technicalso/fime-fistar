import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-admin-setting',
    templateUrl: './setting.component.html',
    styleUrls: [
        './setting.component.scss'
    ]
})
export class AdminSettingComponent implements OnInit {
    public env: any;
    public form: any;
    public address: any;
    public try_info: any;
    public company: any;
    public email: any;
    public tel: any;
    public custom_color: any;
    public business_licence: any;
    public review_layout_option: any;
    public points: any;
    public points_data = [];
    public colors_data = [];
    public sitemap: any;
    public updateSitemap = false;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.address = {};
        this.try_info = {};
        this.company = {};
        this.email = {};
        this.tel = {};
        this.business_licence = {};
        this.review_layout_option = {};
        this.custom_color = '';
        this.form = new FormGroup({
            address: new FormControl(this.address.value, [Validators.required]),
            try_info: new FormControl(this.try_info.value, [Validators.required]),
            company: new FormControl(this.company.value, [Validators.required]),
            email: new FormControl(this.email.value, [Validators.required, Validators.email]),
            tel: new FormControl(this.tel.value, [Validators.required]),
            business_licence: new FormControl(this.business_licence.value, [Validators.required]),
            review_layout_option: new FormControl(this.review_layout_option.value, []),
            custom_color: new FormControl(this.custom_color, []),
            points: this.formBuilder.array([]),
            text_colors: this.formBuilder.array([])
        });
        this.getSettings();
        this.getPoints();
        this.getColors();
    }

    getSettings() {
        this.api.all('settings').customGET('').subscribe(res => {
            if (res.result) {
                this.handleData(res.result);
            }
        });
    }

    onSave() {
        this.updateTextColors();
        if (this.form.controls.text_colors.value.length < 3 && this.custom_color) {
         this.createCustomTextColor();
        }
        this.updateSetting();
        this.updatePoint();
    }

    updatePoint() {
        this.api.one('admin/points').customPUT({data: this.form.controls.points.value}).subscribe(res => {
        });
    }

    createCustomTextColor() {
        this.api.all('admin/text-colors').customPOST({color: this.custom_color}).subscribe((res) => {
            if (res.result) {
                this.getColors();
            }
        });
    }

    updateTextColors() {
        this.api.one('admin/text-colors').customPUT({
            colors: this.form.controls.text_colors.value
        }).subscribe(res => {
            if (res.result) {
            }
        });
    }

    updateSetting() {
        this.api.one('settings').customPUT({
            data: {
                address: this.address,
                company: this.company,
                tel: this.tel,
                email: this.email,
                business_licence: this.business_licence,
                review_layout_option: this.review_layout_option,
                try_info: this.try_info
            }
        }).subscribe(res => {
            if (res.result) {
                this.handleData(res.result);
                this.toast.success('Update successfully');
            }
        });
    }

    handleData(data) {
        for (const item in data) {
            if (data.hasOwnProperty(item)) {
                switch (data[item].key) {
                    case 'address':
                        this.address = data[item];
                        break;
                    case 'try_info':
                        this.try_info = data[item];
                        break;
                    case 'company':
                        this.company = data[item];
                        break;
                    case 'email':
                        this.email = data[item];
                        break;
                    case 'tel':
                        this.tel = data[item];
                        break;
                    case 'business_licence':
                        this.business_licence = data[item];
                        break;
                    case 'review_layout_option':
                        this.review_layout_option = data[item];
                        break;
                }
            }
        }
    }

    getPoints() {
        this.api.all('admin').customGET('points').subscribe(res => {
            if (res.result) {
                this.points_data = res.result;
                const creds = this.form.controls.points.controls.point as FormArray;
                for (const point of this.points_data) {
                    this.form.get('points').push(
                        new FormGroup({
                            code_nm: new FormControl(point.code_nm, Validators.required),
                            code: new FormControl(point.code, []),
                            refrn_info: new FormControl(point.refrn_info, Validators.required)
                        })
                    );
                    // creds.push(this.formBuilder.group({
                    //     code_nm: point.code_nm,
                    //     refrn_info: point.refrn_info,
                    // }));
                }
            }
        });
    }

    getColors() {
        this.api.all('admin').customGET('text-colors').subscribe(res => {
            if (res.result) {
                this.colors_data = res.result;
                const creds = this.form.controls.text_colors.controls.color as FormArray;
                for (const color of this.colors_data) {
                    this.form.get('text_colors').push(
                        new FormGroup({
                            code_nm: new FormControl(color.code_nm, Validators.required),
                            code: new FormControl(color.code, Validators.required)
                        })
                    );
                }
            }
        });
    }

    createSitemap(){
        this.updateSitemap = true;
        this.api.all('sitemap.xml/create').customPOST(this.sitemap).subscribe(res => {
            // if(res.result) {
            //     this.sitemap = res.result;
                this.toast.success('Create sitemap successfully');
            // }
        });
    }
}

