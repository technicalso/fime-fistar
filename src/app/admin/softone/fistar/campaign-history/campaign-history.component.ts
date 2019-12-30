
import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';;
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FistarService } from '../../service/fistar/fistar.service';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { CommonService } from '../../service/common.service';
declare var $: any;

@Component({
    selector: 'app-admin-fistar',
    templateUrl: './campaign-history.component.html',
    styleUrls: [
        './campaign-history.component.scss'
    ]
})
export class AdminFistarCampaignHistoryComponent implements OnInit {
    public fistar: any = {};
    public id: string;
    public totalRelation: number = 0;
    public totalTry: number = 0;
    public arrRelation: any = [];
    public arrTry: any = [];
    public campaign: any;
    public staticCount: any = {};
    m_status: any;
    public scrap: any = {};
    modalRef: BsModalRef;
    public contentMessage: any = [];
    public form: any = {};
    m_id: any;
    listHistory: any;
    scrapData: any;
    lastestHistory: any;
    ascHitory: any;
    public selectedScrap = [];
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private fistarService: FistarService,
        private toa: ToastrService,
        private activeRoute: ActivatedRoute,
        private commonService: CommonService,
        private campaginService: HttpClientAdminService,
    ) {

    }

    ngOnInit() {
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.getMatchings();
        this.getScrap();
        this.form = new FormGroup({
            title: new FormControl(this.contentMessage.title, []),
            message: new FormControl(this.contentMessage.message, []),
        });

    }
    openModal(template: TemplateRef<any>, row: any) {
        this.campaign = row.campaign;
        this.m_status = row.matching_status.m_status;
        this.m_id = row.m_id;
        this.listHistory = row.matching_history;
        this.lastestHistory = row.matching_history && row.matching_history[0] ? row.matching_history[0] : null;
        this.ascHitory = row.matching_history[row.matching_history.length - 1];
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }

    updateDoingStatus(m_id, m_status) {
        this.campaginService.postData(`api/admin/update-doing-status/${m_id}?type=match`, { m_status: m_status, type: 'match' }).subscribe(
            data => {
                this.toa.success('Update status successfully');
                this.modalRef.hide();
                this.getMatchings();
            },
            err => {
                this.toa.error(err.error.message);
            }
        );
    }

    openModalMess(template: TemplateRef<any>) {
        this.contentMessage = {
            title: '',
            message: ''
        };
        this.modalRef = this.modalService.show(template);
    }
    sendMessage() {
        let ids = [this.fistar.uid]
        let data = {
            uids: ids,
            notice_title: this.contentMessage.title,
            notice_message: this.contentMessage.message,
            notice_writer: this.cookieService.get('user').reg_name,
            notice_type: 1,
            notice_state: 1
        }
        this.fistarService.sendMessageToFistar(data).subscribe((res: any) => {
            this.modalRef.hide();
            this.toast.success("Send message successfull", '', {
                timeOut: 1000
            });
        })
    }



    getMatchings() {
        this.fistarService.getFistar(this.id).subscribe((res: any) => {
            this.fistar = res;
            console.log(this.fistar,'test fistar');
            this.fistar.matchings.map((matching, iMatching) => {
                let newHistory = [];
                matching.matching_history.map((history, iHistory) => {
                    newHistory[matching.matching_history.length - (1 + iHistory)] = history;
                })
                this.fistar.matchings[iMatching].matching_history = newHistory;
            })
            this.getRelative();
            this.arrRelation = Object.values(this.fistar.count_campaign_relate.cp_status);
            this.arrTry = Object.values(this.fistar.count_campaign_relate.m_status);
            for (let i = 0; i < this.arrRelation.length; i++) {
                this.totalRelation = this.totalRelation + this.arrRelation[i];
            }

            for (let i = 0; i < this.arrTry.length; i++) {
                this.totalTry = this.totalTry + this.arrTry[i];
            }
        });
    }
    onSelect({ selected }) {
        // this.selected.splice(0, this.selected.length);
        // this.selected.push(...selected);
        // console.log(this.selected);
        // this.totalPrice = 0;
        // this.campaignId = [];
        // for (const item of selected) {
        //     this.totalPrice = Number(this.totalPrice) + Number(item.cp_campaign_price);
        //     this.campaignId.push(item.cp_id)
        // }
        // console.log(this.totalPrice);
        console.log(selected);
        this.selectedScrap = selected;
    }
    getScrap(){
        this.fistarService.getScrap(this.id).subscribe((res:any) => {
            this.scrap = res.data;
            console.log(this.scrap);
            this.scrapData = this.scrap;
         
        });
    }

    deleteScrap(){
        console.log(this.selectedScrap, 'select delete')
        let ids = this.selectedScrap.map(item=>(item.cp_id))
        console.log(ids,'value');
        this.fistarService.deleteScrap(ids,this.id).subscribe((res:any) => {
            this.getScrap();
            this.getMatchings();
            this.selectedScrap = [];
            this.modalRef.hide();
        })
       
    }
    getRelative() {
        let status_matching = (this.fistar.count_campaign_relate && this.fistar.count_campaign_relate.cp_status && this.fistar.count_campaign_relate.cp_status['59']) ? parseInt(this.fistar.count_campaign_relate.cp_status['59']) : 0

        let status_ready = (this.fistar.count_campaign_relate && this.fistar.count_campaign_relate.cp_status && this.fistar.count_campaign_relate.cp_status['60']) ? parseInt(this.fistar.count_campaign_relate.cp_status['60']) : 0

        let status_ongoing = (this.fistar.count_campaign_relate && this.fistar.count_campaign_relate.cp_status && this.fistar.count_campaign_relate.cp_status['61']) ? parseInt(this.fistar.count_campaign_relate.cp_status['61']) : 0

        let status_closed = (this.fistar.count_campaign_relate && this.fistar.count_campaign_relate.cp_status && this.fistar.count_campaign_relate.cp_status['62']) ? parseInt(this.fistar.count_campaign_relate.cp_status['62']) : 0

        let total_relation = status_matching + status_ready + status_ongoing + status_closed;
        let status_apply = 0;
        let status_request = 0;
        let status_reject = 0;
        let recommended = this.fistar.count_campaign_relate.recommend;
        let scrap = this.fistar.count_campaign_relate.scrap;
        if (this.fistar.count_campaign_relate && this.fistar.count_campaign_relate.m_status) {
            status_apply += this.fistar.count_campaign_relate.m_status['9'] ? parseInt(this.fistar.count_campaign_relate.m_status['9']) : 0;
            status_apply += this.fistar.count_campaign_relate.m_status['12'] ? parseInt(this.fistar.count_campaign_relate.m_status['12']) : 0;
            status_apply += this.fistar.count_campaign_relate.m_status['14'] ? parseInt(this.fistar.count_campaign_relate.m_status['14']) : 0;
            status_apply += this.fistar.count_campaign_relate.m_status['16'] ? parseInt(this.fistar.count_campaign_relate.m_status['16']) : 0;

            status_request += this.fistar.count_campaign_relate.m_status['1'] ? parseInt(this.fistar.count_campaign_relate.m_status['1']) : 0;
            status_request += this.fistar.count_campaign_relate.m_status['4'] ? parseInt(this.fistar.count_campaign_relate.m_status['4']) : 0;
            status_request += this.fistar.count_campaign_relate.m_status['6'] ? parseInt(this.fistar.count_campaign_relate.m_status['6']) : 0;
            status_request += this.fistar.count_campaign_relate.m_status['7'] ? parseInt(this.fistar.count_campaign_relate.m_status['7']) : 0;
            status_request += this.fistar.count_campaign_relate.m_status['8'] ? parseInt(this.fistar.count_campaign_relate.m_status['8']) : 0;

            status_reject += this.fistar.count_campaign_relate.m_status['3'] ? parseInt(this.fistar.count_campaign_relate.m_status['3']) : 0;
            status_reject += this.fistar.count_campaign_relate.m_status['5'] ? parseInt(this.fistar.count_campaign_relate.m_status['5']) : 0;
            status_reject += this.fistar.count_campaign_relate.m_status['11'] ? parseInt(this.fistar.count_campaign_relate.m_status['11']) : 0;
            status_reject += this.fistar.count_campaign_relate.m_status['13'] ? parseInt(this.fistar.count_campaign_relate.m_status['13']) : 0;
        }

        let total_try = status_apply + status_reject + status_request
        this.staticCount = {
            total_relation,
            total_try,
            status_matching,
            status_ongoing,
            status_ready,
            status_closed,
            status_apply,
            status_request,
            status_reject,
            recommended,
            scrap
        }
    }

}
