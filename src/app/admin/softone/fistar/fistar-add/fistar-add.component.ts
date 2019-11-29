import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestFistarService } from '../../service/request/fistar/fistar.service';
import { FistarService } from '../../service/fistar/fistar.service';
import { CommonService } from '../../service/common.service';



@Component({
    selector: 'app-admin-fistar-add',
    templateUrl: './fistar-add.component.html',
    styleUrls: [
        './fistar-add.component.scss'
    ]
})
export class AdminFistarAddComponent implements OnInit {
    public env: any = environment;
    public genderList: any = [];
    public locationList: any = [];
    public gender: any = [];
    public keywords: any = [];
    public location: any = [];
    public image: any;
    public error: any={};
    public activeForm: boolean=false;
    public fistar: any = {
        fullname: '',
        id: '',
        phone: '',
        email: '',
        active: false,
        allow_comment: false,
        allow_review: false,
        fimer: false,
        fistar: false,
        address: '',
        image: '',
        dob: '',
        location: '',
        gender: '',
        bank_name: '',
        bank_branch: '',
        bank_account_name: '',
        bank_account_number: '',
        bank_swift_code: '',
        self_intro: '',
        keyword: [],
        channels: []
    };
    public chkArr: any = [];
    public channels: any = [];
    public form: any = {};
    public channelForm: any = {};
    public filedata: any = {};
    public errorSns = {};
    public keywordIsChange: boolean=false;
    constructor(
        private api: Restangular,
        private router: Router,
        private toast: ToastrService,
        private requestFistar: RequestFistarService,
        private activeRoute: ActivatedRoute,
        private fistarService: FistarService,
        private commonService: CommonService,
    ) {
    }


    ngOnInit() {
        console.log(this.commonService.validUrl('https://www.facebook.com/', 'facebook'));
        console.log(this.filedata,'file');
        this.getGender();
        this.getkeywords();
        this.getChannel();
        this.getLocation();
        this.image = 'http://chieusangmiennam.com/assets/img/default.jpg';

        console.log(this.fistar, "INIT FISTAR")
        this.form = new FormGroup({
            fullname: new FormControl(this.fistar.fullname, [Validators.required]),
            password: new FormControl(this.fistar.password, [Validators.required]),
            id: new FormControl(this.fistar.id, [Validators.required]),
            email: new FormControl(this.fistar.email, [ Validators.email]),
            phone: new FormControl(this.fistar.phone, [Validators.required]),
            active: new FormControl(this.fistar.active, []),
            allow_comment: new FormControl(this.fistar.allow_comment, []),
            allow_review: new FormControl(this.fistar.allow_review, []),
            fimer: new FormControl(this.fistar.allow_fimer, []),
            fistar: new FormControl(this.fistar.allow_fistar, []),
            address: new FormControl(this.fistar.address, [Validators.required]),
            dob: new FormControl(this.fistar.dob, [Validators.required]),
            gender: new FormControl(this.fistar.gender, [Validators.required]),
            location: new FormControl(this.fistar.location, [Validators.required]),

            bank_name: new FormControl(this.fistar.bank_name, []),
            bank_branch: new FormControl(this.fistar.bank_branch, []),
            bank_account_name: new FormControl(this.fistar.bank_account_name, []),
            bank_account_number: new FormControl(this.fistar.bank_account_number, []),
            bank_swift_code: new FormControl(this.fistar.bank_swift_code, []),
            self_intro: new FormControl(this.fistar.self_intro, [Validators.required]),
        });

        console.log(this.form)
    }

    getGender() {
        this.commonService.getGender().subscribe((res: any) => {
            this.gender = res.code;
            console.log(this.gender, "GENDER");
        });
    }
    getkeywords() {
        this.requestFistar.getKeywords().subscribe((res: any) => {
            this.keywords = res.code;
            console.log(this.keywords, "KEYWORD")
        })
    }
    getLocation() {
        this.requestFistar.getLocation().subscribe((res: any) => {
            this.location = res.code;
            console.log(this.location, "LOCATION")
        })
    }
    checkBox(evt) {
        this.keywordIsChange = true;
        console.log(evt.source.value, "CHECKBOX")
        let i = this.fistar.keyword.indexOf(evt.source.value);
        if (i >= 0) {
            this.fistar.keyword.splice(i, 1)
        } else {
            this.fistar.keyword.push(evt.source.value)
        }
        console.log(this.fistar, "FISTAR")
    }

    getChannel() {
        this.commonService.getChannel({sns_state: 1}).subscribe((res: any) => {
            this.channels = res.data;
        });
        console.log(this.channels)
    }

    checkDob(){
        return new Date(this.fistar.dob) > new Date()
    }

    addFistar() {
        this.keywordIsChange = true;
        console.log(this.filedata);
        console.log(this.form);
        console.log(this.fistar);
        this.activeForm = true;
        let allow = 0
        console.log(this.errorSns, this.errorSns[2])
        if(this.errorSns[2] == undefined) this.errorSns[2] = 'required'
        console.log(this.errorSns, this.errorSns[2])
        Object.keys(this.errorSns).map(item=>{
            if(this.errorSns[item]) allow++;
        })
        this.fistar.channels.forEach(item=>{
            if(item.sns_url && !item.sns_cost) {this.errorSns[item.sns_id] = 'costInvalid'; allow++}
            if(!item.sns_url && item.sns_cost) {this.errorSns[item.sns_id] = 'invalid'; allow++}
        })
        if(allow > 0){
            this.toast.error("SNS invalid");
        }
        if (this.form.valid && allow == 0 && !this.checkDob() && this.fistar.keyword.length>0) {
            let formData = new FormData()
            formData.append('picture', this.filedata);
            formData.append('state', '2');
            formData.append('active', '1');
            for (const key in this.fistar) {
                if (key !== 'channels' && key != 'keyword') {
                    if (Array.isArray(this.fistar[key])) {
                        for (let i = 0; i < this.fistar[key].length; i++) {
                            formData.append(`${key}[]`, (this.fistar[key][i] == undefined || this.fistar[key][i] == null)? '': this.fistar[key][i]);
                        }
                    } else {
                        formData.append(key, (this.fistar[key] == undefined || this.fistar[key] == null)? '': this.fistar[key])
                    }
                }
                if (key == 'keyword') {
                    for (let i = 0; i < this.fistar[key].length; i++) {
                        formData.append('keywords[]', (this.fistar[key][i] == undefined || this.fistar[key][i] == null)? '': this.fistar[key][i])
                    }
                }
                if (key == 'channels') {
                    for (let i = 0; i < this.fistar[key].length; i++) {
                        for (const k in this.fistar[key][i]) {
                            formData.append('channels[' + i + '][' + k + ']',(this.fistar[key][i][k] == undefined || this.fistar[key][i][k] == null)? '': this.fistar[key][i][k])
                        }
                    }
                }

            }
            this.fistarService.addFistar(formData).subscribe((res: any) => {
                this.toast.success('Create new fistar successfull');
                this.router.navigate(['/admin/fistar']);
                // if(res.result){
                //     this.toast.success('Create new fistar successfull');
                //     this.router.navigate(['/admin/fistar']);
                // }
            },(err)=>{
                this.error = err;
                console.log(this.error);
                // this.toast.error(this.error.error.message);
            });
        }

    }
    changeSNS(evt, e) {
        console.log(evt, e);
        if(e == 2){
            if(!evt.target.value || evt.target.value == '') {
                this.errorSns[e] = 'required'
            }else{
                console.log(this.commonService.validUrl(evt.target.value, 'facebook'));
                if(!this.commonService.validUrl(evt.target.value, 'facebook')) {this.errorSns[e] = 'invalid'; (document.getElementById('sns_cost'+e) as HTMLInputElement).value = ''}
                else{
                    this.errorSns[e] = false;
                    this.fistar.channels.push({ sns_id: e, sns_url: evt.target.value })
                    console.log(this.fistar, "FISTAR changeSNS")
                }
            }
            
        }else{
            if(evt.target.value && evt.target.value != ''){
                if(!this.commonService.validUrl(evt.target.value, e.toString())) {this.errorSns[e] = 'invalid'; (document.getElementById('sns_cost'+e) as HTMLInputElement).value = ''}
                else{
                    this.errorSns[e] = false;
                    this.fistar.channels.push({ sns_id: e, sns_url: evt.target.value })
                    console.log(this.fistar, "FISTAR changeSNS")
                }
            }else{
                this.errorSns[e] = false;
            }
        }
        
    }

    changeCostSNS(evt, e) {
        console.log(evt, e);
        let arr = [];
        this.fistar.channels.map((element,key) => {
          arr.push(element.sns_id)
            if(element.sns_id == e){
                if(!this.errorSns[e] || this.errorSns[e] == 'costInvalid'){
                    if(evt.target.value && /[0-9]/.test(evt.target.value.toString())) {this.fistar.channels[key].sns_cost = evt.target.value; this.errorSns[e] = false}
                    else this.errorSns[e] = 'costInvalid'
                }
              
            }   
        })
        if(arr.indexOf(e)<0) this.errorSns[e] = 'invalid' 
    }

    checkboxTrue(i) {
        if (this.fistar.keyword.indexOf(i) >= 0) {
            return true
        }
        return false
    }

    checkContainLetter(str) {
        //console.log(str, 'CHECK CONTAIN')
        if (str.value) {
            console.log(str.value.toString().match(/[A-Za-z]/))
            return !str.value.toString().match(/[A-Za-z]/)
        }
        return true

    }

    fileEvent(e) {
        this.filedata = e.target.files[0];
        console.log(this.filedata)
    }

}
