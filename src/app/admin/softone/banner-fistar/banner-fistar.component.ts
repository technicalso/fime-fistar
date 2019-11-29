import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BannerService } from '../service/banner/banner.service';
import {CommonService} from '../../../admin/softone/service/common.service';
import {ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material'
@Component({
    selector: 'admin-banner-fistar',
    templateUrl: './banner-fistar.component.html',
    styleUrls: [
        './banner-fistar.component.scss'
    ]
})
export class AdminBannerFistarComponent implements OnInit {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    public message: string;
    public banners:any = [];
    public banner:any = {};
    public filter: any={
        page: 1,
        per_page: 10,
    };
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private bannerService: BannerService,
        private commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.getBanners();
        // this.banner = 
    }

    closeMyMenu() {
        this.trigger.closeMenu();
      }  
    getBanners() {
        this.bannerService.getBanners(this.filter).subscribe((res:any) => {
            this.banners = res;
        });

    }

    deleteBanner(sbid){
        this.bannerService.deleteBanner(sbid).subscribe(res => {
            
                this.getBanners();
                this.toast.success('Delete banner successfully');
            
        })
    }

    deleteMany(){
        let deleteItems =[...this.selected];
        this.selected = []
        if(deleteItems.length > 0){
            deleteItems.map((item)=>{
                this.bannerService.deleteBanner(item.sbid).subscribe(res => {
                    this.getBanners();
                })
            })
            
            this.toast.success('Delete banners successfully');
        }else{
            this.toast.error('No banner is selected');
        }
    }

    onSelect({selected}){
        this.selected = selected
    }

    setPage(page) {
        this.filter.page = page.offset + 1
        this.getBanners()
    }

    changeStatus(id){
        this.bannerService.changeStatus(id).subscribe((res:any) => {
            this.getBanners();
        })
    }
  
}
