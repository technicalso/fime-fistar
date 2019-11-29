import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {  ActivatedRoute} from '@angular/router';
import { HttpClientAdminService } from '../../shared/service/httpclient.service';


@Component({
    selector: 'app-admin-campaign-tab',
    templateUrl: './tab.component.html',
    styleUrls: [
        './tab.component.scss'
    ]
})
export class AdminCampaignTabComponent implements OnInit {
    @Input() tryId: {}[];
    
    title = 'angular-material-tab-router';  
    navLinks: any[];
    activeLinkIndex = -1; 
    public id: string;
    public env: any = environment;
    
    constructor(private router: Router,private activeRoute: ActivatedRoute,private campaginService: HttpClientAdminService) {
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.setLink();
    }
    ngOnInit(): void {
        this.router.events.subscribe((res) => {
            this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
        });
    }

    setLink(){
        this.campaginService.getData(`api/admin/campaigns/${this.id}`).subscribe((res:any) =>{
            console.log(res, "RES")
            this.navLinks = [
                {
                    label: 'Campaign Edit',
                    link: '/admin/campaign/edit/'+this.id,
                    index: 0
                }, 
                {
                    label: 'Matching fiStar',
                    link: '/admin/campaign/matching-fistar/'+this.id,
                    index: 1
                }, 
                {
                    label: 'fiStar Review',
                    link: '/admin/campaign/campaign-review/'+this.id,
                    index: 2
                }, 
                {
                    label: 'Campaign Report',
                    link: '/admin/campaign/campaign-report/'+this.id,
                    index: 3
                },
                {
                    label: 'Comments',
                    target: '_blank',
                    link: '/admin/comments/try/'+res.cp_try_id,
                    index: 4,
                    disable: (res.cp_try_id == null || res.cp_try_id == '')?true:false
                },
                {
                    label: 'fime Review',
                    target: '_blank',
                    link: '/admin/reviews/try/'+res.cp_try_id,
                    index: 5,
                    disable: (res.cp_try_id == null || res.cp_try_id == '')?true:false
                },
                {
                    label: 'fime Winners',
                    target: '_blank',
                    link: '/admin/winner/try/'+res.cp_try_id,
                    index: 6,
                    disable: (res.cp_try_id == null || res.cp_try_id == '')?true:false
                },
                {
                    label: 'Payments',
                    link: '/admin/campaign/campaign-payment/'+this.id,
                    index: 7
                }, 
            ];
        })
        
    }
    
}
