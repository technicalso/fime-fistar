import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { PartnerService } from '../../../softone/service/partner/partner.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from './../../service/common.service';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-admin-partner-recommend',
    templateUrl: './recommend.component.html',
    styleUrls: [
        './recommend.component.scss'
    ]
})
export class AdminPartnerRecommendComponent implements OnInit {
    public data: any = [];
    public selected = [];
    public recommendId: any = [];
    public active: boolean = false;
    public id: string;
    public url: string = "https://9mobi.vn/cf/images/2015/03/nkk/anh-dep-1.jpg";
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private partnerService: PartnerService,
        private activeRoute: ActivatedRoute,
        private commonService: CommonService,
    ) {

    }

    ngOnInit() {
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        // this.getListRecommend();
        this.getRecommend(this.id);
        var a = ['a', 1, 'a', 2, '1'];
        var unique = a.filter(this.onlyUnique);
        console.log(unique);
    }

    changeStatus(arrIdOneRecommend) {
        this.partnerService.changeStatus(arrIdOneRecommend).subscribe((res: any) => {

        });
        setTimeout(() => {
            this.getRecommend(this.id);
            console.log(this.data);

        }, 1000);
    }
    getRecommend(pId) {
        this.partnerService.getFistarRecommend(pId).subscribe((res: any) => {
            this.data = res;
            // console.log(this.data);
            // this.data.map((item, index) => {
            //     let total: any = [];
            //     let arrId: any = [];
            //     let match_count: any = 0;
            //     let campaignKey: string = '';
            //     item.recommendeds.map((itemFistarKeyword) => {
            //         total += itemFistarKeyword.fistar_keyword.split(",");
            //         campaignKey = itemFistarKeyword.campaign_keyword;
            //         arrId.push(itemFistarKeyword.id);
            //     })
            //     this.data[index].fistarKeyword = total.split(",").filter(this.onlyUnique).toString();
            //     this.data[index].campaignKeyword = campaignKey;
            //     this.data[index].arrIdOneRecommend = arrId;
            //     campaignKey.split(',').map((item) => {
            //         if(total.trim().includes(item.trim())) {
            //                 match_count +=1;
            //             }

            //     });
            //     this.data[index].match_count = match_count
            // })

        })
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    onDeleteMulti() {
        this.partnerService.deleteRecommend(this.recommendId).subscribe((res: any) => {
            this.getRecommend(this.id);
            this.selected = [];
        })
    }
    onSelect({ selected }) {

        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);

        selected.map((item, index) => {
            var recommendSelected = [];
            item.recommendeds.map((recommendId) => {
                recommendSelected.push(recommendId.id);
            })
            selected[index].recommendId = recommendSelected;
        });
        console.log(selected);

        this.recommendId = [];
        for (let item of selected) {

            this.recommendId.push(item.recommendId);
        }

        this.recommendId = [].concat.apply([], this.recommendId);
        console.log(this.recommendId, 'fsd');


    }

    showKeyword(row, item){
        console.log(row, item, 'line124');
        document.getElementById('keyword_match_'+row.cp_id).innerText = item.keyword_match;
        document.getElementById('keyword_match_ai_'+row.cp_id).innerText = item.keyword_ai_match;
        document.getElementById('keyword_match_count_'+row.cp_id).innerText = item.match_count;
        $('.influencer_item_'+row.cp_id+' > img').removeClass("active");
        $('#influencer_item_'+row.cp_id+'_'+item.uid+'>img').addClass("active");
    }

}
