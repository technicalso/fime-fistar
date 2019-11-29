import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BannerService } from '../../../service/banner/banner.service';
import { CommonService } from '../../../../../admin/softone/service/common.service';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isBuffer } from 'util';
@Component({
    selector: 'admin-campaign-fistar-search',
    templateUrl: './search-fistar.component.html',
    styleUrls: [
        './search-fistar.component.scss'
    ]
})
export class AdminCampaignSearchFistarComponent implements OnInit {

    @Output('update')
    change: EventEmitter<any> = new EventEmitter<any>();


    modalRef: BsModalRef;
    public types: any;
    public data: any=[];
    public filter: any={};
    public filterData: any={};
    public ages: any;
    public genders: any;
    public locations: any;
    public followers : any;
    public posts : any;
    public channels: any;
    public keywords: any;
    public showFilter: boolean=true;
    public fistars:any = [];
    public searchKey:any = '';
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private bannerService: BannerService,
        private commonService: CommonService,
        private modalService: BsModalService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.getType();
        this.getAge();
        this.getGender();
        this.getLocation();
        this.getFollower();
        this.getChannel();
        this.getKeyword();
        this.getPost();
        // this.getListFistar();
    }

    getType() {
        this.commonService.getCode('fistar_type').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.fistar_type = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.fistar_type = {all: false}
        })
    }

    getGender() {
        this.commonService.getCode('GENDER').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.gender = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.gender = {all: false}
        })
    }

    getAge() {
        this.commonService.getCode('AGE_RANGE').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.age_range = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.age_range = {all: false}
        })
    }

    getPost() {
        this.commonService.getCode('POST_RANGE').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.post_range = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.post_range = {all: false}
        })
    }

    getLocation() {
        this.commonService.getCode('LOCATION').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.location = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.location = {all: false}
        })
    }

    getFollower() {
        this.commonService.getCode('FOLLOWER_RANGE').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.follower_range = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.follower_range = {all: false}
        })
    }
    getChannel() {
        this.filter.channels = [
            {cd_id: 'all', cd_label: 'All'},
            {cd_id: 2, cd_label: 'Facebook'},
            {cd_id: 3, cd_label: 'Youtube'},
            {cd_id: 4, cd_label: 'Instagram'}
        ]
        this.filterData.channels = {all: false}
    }
    getKeyword() {
        this.commonService.getCode('KEYWORD').subscribe((res:any) =>{
            //console.log(res)
            if(res && res.code){
                this.filter.keyword = [{cd_id: 'all', cd_label: 'All'}, ...res.code]
            }
            //console.log(this.filter)
            this.filterData.keyword = {all: false}
        })
    }

    checkBox(type, id){
        if(id == 'all'){
            if(this.filterData[type] && this.filterData[type]['all']){
                this.filterData[type] = {all: false};
            }else{
                this.filterData[type] = {all: true};
            }
        }else{
            if(this.filterData[type] && this.filterData[type][id])
                this.filterData[type][id] = false;
            else this.filterData[type][id] = true

            if(this.filter[type].length == this.filterData[type].length){
                this.filterData[type] = {all: true};
            }else{
                this.filterData[type]['all'] = false;
            }
            
        }
        //console.log(this.filterData)
    }

    isCheckBox(type, id){
        if(this.filterData[type] && this.filterData[type]['all']) return true
        else{
            if(this.filterData[type] && this.filterData[type][id]) return true;
            return false;
        }
    }

    reset(){
        this.filterData.fistar_type = {all: false}
        this.filterData.gender = {all: false}
        this.filterData.keyword = {all: false}
        this.filterData.channel = {all: false}
        this.filterData.follower_range = {all: false}
        this.filterData.location = {all: false}
        this.filterData.post_range = {all: false}
        this.filterData.age_range = {all: false}
    }

    getListFistar(){
        //console.log('XXX');
        //console.log(this.filterData)
        let params = new HttpParams()
        Object.keys(this.filterData).forEach(item=>{
            if(this.filterData[item]['all']) {
                this.filter[item].forEach(i=>{
                    if(i.cd_id !== 'all') params = params.append(item+'[]', i.cd_id.toString())
                })
            }
            else{
                Object.keys(this.filterData[item]).forEach(i=>{
                    if(this.filterData[item][i]) params = params.append(item+'[]', i)
                })
            }
        })
        if(this.searchKey && this.searchKey != '') params = params.append('search', this.searchKey)
        params = params.append('active', '1')
        params = params.append('state', '2')
        params = params.append('paginate', '9999999')
        //console.log(params, "PARAMS")
        this.commonService.searchFistarCampaign(params).subscribe((res:any)=>{
            //console.log(res)
            this.data = res
        })
        
    }
    openModalKeyword(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    showHideFilter(){
        this.showFilter = !this.showFilter;
    }

    getChannelFollower(item){
        let html = ``
        let channel = [2,3,4]
        // let x = []
        // item.channel.forEach(channel=>{
        //     if(channel.sns_id > 1){
        //         x.push(channel.sns_id)
        //         html += this.getFollowerNumber(channel);
        //     }
        // })
        channel.forEach(x=>{
            let n = '0';
            let y = item.channel.filter(i=>{
                return i.sns_id == x
            })
            if(y.length>0){
                let z = y.map(j=>{
                    return j
                })
    
                if(z.length>0){
                    n=z[0].usn_follower
                }
            }
            
            html += `<div class="sns-info"><img src="/assets//softone//sns//${x}.png"><span>${this.commonService.parseLargeNum(parseInt(n))}</span></div>`
        })

        return html
    }

    // getFollowerNumber(item){
    //     let html
    //     if(item.sns_url){
    //         html = `<div class="sns-info"><img src="/assets//softone//sns//${item.sns_id}.png"><span>${this.commonService.parseLargeNum(parseInt(item.usn_follower))}</span></div>`
    //     }
    //     return html;
    // }
    checkFistar(item){
        //console.log(item)
        if(this.fistars.indexOf(item) < 0){
            this.fistars.push(item)
        }else{
            this.fistars = this.fistars.filter(i=>{
                return i != item
            })
        }
    }

    selectFistar(){
        //console.log(this.fistars)
        this.change.emit(this.fistars);
    }
    getBirthYear(dob){
        let x = dob.split('-')
        return x[0]
    }
    getGenderIcon(x){
        if(x==9) return 'fa fa-mars';
        return 'fa fa-venus';
    }

    changeSearchKeyword(evt){
        this.searchKey = evt.target.value
    }
}
