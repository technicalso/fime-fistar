import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../softone/service/partner/partner.service';
import { ActivatedRoute } from '@angular/router';
import { RequestPartnerService } from '../../service/request/partner/partner.service';
import { CommonService } from '../../service/common.service';
import { SnsService } from '../../service/system/sns.service';
@Component({
    selector: 'app-admin-partner-info',
    templateUrl: './information.component.html',
    styleUrls: [
        './information.component.scss'
    ]
})
export class AdminFartnerInformationComponent implements OnInit {

    public env: any;
    public id: string;
    public partner: any = [];
    public form: any;
    public keywords: any = [];
    public cdId: any = [];
    public data: any = [];
    filedata: any = '';
    facebook: any = '';
    instagram: any = '';
    youtube: any = '';
    brands: any = [];
    public activeForm: boolean = false;
    public partnerTob: any = [];
    public changeKeyword: boolean = false;
    public errorSns = {
        2: false,
        3: false,
        4: false
    };
    constructor(
        private api: Restangular,
        private router: Router,
        private toast: ToastrService,
        private partnerService: PartnerService,
        private activeRoute: ActivatedRoute,
        private requestPartner: RequestPartnerService,
        public commonService: CommonService,
        private snsService: SnsService,
    ) {
    }

    fileEvent(e) {
        this.filedata = e.target.files[0];
        console.log(this.filedata);
    }
    ngOnInit() {
        this.env = environment;
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.form = new FormGroup({
            pc_name: new FormControl(this.partner.pc_name, [Validators.required]),
            pc_phone: new FormControl(this.partner.pc_phone, [Validators.required]),
            pc_address: new FormControl(this.partner.pc_address, [Validators.required]),
            // pc_brand: new FormControl(this.partner.pc_brand, [Validators.required]),
            pc_brand: new FormControl(this.partner.pc_brand, []),
            pc_tob: new FormControl(this.partner.pc_tob, []),
            pc_introduction: new FormControl(this.partner.pc_introduction, [Validators.required]),
            facebook: new FormControl(this.partner.facebook, []),
            google: new FormControl(this.partner.google, []),
            instagram: new FormControl(this.partner.instagram, []),
            image: new FormControl('', [])
        });
        this.getPartnerType();
        this.getPartner();
        this.getkeywords();
        this.getDetail();
        this.getBrand();
    }

    getBrand() {
        this.partnerService.getBrand().subscribe(res => {
          console.log(res)
          this.brands = res;
          
        })
        
      }

    getPartnerType() {
        this.partnerService.getTob().subscribe((res: any) => {
            console.log(res, 'RES')
            if (res) {
                res.code.map((item) => {
                    this.partnerTob.push({ name: item.cd_label, value: parseInt(item.cd_id) })
                })
            }
        })
    }

    getPartner() {
        this.partnerService.getPartner(this.id).subscribe((res: any) => {
            this.partner = res;
            if (this.partner.channel.length > 0) {
                this.partner.channel.map((item, i) => {
                    switch (item.sns_id) {
                        case 2:
                            this.facebook = item.url;
                            break;
                        case 3:
                            this.youtube = item.url;
                            break;
                        case 4:
                            this.instagram = item.url;
                            break;
                    }
                })
            }
            console.log(this.facebook, 'facebook');
            console.log(this.youtube, 'youtube');
            console.log(this.instagram, 'instagram');
        })
    }

    getkeywords() {
        this.requestPartner.getKeywords().subscribe((res: any) => {
            console.log(res);
            this.keywords = res.code;
        })
    }

    getDetail() {
        this.requestPartner.getDetail(this.id).subscribe((res: any) => {
            for (const item of res.keywords) {
                this.cdId.push(item.cd_id);
            }
            this.data = res;
            console.log(this.cdId);

        });
    }

    onSelect(keyword) {
        this.cdId.push(keyword);
        console.log(this.cdId);
        this.changeKeyword = true;
    }

    unSelect(keyword) {
        for (var i = 0; i < this.cdId.length; i++) {
            if (this.cdId[i] === keyword) {
                this.cdId.splice(i, 1);
            }
        }
        console.log(this.cdId);
        this.changeKeyword = true
    }

    updateBasicPartner() {
        let allow = 0;
        Object.keys(this.errorSns).forEach(i => {
            if (this.errorSns[i] === false) this.errorSns[i] = 'required'
        })

        this.activeForm = true;

        if (this.checkListValidate() == true && allow == 0)
            if (this.form.valid && this.cdId.length > 0) {
                // let channels: any = this.partner.channel.filter(item => {
                //     return item.sns_id != 1;
                // });
                // console.log(channels, 'fsdf');
                console.log(this.filedata, 'fsdf');
                var myFormData = new FormData();
                // if(this.filedata || this.filedata !== '' || this.filedata !== null || this.filedata != undefined);
                if (this.filedata && this.filedata != undefined && this.filedata !== '') myFormData.append('pc_image', this.filedata);
                // channels.forEach(function (item, index) {
                // console.log('dd', item);
                // })
                myFormData.append(`channels[0][sns_id]`, '2');
                myFormData.append(`channels[0][url]`, this.facebook == null || this.facebook == undefined ? '' : this.facebook);
                myFormData.append(`channels[1][sns_id]`, '3');
                myFormData.append(`channels[1][url]`, this.youtube == null || this.youtube == undefined ? '' : this.youtube);
                myFormData.append(`channels[2][sns_id]`, '4');
                myFormData.append(`channels[2][url]`, this.instagram == null || this.instagram == undefined ? '' : this.instagram);
                myFormData.append('type', 'company_infomation');
                myFormData.append('pc_name', this.partner.pc_name);
                myFormData.append('pc_tob', this.partner.pc_tob);
                myFormData.append('pc_address', this.partner.pc_address);
                myFormData.append('pc_brand', this.partner.pc_brand);
                myFormData.append('pc_introduction', this.partner.pc_introduction);
                this.cdId.forEach((item) => {
                    myFormData.append('keywords[]', item);
                })


                // let data: any = {};
                // data = {
                //     gender:10,
                //     type:'company_infomation',
                //     pc_name:this.partner.pc_name,
                //     pc_address:this.partner.pc_address,
                //     pc_brand:this.partner.pc_brand,
                //     pc_introduction:this.partner.pc_introduction,
                //     channels:channels,
                //     keywords: this.cdId,

                // };console.log('test',data);
                this.partnerService.updatePartner(this.id, myFormData).subscribe((res: any) => {
                    console.log(res);
                    this.toast.success('update success');
                    this.router.navigate(['/admin/partner']);
                }, (err) => {
                    var result = Object.keys(err.error.errors).map(function (key) {
                        return [Number(key), err.error.errors[key]];
                    });
                    console.log(result);
                    result.forEach(element => {
                        this.toast.error(element[1][0]);
                    });
                    // err.error.errors.forEach(element => {
                    //     element.bank_swift_code;
                    // });
                }
                );
            }

    }

    changeSNS(evt, e) {
        console.log(evt, e);

        if (evt.target.value && evt.target.value != '') {
            if (!this.commonService.validUrl(evt.target.value, e.toString())) { this.errorSns[e] = 'invalid'; (document.getElementById('sns_cost' + e) as HTMLInputElement).value = '' }
            else {
                this.errorSns[e] = false;
                this.partner.channel.push({ sns_id: e, sns_url: evt.target.value })
                console.log(this.partner, "FISTAR changeSNS")
            }
        } else {
            this.errorSns[e] = 'required';
        }
    }

    checkListValidate() {
        if (
            this.partner.pc_name.length > 191 ||
            this.partner.pc_phone.toString().length > 15 ||
            this.partner.pc_phone.toString().length < 9 ||
            this.partner.pc_address.length > 191 ||
            this.partner.pc_introduction.length > 191
        ) {
            return false;
        }
        else
            return true;
    }

}
