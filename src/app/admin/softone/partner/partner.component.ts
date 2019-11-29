import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { PartnerService } from '../../softone/service/partner/partner.service';
import { RequestPartnerService } from '../../softone/service/request/partner/partner.service';
import { CommonService } from "../service/common.service";
import { MatCheckboxChange } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SoCSVService } from '../service/csv/csv.service';
import {ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material'
declare var $: any;

@Component({
    selector: 'app-admin-partner',
    templateUrl: './partner.component.html',
    styleUrls: [
        './partner.component.scss'
    ]
})
export class AdminPartnerComponent implements OnInit {
    public partners: any = [];
    public message: string;
    modalRef: BsModalRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    public partnerUser: any = [
        { name: "All", value: ''},
        { name: "User No", value: "pid" },
        { name: "Manager name", value: "pm_name" },
        { name: "Manager E-mail", value: "email" },
        { name: "Contact number", value: "pm_phone" },
        { name: "Company title", value: "pc_name" },
        { name: "Product title", value: "pc_brand" },
    ];
    public partnerTob: any = [];
    public groupCheckbox: any = [
        { name: "Matching", value: 59, checked: false },
        { name: "Ready", value: 60, checked: false },
        { name: "On-going", value: 61, checked: false },
        { name: "Closed", value: 62, checked: false },
    ];
    public partnerSearch: any = {
        filter: 'pid',
        filter_value: '',
        pc_tob: '',
        cp_status: []
    };
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public checkedAll: boolean = false;
    public keywords: any = {};
    public form: any = [];
    public brands: any = [];
    public formMess: any = [];
    public sendMessageTo: any = [];
    public chkArr: boolean[] = [false, false, false, false];
    public contentMessage: any = {};
    public page: any = {
        per_page: 10,
        current_page: 1
    };
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private partnerService: PartnerService,
        private requestPartnerService: RequestPartnerService,
        private common: CommonService,
        private csvService: SoCSVService,
        private modalService: BsModalService,

    ) {

    }

    ngOnInit() {
        this.getBrand();
        this.getPartners();
        this.getPartnerType();
        this.reset();
        this.form = new FormGroup({
            type_filter: new FormControl(this.partnerSearch['filter'], []),
            value_filter: new FormControl(this.partnerSearch['filter_value'], []),
            tob: new FormControl(this.partnerSearch['pc_tob'], []),
            status: new FormArray([])
        });
        this.formMess = new FormGroup({
            title: new FormControl(this.contentMessage.title, []),
            message: new FormControl(this.contentMessage.message, []),
        });
    }

    getBrand() {
        this.partnerService.getBrand().subscribe(res => {
          console.log(res)
          this.brands = res;
          
        })
        
      }

    getPartnerType() {
        this.partnerService.getTob().subscribe((res: any) => {
            console.log(res, 'RES')
            if (res) {

                res.code.map((item) => {
                    this.partnerTob.push({ name: item.cd_label, value: item.cd_id })
                })
            }
        })
    }

    getPartners() {
        this.partnerService.getPartners(undefined, 2).subscribe((res: any) => {
            this.partners = res;
            console.log(this.partners ,'test')
            for (let index = 0; index < this.partners.data.length; index++) {
                let brand = this.brands.filter(label =>label.CODE == this.partners.data[index]['pc_brand'])
                let dataBrand="";
                dataBrand=brand.length > 0 ? brand[0].CODE_NM : ""
                this.partners.data[index]['pc_brand'] = dataBrand
            }

        });
    }

    getLastestCampaignStatus(item) {
        //const lastItem = item.campaigns[item.campaigns.length - 1];
        if (item.last_campaign_status) {
            return item.last_campaign_status.cd_label;
        }
        return '-';
    }

    search(page?) {
        if (page === undefined) {
            page = 1;
        } else {
            page++;
        }
        let dataSearch: any = {
            cp_status: this.partnerSearch.cp_status,
            filter_value: this.partnerSearch.filter_value,
            filter: this.partnerSearch['filter'],
            pc_tob: this.partnerSearch.pc_tob,
            page
        }

        this.partnerService.search(dataSearch).subscribe((res: any) => {
            console.log(res);
            this.partners = res;
            this.page = {
                ...this.page,
                current_page: page
            }
        });
    }

    goPage(page) {
        console.log(page)
        this.search(page.offset)
    }
    //   itemCheckBox(){
    //       return   this.groupCheckbox
    //       .filter(opt => opt.checked==true);
    // // console.log(this.partnerSearch);
    //   }
    //
    //
    //   isCheckedAll(){
    //       if(this.partnerSearch.status.length == 4) return true;
    //       return false;
    //   }
    //
    chkAllChange(event: MatCheckboxChange) {
        if (event.checked) {
            this.chkArr = this.chkArr.map(m => true);
            this.partnerSearch.cp_status = ['59', '60', '61', '62'];
        }
        else {
            this.chkArr = this.chkArr.map(m => false);
            this.partnerSearch.cp_status = [];
        }

    }

    // isChecked(i){
    //     if(!i) return true;
    //     if(this.partnerSearch.cp_status.indexOf(i) < 0){
    //         return false
    //     }
    //     return true
    // }

    checkBox(e) {
        let id = e.source._inputElement.nativeElement.value;


        let index = this.partnerSearch.cp_status.indexOf(id);
        if (index < 0) {
            this.partnerSearch.cp_status.push(id)
        } else {
            this.partnerSearch.cp_status.splice(index, 1)
        }
        console.log('checkBox', this.partnerSearch)

        if (this.partnerSearch.cp_status.length == 4) {
            this.checkedAll = true;
        }
    }

    reset() {
        this.partnerSearch = {
            filter: 'pid',
            filter_value: '',
            pc_tob: '',
            cp_status: []
        }
        this.groupCheckbox = [
            { name: "Matching", value: 59, checked: false },
            { name: "Ready", value: 60, checked: false },
            { name: "On-going", value: 61, checked: false },
            { name: "Closed", value: 62, checked: false },
        ]

        this.chkArr = this.chkArr.map(m => false);
        this.partnerSearch.cp_status = [];
        this.checkedAll = false;
        console.log(this.checkedAll, 'all check');
        this.getPartners();
    }

    getKeywords() {
        this.partnerService.getKeywords().subscribe((res: any) => {
            {
                this.keywords = res;
                console.log(this.keywords.code);
            }
        });
    }

    actionDisable(id) {
        let ids = [id];
        this.partnerService.disable(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }
    actionEnable(id) {
        let ids = [id];
        this.partnerService.enable(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }
    actionDelete() {
        console.log(this.selected, 'actionDELTTE')
        let deleteItems =[...this.selected];
        console.log(deleteItems, 'delete');
        this.selected = []
        let ids = deleteItems.map((item) => {
            return item.pid
        })
        this.partnerService.delete(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }

    onSelect({ selected }) {
        console.log(selected, 'onSLECTE')
        this.selected = selected
        this.sendMessageTo = [];
        for (const item of selected) {
            this.sendMessageTo.push({ fullname: item.pm_name, pid: item.pid });
        }
    }

    openModal(template: TemplateRef<any>) {
        this.contentMessage = {
            title: '',
            message: ''
        };
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }

    removeChecked(pid) {
        this.sendMessageTo = this.sendMessageTo.filter(function (value, index, arr) {
            return value.pid != pid;
        });
        this.selected = this.selected.filter((item) => {
            return item.pid != pid
        });
        console.log(this.sendMessageTo);
    }

    sendMessageFistar() {
        if (this.sendMessageTo.length > 0) {
            let ids = this.sendMessageTo.map((item) => {
                return item.pid
            })

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

                this.sendMessageTo = [];
                this.selected = [];
            })

        } else {
            this.modalRef.hide();
            this.toast.error("Please select partner");
        }
    }

    dowloadCSV() {
        let CSVData = [];
        let dataSearch: any = {
            cp_status: this.partnerSearch.cp_status,
            filter_value: this.partnerSearch.filter_value,
            filter: this.partnerSearch['filter'],
            pc_tob: this.partnerSearch.pc_tob,
            pc_state: 2,
            download: true
        }

        this.partnerService.search(dataSearch).subscribe((res: any) => {
            console.log(res);
            if (res.data && res.data.length > 0) {
                res.data.map((item) => {
                    CSVData.push({
                        'PID': item.pid,
                        'Campany Name': item.pc_name,
                        'Manager': item.pm_name,
                        'Manager email': item.email,
                        'Manager phone': item.pm_phone,
                        'Business type': item.type.cd_label,
                        'Brand': item.pc_brand
                    })
                })
                let options = {
                    fieldSeparator: ',',
                    quoteStrings: '',
                    decimalseparator: '.',
                    useBom: true,
                    headers: [
                        'PID',
                        'Campany Name',
                        'Manager',
                        'Manager email',
                        'Manager phone',
                        'Business type',
                        'Brand'
                    ]
                };
                this.csvService.dowloadCSV(CSVData, 'Partners', options);
            } else {
                this.toast.error("Nothing to export")
            }
        });

    }

    closeMyMenu() {
        this.trigger.closeMenu();
    }
}
