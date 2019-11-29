import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { CommonService } from '../../service/common.service';



@Component({
    selector: 'app-admin-campaign-report',
    templateUrl: './report.component.html',
    styleUrls: [
        './report.component.scss'
    ]
})
export class AdminCampaignReportComponent implements OnInit {
    idCampaign: any;
    campain = {
        cp_image: '',
        cp_status: undefined,
        cp_name: '',
        category: {},
        fiStarRecruitingPeriod: '',
        cp_period_start: '',
        cp_period_end: '',
        cp_total_free: 0,
        cp_total_influencer: '',
        cp_product_price: '',
        cp_sale_price: '',
        cp_campaign_price: '',
        review_statitics: {},
        review_statitics_channel: [],
        review: [],
        cp_description: '',
        keyword: [],
        gender: '',
        cp_main_image: ''
    };
    cpData: any={};
    data: any = {};
    parner = {
        p_image: '',
        channels: []
    };
    //Chart

    chart1 = {
        title: 'Engagement',
        type: 'PieChart',
        columnNames: ['Task', 'Hours per Day'],
        data: [['Shares', 0],
        ['Comment', 0], ['like', 0], ['View', 0]],
        roles: []
    };
    chart2 = {
        title: 'SNS CHANNEL',
        type: 'PieChart',
        columnNames: ['Task', 'Hours per Day'],
        data: [
            ['FaceBook', 0],
            ['Youtube', 0],
            ['Instagram', 0],
            ['Fime', 0]
        ],
        roles: []
    };
    statusCampaign;
    titleCapaign;
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        public commonService: CommonService,
    ) {
        this.chart1 = {
            title: 'Engagement',
            type: 'PieChart',
            columnNames: ['Task', 'Hours per Day'],
            data: [
                ['Shares', 0],
                ['Comment', 0],
                ['Like', 0],
                // ['View', 0],
            ],
            roles: []
        };
        this.chart2 = {
            title: 'SNS CHANNEL',
            type: 'PieChart',
            columnNames: ['Task', 'Hours per Day'],
            data: [
                ['FaceBook', 0],
                ['Youtube', 0],
                ['Instagram', 0],
            ],
            roles: []
        };
    }

    ngOnInit() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);
            }
        });
    }

    initData(id) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            (res:any) => {

                this.data = res;
                if (res) {
                    this.cpData = res;
                    this.titleCapaign = res['cp_name'];
                    this.campain.cp_status = res['cp_status'] == 59 ? 'Matching' :
                        res['cp_status'] == 60 ? 'Ready' :
                            res['cp_status'] == 61 ? 'On-going' : 'Closed';
                    this.campain.cp_image = res['cp_image'];
                    // this.campain.cp_status = res['cp_status'];
                    this.campain.cp_name = res['cp_name'];
                    this.campain.category = res['category'];
                    this.campain.cp_period_start = res['cp_period_start'];
                    this.campain.cp_period_end = res['cp_period_end'];
                    this.campain.cp_total_free = res['cp_total_free'];
                    this.campain.cp_total_influencer = res['cp_total_influencer'];
                    this.campain.cp_product_price = res['cp_product_price'];
                    this.campain.cp_sale_price = res['cp_sale_price'];
                    this.campain.cp_campaign_price = res['cp_campaign_price'];
                    this.campain.cp_description = res['cp_description'];
                    this.campain.keyword = res['keywords'];
                    this.campain.cp_main_image = res['cp_main_image'];
                    switch (res['cp_status']) {
                        case 59:
                            this.campain.fiStarRecruitingPeriod = `${res['cp_period_start']} ~ ${res['cp_period_end']}`;
                            break;
                        case 62:
                            this.campain.fiStarRecruitingPeriod = 'Completed';
                            break;
                        default:
                            this.campain.fiStarRecruitingPeriod = 'Going';
                            break;
                    }
                    if (res['cp_status'] == 59 || res['cp_status'] == 60) {
                        return;
                    }
                    if (res['review_statitics']) {
                        this.campain.review_statitics = res['review_statitics'];
                        // this.chart1 = {
                        //     title: 'Engagement',
                        //     type: 'PieChart',
                        //     columnNames: ['Task', 'Hours per Day'],
                        //     data: [
                        //         ['Shares', Number(res['review_statitics']['sum_share'])],
                        //         ['Comment', Number(res['review_statitics']['sum_comment'])],
                        //         ['like', Number(res['review_statitics']['sum_like'])],
                        //         // ['like', Number(res['review_statitics']['sum_view'])],
                        //     ],
                        //     roles: []
                        // };
                        if (this.convertFime(res['review_statitics_channel'])) {
                            this.chart1 = this.convertFime(res['review_statitics_channel']);
                        } else {
                            this.chart1 = {
                                title: 'Engagement',
                                type: 'PieChart',
                                columnNames: ['Task', 'Hours per Day'],
                                data: [
                                    ['Shares', 0],
                                    ['Comment', 0],
                                    ['like', 0],
                                ],
                                roles: []
                            };
                        }

                    }
                    if (res['review_statitics_channel']) {
                        this.campain.review_statitics_channel = res['review_statitics_channel'];
                        this.chart2 = this.convertSns(res['review_statitics_channel']);

                    }
                    if (res['matchings']) {
                        this.campain.review = this.convert(res['matchings']);

                    }

                }
            },
            err => {
            }
        );
    }

    convertFime(arr) {
        for (let index = 0; index < arr.length; (index)++) {
            if (arr[index]['sns_id'] == 1) {
                return {
                    title: 'Engagement',
                    type: 'PieChart',
                    columnNames: ['Task', 'Hours per Day'],
                    data: [
                        ['Shares', Number(arr[index]['total_share']) || 0],
                        ['Comment', Number(arr[index]['total_comment']) || 0],
                        ['like', Number(arr[index]['total_like']) || 0],
                    ],
                    roles: []
                };
            }
        }
    }


    convertSns(arr) {
        let fb, ig, yt, fi;
        for (let index = 0; index < arr.length; (index)++) {
            switch (arr[index]['sns_id']) {
                // case 1: {
                //     fi = arr[index]['total_like'];
                //     break;
                // }
                case 2: {
                    fb = arr[index]['total_like'] == null || arr[index]['total_like'] == '' ? 0 : arr[index]['total_like'];
                    break;
                }
                case 3: {
                    yt = arr[index]['total_like'] == null || arr[index]['total_like'] == '' ? 0 : arr[index]['total_like'];
                    break;
                }
                case 4: {
                    ig = arr[index]['total_like'] == null || arr[index]['total_like'] == '' ? 0 : arr[index]['total_like'];
                    break;
                }
            }
        }

        return {
            title: 'SNS CHANNEL',
            type: 'PieChart',
            columnNames: ['Task', 'Hours per Day'],
            data: [
                ['FaceBook', Number(fb) || 0],
                ['Youtube', Number(yt) || 0],
                ['Instagram', Number(ig) || 0],
            ],
            roles: []
        };


    }

    convert(array) {
        let arrr = [];
        for (let index = 0; index < array.length; index++) {

            for (let second = 0; second < array[index]['matching_channel'].length; second++) {
                if (
                    array[index]['matching_channel']
                    && array[index]['matching_channel'][second]
                    && array[index]['matching_channel'][second]['m_ch_selected'] === 1
                    && array[index]['matching_channel'][second]['m_ch_url'] !== null
                    && array[index]['matching_channel'][second]['m_ch_active_url'] === 1
                ) {
                    let obj = {};
                    obj['user'] = array[index]['influencer'];
                    obj['channel'] = array[index]['matching_channel'][second];

                    arrr.push(obj);
                }

            }
        }
        return arrr;
    }
    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }

    showOnlyYear(time) {
        if (time && time.length > 4) {
            return time.substring(0, 4);
        }
        return '';
    }
    calulateAge(time) {
        var date = new Date();
        var year = date.getFullYear();
        if (time && time.length > 4) {
            return Number(year) - Number(time.substring(0, 4));
        }
        return 0;
    }
    goToLink(url: string) {
        window.open(url, "_blank");
    }
    convertImgLink(name, params1, params2) {
        ///'fistars', 'thumbnail'
        let result = this.commonService.getImageLink(name, params1, params2);
        return result;
    }
}
