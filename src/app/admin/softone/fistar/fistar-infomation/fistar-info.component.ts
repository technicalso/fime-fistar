import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { RequestFistarService } from '../../service/request/fistar/fistar.service';
import {FistarService} from '../../service/fistar/fistar.service';
import {CommonService} from '../../service/common.service';



@Component({
    selector: 'app-admin-fistar-info',
    templateUrl: './fistar-info.component.html',
    styleUrls: [
        './fistar-info.component.scss'
    ]
})
export class AdminFistarInformationComponent implements OnInit {
    public env: any = environment;
    public genderList: any = [];
    public locationList: any = [];
    public fistar: any = {
        gender: {},
        location: {}
    };
    public form: any;
    public keywords:any = [];
    public types:any = [];
    public id: string;
    public data: any = [];
    public cdId: any = [];
    public typeId: any = [];
    public image: any ;
    filedata:any;
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
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.form = new FormGroup({
            uid: new FormControl(this.fistar.uid, [Validators.required]),
            dob: new FormControl(this.fistar.dob, [Validators.required]),
            location: new FormControl(this.fistar.location, [Validators.required]),
            self_intro: new FormControl(this.fistar.self_intro, [ Validators.required,]),
            
            gender: new FormControl(this.fistar.gender, [Validators.required]),
            bank_account_number: new FormControl(this.fistar.bank_account_number, []),
            bank_branch: new FormControl(this.fistar.bank_branch, []),
            bank_swift_code: new FormControl(this.fistar.bank_swift_code, []),
            bank_account_name: new FormControl(this.fistar.name, []),
            bank_name: new FormControl(this.fistar.bank_name, []),
          });
          this.getfistar();
          this.getkeywords();
          this.getDetail();
          this.getTypes();
          this.commonService.getGender().subscribe((data: any) => {
            this.genderList = data.code;
          });
          this.commonService.getLocation().subscribe((data: any) => {
            this.locationList = data.code;
          });
    }


    checkContainLetter(str){
        //console.log(str, 'CHECK CONTAIN')
        if(str.value){
            console.log(str.value.toString().match(/[A-Za-z]/))
            return !str.value.toString().match(/[A-Za-z]/)
        }
        return true
         
    }

    getfistar(){
        this.fistarService.getFistar(this.id).subscribe((res:any) => {
            this.fistar = res;
            console.log(this.fistar,'fistar');
        });
    }
    getkeywords(){
        this.requestFistar.getKeywords().subscribe((res:any) => {
            //console.log(res);
            this.keywords = res.code;
        })
    }

    getTypes(){
        this.requestFistar.getTypes().subscribe((res:any) => {
            console.log(res.data,'types');
            this.types = res.data;
        })
    }

    getDetail(){
        this.requestFistar.getDetail(this.id).subscribe((res:any) => {
            for (const item of res.keywords) {
                this.cdId.push(item.cd_id);
            }
            for (const item of res.code_types) {
                this.typeId.push(item.cd_id);
            }
            console.log(this.typeId,'type');
            this.data = res;
            this.image = this.commonService.getImageLink(this.data.picture,'fistars','original');
            //console.log(this.image,'image');
            //console.log(this.cdId,'fsdf');
            //console.log(this.keywords);
        });
    }
    updateBasicFistar(){
        //console.log(this.fistar);
        // //console.log(this.fistar);
        let data: any = {};
        data = {
            
            gender:this.fistar.gender.cd_id,
            type:'fistar_infomation',
            uid:this.fistar.uid,
            dob:this.fistar.dob,
            location:this.fistar.location.cd_id,
            self_intro:this.fistar.self_intro,
            bank_account_name:this.fistar.bank_account_name,
            bank_account_number:this.fistar.bank_account_number,
            bank_name:this.fistar.bank_name,
            bank_branch:this.fistar.bank_branch,
            bank_swift_code:this.fistar.bank_swift_code,
            keywords: this.cdId,
            types:this.typeId,

        };
        
        var myFormData = new FormData();
        if(this.filedata != undefined)
            myFormData.append('picture', this.filedata);

        myFormData.append('gender', data.gender);
        myFormData.append('type', data.type);
        myFormData.append('uid', data.uid);
        myFormData.append('dob', data.dob);
        myFormData.append('location', data.location);
        myFormData.append('self_intro', data.self_intro);
        myFormData.append('bank_account_name', data.bank_account_name);
        myFormData.append('bank_account_number', data.bank_account_number);
        myFormData.append('bank_name', data.bank_name);
        myFormData.append('bank_branch', data.bank_branch);
        myFormData.append('bank_swift_code', data.bank_swift_code);
        for(let i=0 ; i< data.keywords.length; i++){
            myFormData.append('keywords[]', data.keywords[i]);
        }
        for(let i=0 ; i< data.types.length; i++){
            myFormData.append('fistar_type[]', data.types[i]);
        }
       
        //console.log(data);
        this.fistarService.updateInfoFistar(myFormData, data.uid).subscribe((res:any) => {
            //console.log(res);
            this.toast.success('update information fistar success');
            this.router.navigate(['/admin/fistar']);
        },(err)=>{
            var result = Object.keys(err.error.errors).map(function(key) {
                return [Number(key), err.error.errors[key]];
              });
            //console.log(result);
            result.forEach(element => {
                this.toast.error(element[1][0]);
            });
            // err.error.errors.forEach(element => {
            //     element.bank_swift_code;
            // });
            }
        );
    }

    fileEvent(e){
        this.filedata = e.target.files[0];
        //console.log(this.filedata);
    }
    onSelect(keyword) {
        this.cdId.push(keyword);
        //console.log(this.cdId);
    }
    onSelectType(type) {
        this.typeId.push(type);
       
        console.log(this.typeId);
        //console.log(this.cdId);
    }
    unSelect(keyword) {
        for( var i = 0; i < this.cdId.length; i++){ 
            if ( this.cdId[i] === keyword) {
                this.cdId.splice(i, 1); 
            }
         }  
         //console.log(this.cdId);
    }
    unSelectType(type) {
        for( var i = 0; i < this.typeId.length; i++){ 
            if ( this.typeId[i] === type) {
                this.typeId.splice(i, 1); 
            }
         }  
         //console.log(this.cdId);
    }
    // onUnSelect(keyword) {
    //     //console.log(keyword, 123)
    //     let keywords = this.fistar.keyword || []
    //     this.fistar.keyword = keywords.map(e => e === keyword ? null : e).filter(e => e !== null)
    // }


    
}
