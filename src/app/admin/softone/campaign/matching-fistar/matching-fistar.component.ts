import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';

const STATUS_MATCHING = {
    // request: [1, 4],
    // rejected: [2,3,5,6,7,10,11,13,15], 6 ma` reject a` ?????
    // matched: [8, 16],
    // apply: [9, 12, 14],
    // recommend: [],
    request: [1, 4],
    confirmed: [6, 14],
    rejected: [3, 11, 13],
    matched: [8, 16],
    apply: [9, 12],
    canceled: [2, 5, 7, 10, 15],
    recommend: [],
};

const STATUS_LABEL = {
    request: [1, 4, 6],
    rejected: [2, 3, 5, 7, 10, 11, 13, 15],
    matched: [8, 16],
    apply: [9, 12, 14],
    recommend: [],
}

const ACTION = {
    1: [
        { value: 'Cancel', action2: true, m_status: 2 },
        { value: 'Reject', action2: true, m_status: 3 },
        { value: 'Approve', action2: true, m_status: 6 },
    ],
    2: [
        { value: 'Re-request', action2: true, m_status: 1 }
    ],
    3: [
        { value: 'Re-request', action2: true, m_status: 4 }
    ],
    4: [
        { value: 'Approve', action2: true, m_status: 6 },
        { value: 'Reject', action2: true, m_status: 3 },
        { value: 'Cancel', action2: true, m_status: 5 },
    ],
    5: [
        { value: 'Re-request', action2: true, m_status: 9 }
    ],
    6: [
        { value: 'Cancel', action2: true, m_status: 7 },
        { value: 'Confirm', action2: true, m_status: 8 },
    ],
    7: ['cancel'],
    8: ['matched'],
    9: [
        { value: 'Cancel', action2: true, m_status: 10 },
        { value: 'Reject', action2: true, m_status: 11 },
        { value: 'Confirm', action2: true, m_status: 14 },

    ],
    10: [
        { value: 'Re-request', action2: true, m_status: 9 }

    ],
    11: [
        { value: 'Re-request', action2: true, m_status: 1 }
    ],
    12: [
        { value: 'Cancel', action2: true, m_status: 13 },
        { value: 'Reject', action2: true, m_status: 11 },
        { value: 'Confirm', action2: true, m_status: 14 },
    ],
    13: [
        { value: 'Re-request', action2: true, m_status: 1 }
    ],
    14: [
        { value: 'Cancel', action2: true, m_status: 15 },
        { value: 'Approve', action2: true, m_status: 16 },
    ],
    15: ['cancel'],
    16: ['matched'],
};
@Component({
    selector: 'app-admin-campaign-matching-fistar',
    templateUrl: './matching-fistar.component.html',
    styleUrls: [
        './matching-fistar.component.scss'
    ]
})
export class AdminCampaignMatchingStatusComponent implements OnInit {
    idCampaign;
    data = {
        header: [
            'Name',
            'Photo',
            'Gender',
            'Age',
            'Channel',
            'Location',
            'State',
            'fiStar Channel (Posting Fare VND)',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: []
    };
    dataPost = {
        arrayDelete: []
    };
    total: '';
    activeItem;
    statusCampain;
    titleCapaign;
    count = {
        request: 0,
        rejected: 0,
        recommend: 0,
        apply: 0,
        matched: 0,
    };
    cruiment;
    isShowPopup = true;
    countShowPopup = 1;
    cpData: any = {};
    searchValue: any = {};
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        private toa: ToastrService,
        private commonService: CommonService,
    ) {

    }
    ngOnInit() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);
            }
        });
    }

    initData(id, isSetSNS = false) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            res => {
                this.cruiment = res['cp_total_influencer'];
                this.titleCapaign = res['cp_name'];
                this.statusCampain = res['cp_status'] == 59 ? 'Matching' :
                    res['cp_status'] == 60 ? 'Ready' :
                        res['cp_status'] == 61 ? 'On-going' : 'Closed';
                this.data.list = this.convertData(res['matchings']);
                // this.data.page = page;
                this.total = res['total_cost_selected']['total_cost'];
                this.data.total_page = res['matchings'].length;
                this.data.defaultList = res['matchings'];
                if (res['matchings']) {
                    this.count = {
                        request: 0,
                        rejected: 0,
                        recommend: 0,
                        apply: 0,
                        matched: 0,
                    };
                    this.countItem(res['matchings']);
                }
                this.cpData = res;
                if (this.searchValue.value && this.searchValue.index) {
                    this.search(this.searchValue.value, this.searchValue.index)
                }
            },
            err => {
            }
        );
    }

    countItem(arr) {
        Object.keys(STATUS_LABEL).forEach(key => {
            arr.forEach(item => {
                if (STATUS_LABEL[key].indexOf(item.matching_status.m_status) >= 0) {
                    this.count[key]++
                }
            })
        })
    }

    convertData(data) {
        let arr = [];
        for (let index = 0; index < data.length; index++) {
            let obj = {
                id: data[index]['m_id'],
                item: data[index],
                controls: ACTION[data[index]['matching_status']['m_status']],
                content: [
                    { title: data[index]['influencer']['fullname'], link: '/admin/fistar/fistar-infomation/'+data[index]['influencer']['uid'], target:'_blank' },
                    { image: this.commonService.getImageLink(data[index]['influencer']['picture'], 'fistars', 'thumbnail'),  link: '/admin/fistar/fistar-infomation/'+data[index]['influencer']['uid'], target:'_blank' },
                    { title: data[index]['influencer']['gender']['cd_label'] },
                    { title: new Date().getFullYear() - Number(String(data[index]['influencer']['dob']).substring(0, 4)) || '0' },
                    { channel_influencer_star: data[index]['influencer']['channels'] },
                    { title: data[index]['influencer']['location']['cd_label'] },
                    { title: this.groupStatus(data[index]['matching_status']['m_status']) },
                    {
                        matching_channel:
                            this.groubChannelMathching(data[index]['matching_channel'], data[index]['influencer']['channels'], data[index]['m_id'])
                    },
                ]
            };
            arr.push(obj);
        }
        return arr;
    }

    groubChannelMathching(matchingChannel, userChannel, mid) {
        let arr = [];

        for (let index = 0; index < userChannel.length; index++) {
            let object = {};
            for (let second = 0; second < matchingChannel.length; second++) {
                if (userChannel[index]['sns_id'] === matchingChannel[second]['sns_id']) {
                    object = {
                        sns_id: userChannel[index]['sns_id'],
                        cost: this.commonService.formatMoney(userChannel[index]['cost']),
                        m_ch_selected: matchingChannel[second]['m_ch_selected'],
                        m_id: matchingChannel[second]['m_id']
                    };
                    break;
                } else {
                    object = {
                        sns_id: userChannel[index]['sns_id'],
                        cost: this.commonService.formatMoney(userChannel[index]['cost']),
                        m_ch_selected: 0,
                        m_id: mid
                    };
                }

            }
            arr.push(object);
        }
        return arr;
    }

    groupStatus(matching_status) {
        let status;
        if (STATUS_MATCHING.request.indexOf(matching_status) > -1) {
            status = 'Request';
        }
        if (STATUS_MATCHING.canceled.indexOf(matching_status) > -1) {
            status = 'Canceled';
        }
        if (STATUS_MATCHING.rejected.indexOf(matching_status) > -1) {
            status = 'Rejected';
        }
        // if (STATUS_MATCHING.rerequest.indexOf(matching_status) > -1) {
        //     status = 'Re-Request';
        // }
        if (STATUS_MATCHING.confirmed.indexOf(matching_status) > -1) {
            status = 'Confirm';
        }
        if (STATUS_MATCHING.apply.indexOf(matching_status) > -1) {
            status = 'Apply';
        }
        if (STATUS_MATCHING.matched.indexOf(matching_status) > -1) {
            status = 'Matched';
        }
        return status;
    }

    getItem(event) {
        this.dataPost.arrayDelete = [];
        if (event.value.length > 0) {
            event.value.forEach(element => {
                this.dataPost.arrayDelete.push(element['id']);
            });
        }
    }


    getParams(page) {
        this.router.navigate([`/admin/campaign`], { queryParams: { page: page } });
    }

    deleteItem() {
        let r = confirm('Do you want delete campaign?');
        if (r == true) {
            if (this.dataPost.arrayDelete.length > 0) {
                const body = {
                    m_ids: this.dataPost.arrayDelete
                };
                this.campaginService.postData('api/admin/delete-many/campaign_match', body).subscribe(
                    res => {
                        if (res['success']) {
                            this.initData(this.idCampaign);
                            this.toa.success('Update success');
                            this.dataPost.arrayDelete = [];
                        }
                    },
                    err => {
                        this.toa.error(err.error.message);
                    }
                );
            }
        }
    }

    updateStatus(evt) {
        this.toa.clear();
        if (evt) {
            const mId = evt['item']['item']['m_id'];
            const body = {
                m_status: evt['action']['m_status'],
                type: 'match'
            };
            this.campaginService.postData(`api/admin/update-doing-status/${mId}?type=match`, body).subscribe(
                data => {
                    this.initData(this.idCampaign);
                },
                err => {
                    this.toa.error(err.error.message);
                }
            );

        }
    }

    showPopupSuccess() {
        if (this.isShowPopup) {
            this.toa.success('Update success');
        }
        this.isShowPopup = false;
        this.resetIsShowPopup();
    }

    resetIsShowPopup() {
        if (this.countShowPopup == 1) {
            setTimeout(() => {
                this.isShowPopup = true;
                this.countShowPopup = 1;
            }, 3000);
        }
        this.countShowPopup++;
    }

    search(value, index) {
        let arr = [];

        this.activeItem = index;
        this.searchValue = { value, index };
        for (let index = 0; index < this.data.defaultList.length; index++) {
            if (value === 'all') {
                arr.push(this.data.defaultList[index]);
            } else if (STATUS_LABEL[value].indexOf(this.data.defaultList[index]['matching_status']['m_status']) > -1) {
                arr.push(this.data.defaultList[index]);
            }
        }
        this.data.list = this.convertData(arr);
    }

    opentab($event) {
        let path = $event.sns_url ? $event.sns_url : '';
        if (path == '') {
            alert('Link sns channel is empty');
        } else {
            window.open(path, '_blank');
        }
    }

    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }
    updateStatusSns($event) {
        let path = `api/v1/update-match-channel`;
        const body = {
            m_id: $event.m_id,
            sns_id: $event.sns_id
        }
        this.campaginService.postData(path, body).subscribe(
            data => {
                this.initData(this.idCampaign, true);
                this.showPopupSuccess();
            }

        ), err => {
            this.toa.error(err.error.message);
        }

    }
}
