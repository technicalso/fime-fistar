import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router ,ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { RequestPartnerService } from '../../../service/request/partner/partner.service';
import {CommonService} from "../../../service/common.service";
@Component({
    selector: 'admin-request-fistar-basic',
    templateUrl: './basic.component.html',
    styleUrls: [
        './basic.component.scss'
    ]
})
export class AdminRequestPartnerBasicComponent implements OnInit {
    public message: string;
    public banners:any = [];
    public data:any = [];
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public keywords: any ;
    public id: string;
    public cdId:any = [];

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private requestPartner: RequestPartnerService,
        private route: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: Object,
        public commonService: CommonService,
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getkeywords();
        this.getDetail();
    }

    getkeywords(){
        this.requestPartner.getKeywords().subscribe((res:any) => {
            console.log(res);
            this.keywords = res.code;
        })
    }
    getDetail(){
        this.requestPartner.getDetail(this.id).subscribe((res:any) => {
            for (const item of res.keywords) {
                this.cdId.push(item.cd_id);
            }
            this.data = res;
            console.log(res,'request');
        });
    }

    accessRequest(stateId){
        
        let dataRequest:any = {pid:[this.id],pc_state:stateId};
        this.requestPartner.updateRequest(dataRequest).subscribe(res => {
            if(stateId==2){
                this.toast.success('Approve successfully');
                this.router.navigate(['/admin/request/partner']);
            }
            else{
                this.toast.success('Reject successfully');
                this.router.navigate(['/admin/request/partner']);
            }
               
        });
    }
  
    openNewWindown( url){
        window.open(url);
    }
}
