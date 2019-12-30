
import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';;
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PartnerService } from '../../../softone/service/partner/partner.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';
import { CoreEnvironment } from '@angular/core/src/render3/jit/compiler_facade_interface';
declare var $: any;

@Component({
    selector: 'app-admin-partner-history',
    templateUrl: './history.component.html',
    styleUrls: [
        './history.component.scss'
    ]
})
export class AdminPartnerCampaignHistoryComponent implements OnInit {
    public partners: any = [];
    public message: string;
    public selected = [];
    public env: any = environment;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public id: string;
    public totalCampaign: number;
    public arr: any = [];
    public campaign: any;
    public rowCampaign: any;
    modalRef: BsModalRef;
    public contentMessage: any = {};
    public form: any = {};
    public partner: any = {};
    public totalPrice: Number = 0;
    public active: any = true;
    public totalAllCampaign: Number = 0;
    public history: any = [];
    public campaignId: any = [];
    @ViewChild('lgModal') lgModal;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private partnerService: PartnerService,
        private activeRoute: ActivatedRoute,
        private commonService: CommonService,
    ) {

    }

    ngOnInit() {

        this.form = new FormGroup({
            title: new FormControl(this.contentMessage.title, []),
            message: new FormControl(this.contentMessage.message, []),
        });
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.getTotalCampaign();
        this.getPartner();
        // console.log(this.partners, 'PARTNER')

    }
    openModal(template: TemplateRef<any>, campaign: any) {
        this.getCampaign(campaign);
        this.rowCampaign = campaign;
        console.log(this.rowCampaign.cp_name, 'rowCampaign');
        this.lgModal.show();
        $(".modal").addClass('disable');

    }
    getPartner() {
        // console.log('getPartner')
        this.partnerService.getPartnerUpdate(this.id).subscribe((res: any) => {
            this.partners = res.data; console.log(this.partners, 'history');
            this.partners.forEach(element => {
                if (element.cp_status == 59)
                    this.totalAllCampaign = Number(this.totalAllCampaign) + Number(element.total_cost_selected.estimated_cost);
                else
                    this.totalAllCampaign = Number(this.totalAllCampaign) + Number(element.total_cost_selected.total_cost);
            });
            // console.log(res, 'RESSSSS');
        });
        this.partnerService.getPartner(this.id).subscribe((res: any) => {
            this.partner = res;
            //console.log(res, 'RESSSSS');

        });
    }
    getTotalCampaign() {
        this.partnerService.getTotalCampaign(this.id).subscribe((res: any) => {

            this.arr = Object.values(res);
            this.totalCampaign = this.arr[0] + this.arr[1] + this.arr[2] + this.arr[3];


        });
    }
    searchCampaign(cp_status){
        this.partnerService.searchCampaign(this.id,cp_status).subscribe((res:any)=>{
            console.log(res,'ok');
            this.partners = res.data;
        })
    }
    getCampaign(campaign) {
        this.partnerService.getCampaign(campaign.cp_id).subscribe((res: any) => {
            // console.log(res);
            this.campaign = res.data;
            let history = [];
            this.campaign.map((items,index) => {
                this.campaign[index].top = '';
                this.campaign[index].bottom = '';
                items.matching_history.map((item, i)=> {
                    if(item.m_status == 1 || item.m_status == 9) {
                        this.campaign[index].top = item;
                    }
                    if(item.m_status == 8 || item.m_status == 16) {
                        this.campaign[index].bottom = item;
                    }
                })
                // this.campaign[index].top = null;
                // history.push(topHistory);
            })

            this.history = history;
            // console.log(history, 'historyyyyyy mapsss');
            console.log(this.campaign, 'campaign');
        })
    }

    rowClass(row) {
        //console.log(row, "ROW CLASS")
        if (row.cp_status && row.cp_status == 59) return 'bgmatching';
        // else return '';
        //return '';
    }

    openModalMess(template: TemplateRef<any>) {
        this.contentMessage = {
            title: '',
            message: ''
        };
        this.modalRef = this.modalService.show(template);
    }
    sendMessage() {
        // console.log(this.partners, 'SENDMESSS')    
        let ids = [this.id]
        let data = {
            pids: ids,
            notice_title: this.contentMessage.title,
            notice_message: this.contentMessage.message,
            notice_writer: this.cookieService.get('user').reg_name,
            notice_type: 2,
            notice_state: 1
        }
        this.partnerService.sendMessage(data).subscribe((res: any) => {
            this.modalRef.hide();
            this.toast.success("Send message successfull", '', {
                timeOut: 1000
            });
        })
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
        console.log(this.campaignId);
    }

    checkDelete() {
        console.log(this.selected);
        if (this.selected.length > 0) return false;
        return true;
    }

    getAge(dob) {
        // return moment.utc(dob).month(0).from(moment.utc().month(0))
        return moment.utc().diff(moment.utc(dob), 'years')
        //  return moment(dob).month(0).from(moment().month(0))
    }
    delete(){
        console.log(this.selected, 'select delete')
        let ids = this.selected.map(item=>(item.cp_id))
        console.log(ids)
        this.partnerService.deleteCampaign(ids).subscribe((res:any) => {
            console.log(res);
            this.getPartner();
        })
    }
   
}
