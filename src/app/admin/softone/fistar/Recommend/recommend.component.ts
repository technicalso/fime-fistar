import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';

import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { RequestFistarService } from '../../service/request/fistar/fistar.service';
import {CommonService} from '../../service/common.service';
import {FistarService} from '../../service/fistar/fistar.service';

@Component({
    selector: 'app-admin-fistar-recommend',
    templateUrl: './recommend.component.html',
    styleUrls: [
        './recommend.component.scss'
    ]
})
export class AdminFistarRecommendComponent implements OnInit {
    public data:any[] = [];
    public listImage:any = [];
    public fistar:any = {};
    public listRecommend:any = {};
    public selected =  [];
    public keywords:any = [];
    public id: string;
    public cdId: any = [];
    public url:string = "https://9mobi.vn/cf/images/2015/03/nkk/anh-dep-1.jpg";
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private requestFistar: RequestFistarService,
        private activeRoute: ActivatedRoute,
        private commonService: CommonService,
        private fistarService: FistarService,
    ) { 
         
    }

    ngOnInit() {
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.getListRecommend();
        this.getDetail();
        this.getkeywords();
        this.getListImage();
    }

    getListRecommend(){
        this.fistarService.getRecommendCampaigns(this.id).subscribe((res:any)=>{
            this.listRecommend = res;
            console.log(this.listRecommend,'recommend');
        })
    }
    // getListRecommend(){
    //     this.data = [
    //         {
    //             id:1,
    //             campaign_info:"Mặt nạ giấy NEOGEN DERMALOGY AQUA CAPSULE MASK HYDRA AQUA SET 5 MASK ",
    //             states: 'matching',
    //             keyword: "#base #base #base #base #base #base #base #base #base #base #base #base",
    //             recommend: "recommend"
    //         },
    //         {
    //             id:2,
    //             campaign_info:"Mặt nạ giấy NEOGEN DERMALOGY AQUA CAPSULE MASK HYDRA AQUA SET 5 MASK ",
    //             states: 'matching',
    //             keyword: "#base #base #base #base #base #base #base #base #base #base #base #base",
    //             recommend: "recommend"
    //         },
    //         {
    //             id:3,
    //             campaign_info:"Mặt nạ giấy NEOGEN DERMALOGY AQUA CAPSULE MASK HYDRA AQUA SET 5 MASK ",
    //             states: 'matching',
    //             keyword: "#base #base #base #base #base #base #base #base #base #base #base #base",
    //             recommend: "recommend"
    //         },
    //         {
    //             id:4,
    //             campaign_info:"Mặt nạ giấy NEOGEN DERMALOGY AQUA CAPSULE MASK HYDRA AQUA SET 5 MASK ",
    //             states: 'matching',
    //             keyword: "#base #base #base #base #base #base #base #base #base #base #base #base",
    //             recommend: "recommend"
    //         }
    //     ];
    // }

    getkeywords(){
        this.requestFistar.getKeywords().subscribe((res:any) => {
            //console.log(res);
            this.keywords = res.code;
        })
    }
    
    getDetail(){
        this.requestFistar.getDetail(this.id).subscribe((res:any) => {
            this.fistar = res;
            console.log(this.fistar);
            for (const item of res.keywords) {
                this.cdId.push(item.cd_id);
            }
        });
    }
    getListImage(){
        this.fistarService.getImageRecentAnalysis(this.id).subscribe((res:any)=>{
            console.log(res,'image');
            this.listImage = res;
        })
    }

    changeStatus(id){
        this.fistarService.changeStatus(id).subscribe((res:any)=>{
            console.log(res);
        });
        setTimeout(() => {
            this.getListRecommend();
            console.log(this.data);
           
        }, 1000);
    }
}
