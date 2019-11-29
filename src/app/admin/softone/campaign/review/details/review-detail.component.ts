import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientAdminService } from '../../../../shared/service/httpclient.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-admin-campaign-review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: [
        './review-detail.component.scss'
    ]
})
export class AdminCampaignReviewDetailComponent implements OnInit {
    data = {
        header: [
            'Name',
            'Photo',
            'Channel',
            'Review State',
            'Payment',
            'History',
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: {},
        detail: {
        },
        detailAll: {
        }
    };
    idCampaign;
    idMatching;
    idChannel;
    routerBack;
    channel;
    category;
    title_m_ch;
    content_m_ch;
    rv_status;
    m_id;
    url_sns;
    isPayment = false;
    sns_id;
    numberSnsId: number;
    cp_status = '';
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        private toa: ToastrService
    ) {

    }

    ngOnInit() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);
            }
        });

        this.activeRoute.queryParams.subscribe(
            params => {
                this.idMatching = params.idMatching ? params.idMatching : '';
                this.idChannel = params.idChannel ? params.idChannel : '';
            }
        );
    }

    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }

    initData(id) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            res => {
                console.log('123', res);
                this.setValueForm(res);
            },
            err => {
                console.log(err);
                console.log('err', err);
            }
        );
    }

    setValueForm(data) {
        this.data.list = data['matchings'];
        this.data.detail = this.getItem();
        this.data.detailAll = data;
        if (this.data.detail) {
            this.channel = this.data.detail['sns']['sns_name'];
            this.title_m_ch = this.data.detail['m_ch_title'];
            this.content_m_ch = this.data.detail['m_ch_content'];
            this.rv_status = this.data.detail['review_status'] ? this.data.detail['review_status']['rv_status'] : '';
            this.m_id = this.data.detail['m_id'];
            this.url_sns = this.data.detail['m_ch_url'];
            this.category = this.data.detail['category'] ? this.data.detail['category']['cd_label'] : '';
            this.isPayment = this.data.detail['payment'] ? true : false;
            this.numberSnsId = this.data.detail['sns_id'] ? this.data.detail['sns_id'] : 1;
            this.sns_id = this.data.detail['sns']['sns_id'];
            this.cp_status = data['matchings'] ? data['matchings'] : '';
        }
    }


    getItem() {
        let obj = {};
        for (let i = 0; i < this.data.list.length; i++) {
            let item  =  this.data.list[i];
            if (this.idMatching == item['m_id']) {
                for (let j = 0; j < item['matching_channel'].length; j++) {
                    let matchingChannel = item['matching_channel'][j];
                    if (this.idChannel == matchingChannel['m_ch_id']) {
                        obj = matchingChannel;
                        break;
                    }
                }

            }
        }
        return obj;
    }

    back() {
        this.router.navigate([`admin/campaign/campaign-review/${this.idCampaign}`]);
    }

    navigatee() {
        this.router.navigate([`admin/campaign/campaign-edit-detail/${this.idCampaign}`], { queryParams: { idMatching: this.idMatching, idChannel: this.idChannel } });
    }

    addReview() {
        this.router.navigate([`admin/campaign/campaign-add-detail/${this.idCampaign}`]);
    }

    updateStatus(value) {

        let body = {
            sns_id: this.numberSnsId,
            rv_status: value
        };

        this.campaginService.postData(`api/admin/update-doing-status/${this.m_id}?type=review`, body).subscribe(
            data => {
                this.initData(this.idCampaign);
                this.toa.success('Update success');
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }

    goToLinkUrl() {
        if (this.url_sns != '' && this.url_sns) {
            window.open(this.url_sns, '_blank');
        }
    }
}
