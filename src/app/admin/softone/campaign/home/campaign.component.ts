import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CSVService } from '../../../shared/service/csv.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';
import * as moment from "moment";
import { CampaignService } from '../../service/campaign/campaign.service';

@Component({
    selector: 'app-admin-campaign',
    templateUrl: './campaign.component.html',
    styleUrls: ['./campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public env: any = environment;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    isSearch = false;
    pathCurrent;
    // TUAN DEV
    data = {
        header: [
            'Id',
            'Company',
            'Cover',
            'Campaign Name',
            'State',
            'Category',
            'Brand',
            'Try Period',
            'fime/fiStar',
            'Type',
            'History',
            'Action'
        ],
        list: [],
        total_page: 0,
        page: 1,
        defaultList: []
    };

    dataBlind = {
        channels: [],
        category: [],
        brands: [],
        channelID: '',
        categoryID: '',
        brandID: '',
        typeID: '',
        campainID: '',
        // campainStatus: {
        //     new: '',
        //     apr: '',
        //     disabled: ''
        // },
        campainStatus: [],
        input_field_title: '',
        period: {
            start: '',
            end: ''
        }
    };
    brands:any=[];

    dataPost = {
        arrayDelete: []
    };
    selectedCount = 0;
    totalItem = 0;
    showHistoryPayment = false;
    dataHistoryReview = [];
    titleReviewPayment = '';
    nameHistoryCampaign = '';
    titleHistoryCampaign = '';


    constructor(
        private campaignService: HttpClientAdminService,
        private campaignServiceGet:CampaignService,
        private activerou: ActivatedRoute,
        private router: Router,
        private csvService: CSVService,
        private toa: ToastrService,
        private commonService: CommonService
    ) {

    }

    ngOnInit() {
        this.getBrandGet();
        this.env = environment;
        this.activerou.queryParams.subscribe(
            params => {
                this.isSearch = false;
                if (params.page) {
                    if (this.pathCurrent) {
                        this.initData(params.page, this.pathCurrent);
                    } else {
                        this.initData(Number(params.page));
                    }
                } else {
                    this.initData(1);
                }
            }
        );
        this.getItemChannel();
        this.getCategory();
        this.getBrand();
        
    }

    getCategory() {
        this.campaignService.getData(`api/admin/codes?cdg_id=10`).subscribe(
            res => {
                this.dataBlind.category = res['data'];
            });
    }
    getItemChannel() {
        this.campaignService.getData(`api/admin/sns`).subscribe(
            res => {
                this.dataBlind.channels = res['data'];
            });
    }

    getBrand() {
        this.campaignService.getData(`api/admin/codes?cdg_id=15`).subscribe(
            res => {
                    console.log(res)
                this.dataBlind.brands = res['data'];
            });
    }
    getBrandGet() {
        this.campaignServiceGet.getBrand().subscribe(res => {
          console.log(res)
          this.brands = res;
          
        })
        
      }

    reloadDataFromChild(event) {
        this.initData(this.data.page);
    }

    initData(page, path?) {
        this.campaignService.getData(path ? `api/admin/campaigns?${path}&page=${page}` : `api/admin/campaigns?page=${page}`).subscribe(
            res => {
                this.totalItem = res['total'];
                this.data.list = this.convertData(res['data']);
                this.data.page = page;
                this.data.total_page = res['total'];
                this.data.defaultList = res['data'];

            },
            err => {
                console.log(err);
            }
        );
    }
    convertData(data) {
        // tslint:disable-next-line:prefer-const
        let arr = [];
        console.log(data)
        for (let index = 0; index < data.length; index++) {
            
            
            let brand = this.brands.filter(label =>label.CODE == data[index]['cp_brand'])
           
            let dataBrand="";
            dataBrand=brand.length > 0 ? brand[0].CODE_NM : ""
           
            let obj = {
                id: data[index]['cp_id'],
                main: data[index],
                controls: [
                    { value: 'Campaign Edit', link: `/admin/campaign/edit/${data[index]['cp_id']}` },
                    { value: 'Matching fiStar', link: `/admin/campaign/matching-fistar/${data[index]['cp_id']}` },
                    { value: 'fiStar Review', link: `/admin/campaign/campaign-review/${data[index]['cp_id']}` },
                    { value: 'Campaign Report', link: `/admin/campaign/campaign-report/${data[index]['cp_id']}` },
                    { value: 'Payment', link: `/admin/campaign/campaign-payment/${data[index]['cp_id']}` },
                    { value: 'Comments', link: '/admin/comments/try/' + data[index]['cp_try_id'] },
                    { value: 'Reviews', link: '/admin/reviews/try/' + data[index]['cp_try_id'] },
                    { value: 'Winners', link: '/admin/winner/try/' + data[index]['cp_try_id'] },
                    {
                        value: data[index]['cp_state'] == 2 ? 'Enabled' : 'Disabled',
                        action: data[index]['cp_state'] == 2 ? 'enabledCampaign' : 'disabledCampaign', id: data[index]['cp_id']
                    },
                ],
                content: [
                    { title: data[index]['cp_id'] },
                    { title: data[index]['partner']['pc_name'], bold: true, link: '/admin/partner/information/'+data[index]['partner']['pid'], target:'_blank' },
                    { image: this.commonService.getCampaignThumb(data[index]), link: '/admin/campaign/edit/'+data[index]['cp_id'], target:'_blank' },
                    { title: data[index]['cp_name'], underline: true, link: '/admin/campaign/edit/'+data[index]['cp_id'], target:'_blank' },
                    {
                        title: data[index]['cp_status'] === 59 ? 'Matching' :
                            data[index]['cp_status'] === 60 ? 'Ready' :
                                data[index]['cp_status'] === 61 ? 'On-going' : 'Closed'
                    },
                    { title: data[index]['category']['cd_label'] },
                    // { title: data[index]['cp_brand'], bold: true },
                    { title: dataBrand },
                    { title: data[index]['cp_period_start'], title_second: data[index]['cp_period_end'] },
                    {
                        title: data[index]['fime'] + '/' + data[index]['cp_total_influencer'],
                        social: true, channel: this.getDistinct_channel(data[index]['distinct_channel'])
                    },
                    { title: data[index]['cp_type'] === 1 ? 'Paid' : 'Free' },
                    { title: 'View', underline: true, modalView: true, dataModal: { cp_id: data[index]['cp_id'], cp_status: data[index]['cp_status'], name: data[index]['partner']['pc_name'], title: data[index]['cp_name'] } }
                ]
            };

            arr.push(obj);
        }

        return arr;
    }

    getDistinct_channel(array) {
        let arr = [];
        array.forEach(element => {
            arr.push(element['sns_id']);
        });
        return arr;
    }

    handleChangeEndDate() {
        let startDate = '';
        let endDate = '';

        if (this.dataBlind.period.start) {
            // tslint:disable-next-line:max-line-length
            let monthStart = this.dataBlind.period.start['_i']['month'] + 1;
            monthStart = monthStart >= 10 ? monthStart : '0' + monthStart;

            let dateStart = this.dataBlind.period.start['_i']['date'];
            dateStart = dateStart >= 10 ? dateStart : '0' + dateStart;

            startDate = `${this.dataBlind.period.start['_i']['year']}-${monthStart}-${dateStart}`;
            let monthEnd = this.dataBlind.period.end['_i']['month'] + 1;
            monthEnd = monthEnd >= 10 ? monthEnd : '0' + monthEnd;

            let dateEnd = this.dataBlind.period.end['_i']['date'];
            dateEnd = dateEnd >= 10 ? dateEnd : '0' + dateEnd;
            // tslint:disable-next-line:max-line-length
            endDate = `${this.dataBlind.period.end['_i']['year']}-${monthEnd}-${dateEnd}`;
            let stardate = moment(startDate);
            let enddate = moment(endDate);
            if (stardate > enddate) {
                this.dataBlind.period.end = '';
                this.toa.error('The start date may not be greater than end date.');
            }
        }
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
        this.dataPost.arrayDelete = [];
        if (this.isSearch) {
            this.initData(page, this.pathCurrent);
        } else {
            this.router.navigate([`/admin/campaign/`], { queryParams: { page: page } });
        }
    }


    getChannelDetails(value) {
        this.dataBlind.channelID = value;
    }

    getBrandDetails(value) {
        this.dataBlind.brandID = value;
    }

    getCategoryDetails(value) {
        this.dataBlind.categoryID = value;
    }

    getTypeDetail(value) {
        this.dataBlind.typeID = value;

    }

    getCampainDetail(value) {
        this.dataBlind.campainID = value;
    }

    campainStatus(value, event) {
        if (event.target.checked) {
            if (value) {
                if (this.dataBlind.campainStatus.indexOf(value) === -1) {
                    this.dataBlind.campainStatus.push(value);
                    this.resetCheckAllCampaign();
                }
            } else {
                this.dataBlind.campainStatus = [];
                this.resetCampainStatus();
            }
        }
        else {
            const index = this.dataBlind.campainStatus.indexOf(value);
            this.dataBlind.campainStatus.splice(index);
        }
    }

    resetCampainStatus() {
        let iclCheck = document.getElementsByClassName('campain_state');
        for (let index = 0; index < iclCheck.length; index++) {
            (iclCheck[index] as HTMLInputElement).checked = false;
        }
    }

    resetCheckAllCampaign() {
        let allCheck = document.getElementById('all') as HTMLInputElement;
        allCheck.checked = false;
    }

    getFieldTitle(value) {
        this.dataBlind.input_field_title = value;
    }

    reset() {
        this.dataBlind.campainID = '';
        this.dataBlind.channelID = '';
        this.dataBlind.categoryID = '';
        this.dataBlind.brandID = '';
        this.dataBlind.typeID = '';
        this.dataBlind.campainID = '';
        this.dataBlind.campainStatus = [];
        this.dataBlind.input_field_title = '';
        this.dataBlind.period = {
            start: '',
            end: ''
        };
        let allCheck = document.getElementById('all') as HTMLInputElement;
        allCheck.checked = false;
        let iclCheck = document.getElementsByClassName('campain_state');
        for (let index = 0; index < iclCheck.length; index++) {
            (iclCheck[index] as HTMLInputElement).checked = false;
        }
        this.pathCurrent = null;
        this.isSearch = false;
        this.initData(1);
    }

    search() {
        this.isSearch = true;
        this.data.list = [];
        let startDate = '';
        let endDate = '';

        if (this.dataBlind.period.start) {
            // tslint:disable-next-line:max-line-length
            let monthStart = this.dataBlind.period.start['_i']['month'] + 1;
            monthStart = monthStart >= 10 ? monthStart : '0' + monthStart;

            let dateStart = this.dataBlind.period.start['_i']['date'];
            dateStart = dateStart >= 10 ? dateStart : '0' + dateStart;

            startDate = `${this.dataBlind.period.start['_i']['year']}-${monthStart}-${dateStart}`;
        }
        if (this.dataBlind.period.end) {
            let monthEnd = this.dataBlind.period.end['_i']['month'] + 1;
            monthEnd = monthEnd >= 10 ? monthEnd : '0' + monthEnd;

            let dateEnd = this.dataBlind.period.end['_i']['date'];
            dateEnd = dateEnd >= 10 ? dateEnd : '0' + dateEnd;
            // tslint:disable-next-line:max-line-length
            endDate = `${this.dataBlind.period.end['_i']['year']}-${monthEnd}-${dateEnd}`;
        }
        // tslint:disable-next-line:max-line-length
        let status = ''
        if (this.dataBlind.campainStatus.length > 0) {
            for (let i = 0; i < this.dataBlind.campainStatus.length; i++) {
                if (i != this.dataBlind.campainStatus.length - 1) {
                    status += "status[]=" + this.dataBlind.campainStatus[i] + "&"
                } else {
                    status += "status[]=" + this.dataBlind.campainStatus[i];
                }
            }
        } else {
            status = "status"
        }

        let stardate = moment(startDate);
        let enddate = moment(endDate);
        if (stardate > enddate) {
            this.dataBlind.period.end = '';
            this.toa.error('The start date may not be greater than end date.');
        }
        let path = `campaign=${this.dataBlind.campainID}&keyword=${this.dataBlind.input_field_title}&brand=${this.dataBlind.brandID}&categories=${this.dataBlind.categoryID}&cp_type=${this.dataBlind.typeID}&channel=${this.dataBlind.channelID}&${status}&start_day=${startDate}&end_day=${endDate}`;
        this.pathCurrent = path;
        this.router.navigate(['/admin/campaign']);
        this.initData(1, path);
    }

    deleteItem() {

        let r = confirm('Do you want delete campaign?');
        if (r == true) {
            if (this.dataPost.arrayDelete.length > 0) {
                const body = {
                    cp_ids: this.dataPost.arrayDelete
                };
                this.campaignService.postData('api/admin/delete-many/campaign', body).subscribe(
                    res => {
                        if (res['success']) {
                            this.initData(this.data.page);
                            this.toa.success('Update success');
                        }
                        this.dataPost.arrayDelete = [];
                    },
                    err => {
                        this.toa.error(err.error.message);
                    }
                );
            }
        }
    }

    dowloadCSV() {
        let options = {
            fieldSeparator: ',',
            quoteStrings: '',
            decimalseparator: '.',
            useBom: true,
            headers: ['Id',
                'Company',
                'Cover',
                'Name',
                'State',
                'Category',
                'Brand',
                'Try Period Start',
                'Try Period Start',
                'Type']
        };
        if (this.pathCurrent) {
            this.campaignService.getData(`api/admin/campaigns?${this.pathCurrent}&paginate=10000000`).subscribe(res => {

                this.csvService.downloadCampaign(res['data'], 'Campaign', options);
            }, err => {
                console.log(err);
            })
        } else {
            this.campaignService.getData(`api/admin/campaigns?paginate=10000000`).subscribe(res => {

                this.csvService.downloadCampaign(res['data'], 'Campaign', options);
            }, err => {
                console.log(err);
            })
        }

    }

    viewModal(evt) {
        this.showHistoryPayment = true;
        this.nameHistoryCampaign = evt.name;
        this.titleHistoryCampaign = evt.title;
        let cp_id = evt.cp_id;
        this.campaignService.getData(`api/admin/campaigns/history/step/${cp_id}`).subscribe(
            res => {
                this.dataHistoryReview = this.converDataHistory(res['data'], evt);
            },
            err => {
                console.log(err);
            });
    }

    close(evt) {
        this.showHistoryPayment = evt;
        this.dataHistoryReview = [];
    }

    converDataHistory(data, evt) {
        let cp_status = evt.cp_status;
        let arr = [];

        _.forEach(data, (item) => {
            if (cp_status == 59) {
                _.forEach(item['matching_history'], (it) => {
                    let body = {
                        description: it['label']['description'],
                        fistar_status: it['label']['fistar_status'],
                        created_at: it['created_at'],
                        updated_at: it['updated_at'],
                    }
                    arr.push(body);
                });
            } else {
                // let influencer_name = item['uid'];
                let influencer_name = item['influencer']['fullname'];
                _.forEach(item['matching_channel'], (it) => {
                    _.forEach(it['history_review'], (it_child) => {
                        let body = {
                            description: it_child['label']['description'],
                            fistar_status: it_child['label']['fistar_status'],
                            created_at: it_child['created_at'],
                            updated_at: it_child['updated_at'],
                            user: it_child['rv_user'],
                            type: it_child['rv_type'],
                            partner: evt.name,
                            influencer: influencer_name
                        }
                        arr.push(body);
                    });
                });
            }
        });
        return arr;
    }

    onKeydown(event) {
        if (event.key === "Enter") {
            this.search();
        }
    }


}
