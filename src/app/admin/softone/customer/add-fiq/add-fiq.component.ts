import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../../environments/environment';
import { AdminResourceComponent } from '../../../resource/resource.component';
import * as moment from 'moment';
import { BannerService } from '../../service/banner/banner.service';
import { FqiService } from '../../service/customer/fqi.service';

@Component({
    selector: 'app-admin-customer-add',
    templateUrl: './add-fiq.component.html',
    styleUrls: ['./add-fiq.component.scss']
})
export class AdminCustomerAddFQIComponent implements OnInit {
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
    public action: string = 'add';

    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private bannerService: BannerService,
        private fqiService: FqiService
    ) { }

    ngOnInit() {
        this.env = environment;
        this.form = new FormGroup({
            title: new FormControl('', [Validators.required]),
            radio: new FormControl('', [Validators.required]),
            content: new FormControl('', [Validators.required]),
        });
        this.activeRoute.params.forEach((params: Params) => {
            this.bannerId = params['id'];
            if (params['id']) {
                this.action = 'edit';
                this.fqiService.getOneFQI(this.bannerId).subscribe(res => {
                    this.form.controls['title'].setValue(res['faq_title']);
                    this.form.controls['radio'].setValue(res['faq_type']);
                    this.form.controls['content'].setValue(res['faq_content']);

                }, err => {
                    console.log(err);
                });
            }
        });

        this.required_upload_file_url = false;

        this.banner = {
            is_youtube: false
        };

        // if (this.bannerId) {
        //     this.getBanner();
        // }
    }

    // getBanner() {
    //     this.api
    //         .one('banners', this.bannerId)
    //         .get()
    //         .subscribe(res => {
    //             this.banner = res.result;
    //             console.log(this.banner)
    //             this.banner.period_from = moment.utc(this.banner.period_from).toDate();
    //             this.banner.period_to = moment.utc(this.banner.period_to).toDate();
    //         });
    // }


    save() {
        if (this.action === 'add') {
            if (this.form.valid) {
                let item = {
                    faq_state: 1,
                    faq_content: this.form.value.content,
                    faq_title: this.form.value.title,
                    faq_type: this.form.value.radio,
                }
                this.fqiService.addFQI(item).subscribe(res => {
                    this.toast.success('Add FAQ success');
                    this.redirectToPageList();
                }, err => {
                    this.showErrors(err);
                });

            }
        } else {
            let item = {
                faq_state: 0,
                faq_content: this.form.value.content,
                faq_title: this.form.value.title,
                faq_type: this.form.value.radio,
            }
            this.fqiService.updateFQI(item, this.bannerId).subscribe(res => {
                this.toast.success('Edit FAQ success');
                this.redirectToPageList();
            }, err => {
                this.showErrors(err);
            });
        }
    }

    redirectToPageList() {
        this.router.navigate([`/admin/customer/faq`]);
    }

    showErrors(data) {
        let message = '';
        if (data.error.errors) {
            if (data.error.errors.faq_title) {
                message = data.error.errors.faq_title['0'];
            }
            else if (data.error.errors.faq_content) {
                message = data.error.errors.faq_content['0'];
            }
        }
        message = message == '' ? 'Errors' : message;
        this.toast.error(message);
    }

}
