import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientAdminService } from '../../../../shared/service/httpclient.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $: any;


@Component({
    selector: 'app-admin-campaign-information',
    templateUrl: './information.component.html',
    styleUrls: [
        './information.component.scss'
    ]
})
export class AdminCampaignInformationComponent implements OnInit {

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
    idPayment;
    routerBack;
    channel;
    category;
    title_m_ch;
    content_m_ch;
    m_ch_url;
    m_ch_selected;
    mchid;
    dataBlind = {
        channels: [],
        category: []
    };
    formvalue: FormGroup;
    rv_status;
    idMatching;
    idChannel;
    sns_id;
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private campaginService: HttpClientAdminService,
        private formbuilder: FormBuilder,
        private toa: ToastrService

    ) {

    }



    ngOnInit() {
        this.getParam();
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.idCampaign = params['id'];
                this.initData(params['id']);

            }
        });
        this.getCategory();
        this.getItemChannel();
        this.initForm();
    }

    getParam() {
        this.activeRoute.queryParams.subscribe(
            params => {
                if (params.idMatching && params.idChannel) {
                    this.idMatching = params.idMatching ? params.idMatching : '';
                    this.idChannel = params.idChannel ? params.idChannel : '';
                }
            }
        );
    }

    initForm() {
        this.formvalue = this.formbuilder.group(
            {
                m_ch_title: ['', [Validators.required]],
                m_ch_category: ['', [Validators.required]],
                m_ch_content: ['', [Validators.required]],
                m_ch_url: ['', []],
                sns_id: ['', [Validators.required]],
                m_ch_selected: ['']
            }
        );
    }

    initData(id) {
        this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
            res => {
                this.data.list = res['matchings'];
                this.data.detail = this.getItem();
                this.data.detailAll = res;
                this.setValueForm();
            },
            err => {
            }
        );
    }

    setValueForm() {
        this.formvalue.patchValue(
            {
                m_ch_title: this.data.detail['m_ch_title'] && this.data.detail['m_ch_title'] != null ? this.data.detail['m_ch_title'] : '',
                m_ch_category: this.data.detail['m_ch_category'] && this.data.detail['m_ch_category'] != null ? this.data.detail['m_ch_category'] : '',
                m_ch_content: this.data.detail['m_ch_content'] && this.data.detail['m_ch_content'] != null ? this.data.detail['m_ch_content'] : '',
                m_ch_url: this.data.detail['m_ch_url'] && this.data.detail['m_ch_url'] != null ? this.data.detail['m_ch_url'] : '',
                sns_id: this.data.detail['sns_id'] && this.data.detail['sns_id'] != null ? this.data.detail['sns_id'] : '',
                m_ch_selected: this.data.detail['m_ch_selected'] && this.data.detail['m_ch_selected'] != null ? this.data.detail['m_ch_selected'] : '',
            }
        );

        this.rv_status = this.data.detail['review_status']['rv_status'];
        this.sns_id = this.data.detail['sns_id'];
    }

    getItem() {
        let obj = {};
        for (let i = 0; i < this.data.list.length; i++) {
            if (this.idMatching == this.data.list[i]['m_id']) {
                for (let j = 0; j < this.data.list[i]['matching_channel'].length; j++) {
                    if (this.idChannel == this.data.list[i]['matching_channel'][j]['m_ch_id']) {
                        obj = this.data.list[i]['matching_channel'][j];
                        break;
                    }
                }

            }
        }
        return obj;
    }

    backToList() {
        this.router.navigate([`admin/campaign/campaign-review-detail/${this.idCampaign}`], { queryParams: { idMatching: this.idMatching, idChannel: this.idChannel } });
    }

    getCategory() {
        this.campaginService.getData(`api/admin/codes?cdg_id=10`).subscribe(
            res => {
                this.dataBlind.category = res['data'];
            });
    }
    getItemChannel() {
        this.campaginService.getData(`api/admin/sns`).subscribe(
            res => {
                this.dataBlind.channels = res['data'];
            });
    }


    saveEdit() {
        if (this.formvalue.valid && this.idChannel) {
            // $('#divLoadingPage').show();

            let body = {
                m_ch_category: this.formvalue.value.m_ch_category,
                m_ch_content: this.formvalue.value.m_ch_content,
                m_ch_selected: this.formvalue.value.m_ch_selected,
                m_ch_title: this.formvalue.value.m_ch_title,
                m_ch_url: this.formvalue.value.m_ch_url,
                sns_id: this.formvalue.value.sns_id
            };
            this.campaginService.postData(`api/admin/campaigns/matchings/update-content-match/${this.idChannel}`, body).subscribe(
                res => {
                    // $('#divLoadingPage').hide();
                    this.toa.success('Update success');
                    this.backToList();
                },
                err => {
                    // $('#divLoadingPage').hide();
                    this.toa.error(err.error.message);
                }
            );
        }
    }
    navigate(value) {
        this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
    }
}
