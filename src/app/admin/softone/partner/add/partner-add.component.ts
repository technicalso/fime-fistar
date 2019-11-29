import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../softone/service/partner/partner.service';
import { ActivatedRoute } from '@angular/router';
import { RequestPartnerService } from '../../service/request/partner/partner.service';
import { CommonService } from '../../service/common.service';

@Component({
    selector: 'app-admin-partner-add',
    templateUrl: './partner-add.component.html',
    styleUrls: [
        './partner-add.component.scss'
    ]
})

export class AdminPartnerAddComponent implements OnInit {
    public env: any;
    public form: any;
    public keywords: any = [];
    public data: any = [];
    public partnerTob: any = [];
    public image;
    public pm_image;
    public pc_image;
    public activeForm: boolean = false;
    public checkKeyword: boolean = false;
    public listError: any = {};
    public partner: any = {
        pm_name: '',
        pm_id: '',
        pm_phone: '',
        email: '',
        pc_name: '',
        pc_phone: '',
        pc_address: '',
        pc_brand: '',
        pc_tob: '',
        pc_introduction: '',
        facebook: '',
        google: '',
        instagram: '',
        keywords: []
    };
    facebook: any = '';
    instagram: any = '';
    youtube: any = '';
    errorSns: any;
    brands:any=[];
    constructor(
        private api: Restangular,
        private router: Router,
        private toast: ToastrService,
        private partnerService: PartnerService,
        private activeRoute: ActivatedRoute,
        private requestPartner: RequestPartnerService,
        private commonService: CommonService,
    ) {
    }

    fileEvent(e) {
        this.pm_image = e.target.files[0];
    }
    fileEventPC(e) {
        this.pc_image = e.target.files[0];
    }
    ngOnInit() {
        this.env = environment;
        this.getPartnerType();
        this.getkeywords();
        this.getBrand();

        this.image = 'http://chieusangmiennam.com/assets/img/default.jpg';
        this.form = new FormGroup({
            pm_name: new FormControl(this.partner.pm_name, [Validators.required]),
            pm_id: new FormControl(this.partner.pm_id, [Validators.required]),
            pm_phone: new FormControl(this.partner.pm_phone, [Validators.required]),
            email: new FormControl(this.partner.email, [Validators.required]),
            pc_name: new FormControl(this.partner.pc_name, [Validators.required]),
            pc_phone: new FormControl(this.partner.pc_phone, [Validators.required]),
            pc_address: new FormControl(this.partner.pc_address, [Validators.required]),
            pc_brand: new FormControl(this.partner.pc_brand, [Validators.required]),
            pc_tob: new FormControl(this.partner.pc_tob, [Validators.required]),
            pc_introduction: new FormControl(this.partner.pc_introduction, [Validators.required]),
            facebook: new FormControl(this.partner.facebook, []),
            google: new FormControl(this.partner.google, []),
            instagram: new FormControl(this.partner.instagram, []),
        });
    }
    getBrand() {
        this.partnerService.getBrand().subscribe(res => {
          console.log(res)
          this.brands = res;
          
        })
        
      }

    checkListValidate() {
        if (
            this.partner.pm_id.length > 50 ||
            this.partner.pm_phone.toString().length > 15 ||
            this.partner.pm_phone.toString().length < 9 ||
            this.partner.pc_phone.toString().length > 15 ||
            this.partner.pc_phone.toString().length < 9 ||
            this.partner.pc_name.length > 255 ||
            this.partner.pc_address.length > 255 ||
            this.partner.pc_brand.length > 255 ||
            this.partner.pc_introduction.length > 255
        ) {
            return false;
        }
        else
            return true;
    }
    getPartnerType() {
        this.partnerService.getTob().subscribe((res: any) => {
            if (res) {
                res.code.map((item) => {
                    this.partnerTob.push({ name: item.cd_label, value: parseInt(item.cd_id) })
                })
            }
        })
    }


    getkeywords() {
        this.requestPartner.getKeywords().subscribe((res: any) => {
            this.keywords = res.code;
        })
    }

    checkBox(evt) {
        let i = this.partner.keywords.indexOf(evt.source.value);

        if (i >= 0) {
            this.partner.keywords.splice(i, 1)
        } else {
            this.partner.keywords.push(evt.source.value)
        }
    }

    checkboxTrue(i) {
        if (this.partner.keywords.indexOf(i) >= 0) {
            return true
        }
        return false
    }

    changeSNS(evt, e) {
        if (evt.target.value && evt.target.value != '') {
            this.partner.channel.push({ sns_id: e, sns_url: evt.target.value })
        }
    }

    addPartner() {
        this.activeForm = true;
        if (this.checkListValidate() == true)
            if (this.form.valid && this.partner.keywords.length > 0) {

                let formData = new FormData()
                formData.append(`channels[0][sns_id]`, '2');
                formData.append(`channels[0][sns_url]`, this.facebook == null || this.facebook == undefined ? '' : this.facebook);
                formData.append(`channels[1][sns_id]`, '3');
                formData.append(`channels[1][sns_url]`, this.youtube == null || this.youtube == undefined ? '' : this.youtube);
                formData.append(`channels[2][sns_id]`, '4');
                formData.append(`channels[2][sns_url]`, this.instagram == null || this.instagram == undefined ? '' : this.instagram);
                formData.append('pc_state', '2');
                if (this.pm_image)
                    formData.append('p_image', this.pm_image)
                if (this.pc_image)
                    formData.append('pc_image', this.pc_image)
                for (const key in this.partner) {
                    if (key !== 'channels' && key != 'keyword') {
                        if (Array.isArray(this.partner[key])) {
                            for (let i = 0; i < this.partner[key].length; i++) {
                                formData.append(`${key}[]`, this.partner[key][i]);
                            }
                        } else {
                            formData.append(key, this.partner[key])
                        }
                    }
                    if (key == 'keyword') {
                        for (let i = 0; i < this.partner[key].length; i++) {
                            formData.append('keywords[]', this.partner[key][i])
                        }
                    }

                }
                this.partnerService.addPartner(formData).subscribe((res: any) => {
                    this.toast.success('Create new partner successfull');
                    this.router.navigate(['/admin/partner']);
                }, (err) => {
                    this.listError = err.error;
                    if (this.listError.errors.p_image) {
                        for (let p_image of this.listError.errors.p_image) {
                            this.toast.error(p_image);
                            break;
                        }
                    }

                    if (this.listError.errors.pc_image) {
                        for (let pc_image of this.listError.errors.pc_image) {
                            this.toast.error(pc_image);
                            break;
                        }
                    }

                    if (this.listError.errors.email) {
                        for (let email of this.listError.errors.email) {
                            this.toast.error(email);
                        }
                    }
                });
            }

    }
}