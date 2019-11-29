import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';
import { CampaignService } from '../../service/campaign/campaign.service';


@Component({
    selector: 'app-admin-campaign-review',
    templateUrl: './review.component.html',
    styleUrls: [
        './review.component.scss'
    ]
})
export class AdminCampaignReviewComponent implements OnInit {
    data = {
        header: [
            'Name',
            'Photo',
            'Review State',
            'Channel',
            'Payment',
            'Action',
        ],
        groupHeader: [
            'Review State',
            'Channel',
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: []
    };
    reviewId;
    idCampaign;
    dataHistoryReview = {};
    dataInfoPayment = {};
    campain = {
        name: '',
        brand: '',
        total: 0,
        status: ''
    };
    cpData:any={};
    dataNew = {};
    showHistoryPayment = false;
    showPayment = false;
    addNewPayment = false;
    activeItem;
    count = {
        list1: 0,
        list2: 0,
        list3: 0,
        list4: 0,
        list5: 0,
    };
    titleReviewPayment = '';
    idPayment = 0;
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        private toa: ToastrService,
        private commonService: CommonService,
        private campaignRVService: CampaignService
    ) {

    }

    ngOnInit() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);
                this.getReviewStatus()
            }
        });
    }

    getReviewStatus(){
        this.campaginService.getReviewAdminStatusId(this.idCampaign).subscribe((res:number) => {
            this.reviewId = res;
        })
    }
    initData(id) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            (res:any) => {
                console.log(res, 'initData review.component.ts')
                this.campain.name = res['cp_name'];
                this.campain.brand = res['cp_brand'];
                this.campain.status = this.convertStatus(res['cp_status']);

                if (res['cp_status'] == 60 || res['cp_status'] == 61 || res['cp_status'] == 62) {
                    // set data table
                    this.data.list = [...this.convertData(res['matchings']), ...this.convertAdminData(res.admin_reviews)];
                    console.log(this.data.list, 'initData review.component.ts2')
                    // tab info number
                    this.data.total_page = this.data.list.length;
                    this.data.defaultList = this.data.list;
                    this.countItem(this.data.list);
                    
                }

            },
            err => {
            }
        );
    }
    addReview() {
        this.router.navigate([`admin/campaign/campaign-review-admin/add/${this.idCampaign}/0`]);
    }
    countItem(arr) {
        for (let index = 0; index < arr.length; index++) {
            switch (arr[index]['review_status'] ? arr[index]['review_status']['rv_status'] : '') {
                case 101:
                    this.count['list1']++;
                    break;
                case 102:
                    this.count['list2']++;
                    break;
                case 103:
                    this.count['list3']++;
                    break;
                case 104:
                    this.count['list4']++;
                    break;
                case 105:
                    this.count['list5']++;
                    break;
                default:
                    break;
            }
        }
    }

    convertData(data) {
        let arr = [];
        let obj;
        for (let index = 0; index < data.length; index++) {
            if (data[index]['matching_status'] && (data[index]['matching_status']['m_status'] == 8 || data[index]['matching_status']['m_status'] == 16)) {
                for (let j = 0; j < data[index]['matching_channel'].length; j++) {
                    if (data[index]['matching_channel'][j]['m_ch_selected'] == 1) {
                        obj = {
                            id: data[index]['m_id'],
                            main: data[index],
                            controls: [
                                { value: 'View detail', action2: true, idMatching: data[index]['m_id'], idChannel: data[index]['matching_channel'][j]['m_ch_id'], item: 'view' },
                                { value: 'History', action2: true, idMatching: data[index]['m_id'], idChannel: data[index]['matching_channel'][j]['m_ch_id'], item: 'history' },
                                { value: 'Payment', action2: true, idMatching: data[index]['m_id'], idChannel: data[index]['matching_channel'][j]['m_ch_id'], item: 'payment' },
                            ],
                            content: [
                                { title: data[index]['influencer']['fullname'] },
                                {
                                    image: data[index]['influencer']['picture'] != '' ?
                                        this.commonService.getImageLink(data[index]['influencer']['picture'], this.commonService.IMAGE_TYPE.FISTARS, this.commonService.IMAGE_SIZE.MEDIUM) : ''
                                },
                                {
                                    matching_channel: this.groubChannelShow(data[index]['matching_channel'][j]['sns_id'] 
                                    ? data[index]['matching_channel'][j]['sns_id'] 
                                    : '', this.convertCost(data[index]['matching_channel'][j]['sns_id'], data[index]['influencer']['channels']))
                                },
                                {
                                    arrayTitle: {
                                        title: data[index]['matching_channel'][j]['m_ch_title'] ? data[index]['matching_channel'][j]['m_ch_title'] : '',
                                        status: data[index]['matching_channel'][j]['review_status'] ? data[index]['matching_channel'][j]['review_status']['label']['fistar_status'] : '',
                                        link: `admin/campaign/campaign-review-detail/${this.idCampaign}`,
                                        idMatching: data[index]['m_id'],
                                        idChannel: data[index]['matching_channel'][j]['m_ch_id']
                                    }
                                },
                                { title: data[index]['matching_channel'][j]['payment'] && data[index]['matching_channel'][j]['payment']['payed_date'] ? 'Completed' : 'No' },
                            ],
                            review_status: data[index]['matching_channel'][j]['review_status']
                        };
                        arr.push(obj);
                    }
                }
            }
        }
        return arr;
    }

    convertAdminData(data) {
        // this.campaignRVService.getReviewStatus(22).subscribe((res:any)=> {
        //     console.log(res);
        // })
        let result = [];
        console.log(data, 'convertAdminData')
        data.forEach(item=>{
            let obj = {
                id: item.id,
                main: item,
                controls: [
                    { value: 'View detail', action2: true, idCampaign: null, idChannel: item.id, item: 'viewadmin' },
                    // { value: 'History', action2: true, idMatching: null, idChannel: null, item: 'history' },
                    // { value: 'Payment', action2: true, idMatching: null, idChannel: null, item: 'payment' },
                ],
                content: [
                    { title: 'DM&C' },
                    {
                        image: 'https://x.kinja-static.com/assets/images/logos/placeholders/default.png'
                    },
                    {
                        matching_channel: this.groubChannelShow(item.sns_id, '---')
                    },
                    {
                        arrayTitle: {
                            title: item.m_ch_title,
                            status: item.admin_review_status.rv_status==103 || (item.admin_review_status.rv_status==105&&item.m_ch_active_url==0)?'Checking reviews':item.admin_review_status.rv_status==104?'writing':'completed',
                            link: `admin/campaign/campaign-review-detail/${this.idCampaign}`,
                            idMatching: null,
                            idChannel: null
                        }
                    },
                    { title: '--' },
                ],
                review_status: ''
            }
            result.push(obj)
        })
        return result
    }

    convertCost(sns, channels) {
        for (let index = 0; index < channels.length; index++) {
            if(channels[index].sns_id == sns) {
                this.campain.total += parseInt(channels[index].cost);
                return parseInt(channels[index].cost);
            }
        }
    }

    groubChannelShow(type, price) {
        let arr = [];
        let object = {
            sns_id: type,
            cost: price
        };
        arr.push(object);
        return arr;
    }

    groubChannelMathching(sns, userChannel) {
        let arr = [];
        for (let index = 0; index < userChannel.length; index++) {
            let object = {};
            if (userChannel[index]['sns_id'] === sns) {
                object = {
                    sns_id: sns,
                    cost: userChannel[index]['cost']
                };
                arr.push(object);
                break;
            }
        }
        return arr;
    }

    view(evt) {
        switch (evt['action']['item']) {
            case 'view': {
                this.router.navigate([`admin/campaign/campaign-review-detail/${this.idCampaign}`],
                    { queryParams: { idMatching: evt['action']['idMatching'], idChannel: evt['action']['idChannel'] } });
                break;
            }
            case 'history': {
                this.showHistoryPayment = true;
                this.dataHistoryReview = this.converDataHistory(evt['item']['main'], evt['action']['idChannel']);

                break;
            }
            case 'payment': {
                this.dataInfoPayment = this.converDataPayment(evt['item']['main'], evt['action']['idChannel']);
                this.showPayment = true;
                break;
            }
            case 'viewadmin': {
                this.router.navigate([`admin/campaign/campaign-review-admin/detail/${this.idCampaign}/${evt['action']['idChannel']}`],
                    { queryParams: { idMatching: evt['action']['idMatching'], idChannel: evt['action']['idChannel'] } });
                break;
            }
            default:
                break;
        }
    }

    converDataHistory(data, idChannel) {
        let obj = {};
        for (let i = 0; i < data['matching_channel'].length; i++) {
            if (data['matching_channel'][i]['m_ch_id'] == idChannel) {
                this.titleReviewPayment = data['influencer']['fullname'];
                obj = data['matching_channel'][i];
                break;
            }
        }

        return obj;
    }

    converDataPayment(data, idChannel) {
        let obj = {};
        for (let i = 0; i < data['matching_channel'].length; i++) {
            if (data['matching_channel'][i]['m_ch_id'] == idChannel) {
                obj = {
                    data: data['influencer'],
                    id_ch: data['matching_channel'][i]['m_ch_id'],
                    sns_id: data['matching_channel'][i]['sns_id'],
                    payment: data['matching_channel'][i]['payment'],
                };
                this.idPayment = data['matching_channel'][i]['payment'] ? data['matching_channel'][i]['payment']['id'] : '';
                break;
            }
        }
        return obj;
    }


    close(evt) {
        this.showHistoryPayment = evt;
        this.dataHistoryReview = {};
    }

    closeP(evt) {
        this.showPayment = evt;
        this.dataInfoPayment = {};
    }

    editItem(evt) {
        if (this.idPayment != 0) {
            this.campaginService.putData(`api/admin/payments/${this.idPayment}`, evt).subscribe(
                res => {
                    this.successPayment();
                },
                err => {
                    this.toa.error(err.error.message);
                }
            );
        }
        else {
            this.addhandleItem(evt);
        }

    }

    addItem() {
        this.addNewPayment = true;
    }

    closeadd(evt) {
        this.addNewPayment = evt;
    }

    addhandleItem(evt) {
        this.campaginService.postData(`api/admin/payments`, evt).subscribe(
            res => {
                this.successPayment();
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }

    successPayment() {
        this.showPayment = false;
        this.resetCountListItem();
        this.initData(this.idCampaign);
        this.toa.success('Update success');
    }


    resetCountListItem() {
        this.campain.total = 0;
        this.count.list1 = 0;
        this.count.list2 = 0;
        this.count.list3 = 0;
        this.count.list4 = 0;
        this.count.list5 = 0;
    }


    search(value) {
        this.activeItem = value;
        let arr = [];
        switch (value) {
            case 'all': {
                arr = this.data.defaultList;
                break;
            }
            case 102: {
                for (let index = 0; index < this.data.defaultList.length; index++) {
                    if (value == this.data.defaultList[index]['review_status']['rv_status'] ||
                        this.data.defaultList[index]['review_status']['rv_status'] == 101) {
                        arr.push(this.data.defaultList[index]);
                    }
                }
                break;
            }
            default: {
                for (let index = 0; index < this.data.defaultList.length; index++) {
                    if (value == this.data.defaultList[index]['review_status']['rv_status']) {
                        arr.push(this.data.defaultList[index]);
                    }
                }
            }
                break;
        }
        this.data.list = arr
    }

    convertStatus(number) {
        let status = '';
        switch (number) {
            case 59:
                status = 'Matching';
                break;
            case 60:
                status = 'Ready';
                break;
            case 61:
                status = 'On going';
                break;
            case 62:
                status = 'Closed';
                break;
            default:
                status = '';
                break;
        }
        return status;
    }

    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }

    noAddReview(){
        this.toa.warning("Can't add review when campaign is Matching");
    }
}
