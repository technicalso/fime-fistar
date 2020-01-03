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
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {AdminResourceComponent} from '../resource/resource.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as moment from 'moment';
import {AdminMultipleImagesComponent} from '../multiple-images/multiple-images.component';

@Component({
    selector: 'app-admin-try-event-detail',
    templateUrl: './try-event-details.component.html',
    styleUrls: ['./try-event-details.component.scss']
})
export class AdminTryEventDetailsComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;
    @ViewChild('images') public images: AdminMultipleImagesComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public tryId: any;
    public try: any;
    public brands = [];
    public tryEventTypes = [
        {value: 'review', viewValue: 'Review'},
    ];
    public timeColorCodes: any;
    public tryEventTypeSelected = 'review';
    public invalidMainImage = false;
    public invalidImages = false;
    public isSubmitted = false;
    public output_text_type = '1';

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.tryId = params['id'];
        });
        this.timeColorCodes = [];
        this.try = {
            event_knd_code: 398002,
            short_desc: '',
            description: '',
            resource_type: 1,
            is_try_event: 1
        };

        this.form = new FormGroup({
            name: new FormControl(this.try.cntnts_nm, [Validators.required]),
            time_color_code: new FormControl(this.try.time_color_code, []),
            short_description: new FormControl(this.try.short_description, []),
            description: new FormControl(this.try.good_dc, [Validators.required]),
            is_disabled: new FormControl(this.try.is_disabled, []),
            brand_id: new FormControl(this.try.brnd_code, [Validators.required]),
            category_id: new FormControl(this.try.goods_cl_code, [Validators.required]),
            start_date: new FormControl(this.try.event_bgnde, [Validators.required]),
            end_date: new FormControl(this.try.event_endde, [Validators.required]),
            delivery_start_date: new FormControl(this.try.dlvy_bgnde, [Validators.required]),
            delivery_end_date: new FormControl(this.try.dlvy_endde, [Validators.required]),
            join_max_count: new FormControl(this.try.event_trgter_co, [Validators.required]),
            product_url: new FormControl(this.try.link_url, [Validators.required]),
            model: new FormControl(this.try.modl_nombr, []),
            type: new FormControl(this.try.event_knd_code, []),
            // is_try_event: new FormControl(this.try.is_try_event, []),
            // try_event_start_date: new FormControl(this.try.try_event_start_date, []),
            // try_event_end_date: new FormControl(this.try.try_event_end_date, []),
            quantity_to_qualify: new FormControl(this.try.quantity_to_qualify, [Validators.required]),
            try_event_type: new FormControl(this.try.try_event_type, [Validators.required]),
            price: new FormControl(this.try.goods_pc, []),
            goods_txt: new FormControl(this.try.goods_txt, []),
            output_text_type: new FormControl(this.output_text_type, []),
            sale_price: new FormControl(this.try.event_pc, []),
            resource_type: new FormControl(this.try.resource_type, [])
        });

        if (this.tryId) {
            this.getTry();
        }
        this.getColors();
        this.getBrands();
        this.getCategories();
    }

    getTry() {
        this.api.one('tries', this.tryId).get()
            .subscribe(res => {
                this.try = res.result;
                if (res.result.files.length > 0) {
                    this.try.feature_image = res.result.files[0].stre_file_nm ? res.result.files[0].file_cours + '/' +
                        res.result.files[0].stre_file_nm : res.result.files[0].file_cours;
                } else {
                    this.try.feature_image = null;
                }
                this.try.files.splice(0, 1);
                this.try.event_knd_code = this.try.event_knd_code * 1;

                this.try.event_bgnde = moment.utc(this.try.event_bgnde).toDate();
                this.try.event_endde = moment.utc(this.try.event_endde).toDate();
                this.try.dlvy_bgnde = moment.utc(this.try.dlvy_bgnde).toDate();
                this.try.dlvy_endde = moment.utc(this.try.dlvy_endde).toDate();
                this.output_text_type = this.try.goods_txt ? '2' : '1';
                this.try.is_disabled = this.try.expsr_at !== 'Y';

                // this.try.try_event_type = (this.try.try_event_type != null && this.tryEventTypes.indexOf(this.try.try_event_type) !== -1) ? this.try.try_event_type : this.tryEventTypes[0].value;
                // this.try.try_event_start_date = this.try.try_event_start_date != null ? moment.utc(this.try.try_event_start_date).toDate() : this.try.start_date;
                // this.try.try_event_end_date = this.try.try_event_end_date != null ? moment.utc(this.try.try_event_end_date).toDate() : this.try.end_date;
            });
    }

    getBrands() {
        this.api.all('brands').customGET('').subscribe(res => {
            this.brands = res.result;
        });
    }

    getCategories() {
        this.api.all('categories').customGET('').subscribe(res => {
            this.categories = res.result;
        });
    }

    getColors() {
        this.api.all('admin').customGET('text-colors').subscribe(res => {
            if (res.result) {
                this.timeColorCodes = res.result;
            }
        });
    }

    onSave() {
        this.isSubmitted = true;
        if (!this.images.isValidData()) {
            this.invalidImages = true;
            return;
        } else {
            this.invalidImages = false;
        }
        this.resource.onSave((response) => {
            if (!response.url) {
                this.invalidMainImage = true;
                return;
            }
            this.try.resource_type = response.resource_type;
            this.images.onSave((rs) => {
                this.try.images = rs.images;
                if (this.output_text_type === '1') {
                    this.try.goods_txt = null;
                }
                this.try.images.splice(0, 0, {name: '', url: response.url});
                this.onSaveCallback();
            });
        });
    }

    onSaveCallback() {
        this.try.expsr_at = this.try.is_disabled ? 'N' : 'Y';
        this.try.event_bgnde_format = moment(this.try.event_bgnde).format('YYYY-MM-DD');
        this.try.event_endde_format = moment(this.try.event_endde).format('YYYY-MM-DD');
        this.try.dlvy_bgnde_format = moment(this.try.dlvy_bgnde).format('YYYY-MM-DD');
        this.try.dlvy_endde_format = moment(this.try.dlvy_endde).format('YYYY-MM-DD');

        if (this.tryId) {
            this.api
                .one('tries', this.tryId)
                .customPUT(this.try)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update try successfully');
                        this.router.navigate(['/admin/try/event']);
                    }
                });
        } else {
            this.api
                .all('tries')
                .customPOST(this.try)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add try successfully');
                        this.router.navigate(['/admin/try/event']);
                    }
                });
        }
    }
}
