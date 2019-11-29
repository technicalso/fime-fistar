import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { SoftoneResourceComponent } from './../resource/resource.component';
import * as moment from 'moment';
import { BannerService } from '../service/banner/banner.service';
import { CommonService } from "../service/common.service";


@Component({
    selector: 'app-admin-banner-fistar',
    templateUrl: './banner-fistar-details.component.html',
    styleUrls: ['./banner-fistar-details.component.scss']
})
export class AdminBannerFistarDetailsComponent implements OnInit {
    @ViewChild('resource') public resource: SoftoneResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public bannerId: any;
    public formData = new FormData();
    public banner: any = {};
    public required_upload_file_url: boolean;
    public imageChangedEvent: any;
    public imageBase64: any;
    public notification: any;
    public myFile: Number = 1;
    public filedata: any;
    public image: any;
    public active: boolean = true;
    public reg: string = 'https?://.+';
    public error: any;
    public listOfOptions: any = [
        { name: "Image Attachment", value: 1, checked: true },
        { name: "Youtube Url", value: 2, checked: false },
        { name: "Video Attachment", value: 3, checked: false }
    ]

    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private bannerService: BannerService,
        private commonService: CommonService
    ) {

    }

    ngOnInit() {
        console.log(this.banner, this.resource, 'INIT BANNER')
        this.env = environment;
        this.activeRoute.params.forEach((params: Params) => {
            this.bannerId = params['id'];
        });

        this.required_upload_file_url = false;

        this.form = new FormGroup({
            sb_name: new FormControl(this.banner.sb_name, [Validators.required]),
            // main_description: new FormControl(this.banner.main_description, [Validators.required, Validators.maxLength(100)]),
            // sub_description: new FormControl(this.banner.sub_description, [Validators.required, Validators.maxLength(200)]),
            main_description: new FormControl(this.banner.main_description, []),
            sub_description: new FormControl(this.banner.sub_description, []),
            image_url: new FormControl(this.banner.image_url, [Validators.pattern(this.reg)]),
            image_url_target: new FormControl(this.banner.image_url_target, []),

            button_one: new FormControl(this.banner.button_one, [Validators.maxLength(255)]),
            link_button_one: new FormControl(this.banner.link_button_one, []),
            target_button_one: new FormControl(this.banner.taget_button_one, []),

            button_two: new FormControl(this.banner.button_two, [Validators.maxLength(255)]),
            link_button_two: new FormControl(this.banner.link_button_two, []),
            target_button_two: new FormControl(this.banner.taget_button_two, []),

            sb_period_start: new FormControl(this.banner.sb_period_start, [Validators.required]),
            sb_period_end: new FormControl(this.banner.sb_period_end, [Validators.required]),

        });

        if (this.bannerId) {
            this.getBanner();
        }
    }

    fileEvent(e) {
        this.filedata = e.target.files[0];
        console.log(this.filedata);
    }
    getBanner() {
        this.bannerService.getBanner(this.bannerId).subscribe((res: any) => {
            console.log(res, "BANNER DETAIL")
            this.banner = res
            this.image = this.commonService.getImageLink(this.banner.sb_cover, 'banners', 'original')
            this.banner.sb_period_start = moment(this.banner.sb_period_start).toDate()
            this.banner.sb_period_end = moment(this.banner.sb_period_end).toDate()
        });
    }

    

    save() {
        console.log(this.form)
        console.log(this.resource)
        if (this.form.valid && this.resource.isChanged) {
            console.log(this.form.value)
            let bannerData = Object.assign({}, this.form.value);
            bannerData.sb_period_start = moment(bannerData.sb_period_start).format('YYYY-MM-DD HH:mm:ss');
            bannerData.sb_period_end = moment(bannerData.sb_period_end).format('YYYY-MM-DD HH:mm:ss');
            if (this.resource.isChanged) {
                if (this.myFile == 1 || this.myFile == 3) {
                    console.log(this.resource.imageChangedEvent)
                    this.formData.append('sb_cover', this.resource.imageChangedEvent.target.files[0]);
                    this.formData.append('sb_cover_type', this.myFile.toString());
                }
                else {
                    this.formData.append('sb_cover', bannerData.youtube);
                    this.formData.append('sb_cover_type', this.myFile.toString());
                }
            }

            for (const key in bannerData) {

                if (Array.isArray(bannerData[key])) {
                    for (let i = 0; i < bannerData[key].length; i++) {
                        console.log(this.form.value[key][i])
                        this.formData.append(`${key}[]`, (this.form.value[key][i] == undefined || this.form.value[key][i] == null) ? '' : this.form.value[key][i]);
                    }
                } else {
                    this.formData.append(key, (bannerData[key] == undefined || bannerData[key] == null)? '' : bannerData[key])
                }

            }

            this.bannerService.addBanner(this.formData).subscribe((res: any) => {
                if (res) {
                    this.toast.success('Create new banner successfull');
                    this.router.navigate(['/admin/banner-fistar']);
                }
            },(err)=>{
                this.error = err;
                console.log(this.error);
                this.toast.error(this.error.error.message);
            });
        }
        else
            this.active = false;

    }

    update() {
        // console.log(this.bannerId);
        // let myFormData = new FormData();
        // myFormData.append('_method', 'PUT');
        // if(this.myFile==1 || this.myFile==3)
        //     myFormData.append('sb_cover', this.filedata);
        // else
        //     myFormData.append('sb_cover', this.banner.youtube);
        // myFormData.append('sb_name', this.banner.sb_name);
        // myFormData.append('radio_image', this.banner.radio_image);
        // myFormData.append('button_text1', this.banner.button_text1);
        // myFormData.append('button_link1', this.banner.button_link1);
        // myFormData.append('button_text2', this.banner.button_text2);
        // myFormData.append('button_link2', this.banner.button_link2);
        // myFormData.append('period_from', this.banner.period_from);
        // myFormData.append('period_to', this.banner.period_to);
        // myFormData.append('main_description', this.banner.main_description);
        // myFormData.append('sub_description', this.banner.sub_description);
        //
        // this.bannerService.updateBanner(myFormData,this.bannerId).subscribe(res =>
        //     {
        //         console.log(res);
        //         if(res==1){
        //             this.toast.success('Update banner successfully');
        //             this.router.navigate(['/admin/banner-fistar']);
        //         }
        //     }
        // );
        if (this.form.valid ) {
            let bannerData = Object.assign({}, this.form.value);
            bannerData.sb_period_start = moment(bannerData.sb_period_start).format('YYYY-MM-DD HH:mm:ss');
            bannerData.sb_period_end = moment(bannerData.sb_period_end).format('YYYY-MM-DD HH:mm:ss');

            if (this.resource.isChanged) {
                if (this.myFile == 1 || this.myFile == 3) {
                    this.formData.append('sb_cover', this.resource.imageChangedEvent.target.files[0]);
                    this.formData.append('sb_cover_type', this.myFile.toString());
                }
                else {
                    this.formData.append('sb_cover', bannerData.youtube);
                    this.formData.append('sb_cover_type', this.myFile.toString());
                }
            }

            for (const key in bannerData) {
                if (Array.isArray(bannerData[key])) {
                    for (let i = 0; i < bannerData[key].length; i++) {
                        this.formData.append(`${key}[]`, (this.form.value[key][i] == undefined || this.form.value[key][i] == null)?'': this.form.value[key][i]);
                    }
                } else {
                    this.formData.append(key, (bannerData[key] == undefined || bannerData[key] == null)? '':bannerData[key])
                }
            }

            this.formData.append('_method', 'PUT');

            this.bannerService.updateBanner(this.formData, this.bannerId).subscribe((res: any) => {
                if (res) {
                    this.toast.success('Update banner successfull');
                    this.router.navigate(['/admin/banner-fistar']);
                }
            },(err)=>{
                this.error = err;
                console.log(this.error);
                this.toast.error(this.error.error.message);
            });
        }
        else
            this.active = false;
    }

    selectFile(e) {
        this.myFile = e.value;
        // this.banner.radio_image = value ;
        console.log(this.banner);
    }
}
