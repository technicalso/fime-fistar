import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FistarService } from '../service/fistar/fistar.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../admin/softone/service/common.service';
import { SoCSVService } from '../service/csv/csv.service';
declare var $: any;

@Component({
    selector: 'app-admin-fistar',
    templateUrl: './fistar.component.html',
    styleUrls: [
        './fistar.component.scss'
    ]
})
export class AdminFistarComponent implements OnInit {
    public fistars: any = [];
    public message: string;
    modalRef: BsModalRef;
    public page: any = {};
    public acctionSearch = false;
    public selected = [];
    public env: any = environment;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public sendMessageTo: any = [];
    public form: any;
    public gender: any = [];
    public age: any = [];
    public location: any = [];
    public followers: any = [];
    public channel: any = [];
    public category: any = [];
    public checkedAll: boolean = false;
    public follower: Number;
    selectedDefault = 'all';

    public fistarUserFieldList = [
        { field: 'keyword', label: 'All' },
        { field: 'id', label: 'Display Name' },
        { field: 'uid', label: 'User No' },
        { field: 'email', label: 'Email' },
        { field: 'phone', label: 'Phone' },
        { field: 'fullname', label: 'Full Name' }
    ];
    public groupCheckbox: any = [
        { name: "Matching", value: 59, checked: false },
        { name: "Ready", value: 60, checked: false },
        { name: "On-going", value: 61, checked: false },
        { name: "Closed", value: 62, checked: false },
    ];
    public fistarSearch: any = [
    ];


    public contentMessage: any = [];
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private fistarService: FistarService,
        private modalService: BsModalService,
        private commonService: CommonService,
        private csvService: SoCSVService
    ) {

    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(this.contentMessage.title, []),
            message: new FormControl(this.contentMessage.message, []),
        });

        this.resetForm();

        this.getFistars();
        this.getGender();
        this.getAgeRange();
        this.getCategory();
        this.getLocation();
        this.getFollower();
        this.getChannel();
    }


    getFistars(page?) {
        this.acctionSearch = false;
        this.fistarService.getFistars(page, 2).subscribe((res: any) => {
            this.page = res;
            this.fistars = res.data;
            //console.log(res.data, 'beforeeeeeee');
            this.fistars.map((item, index) => {
                var total = 0;
                item.channels.map((itemChannel) => {
                    total += itemChannel.usn_follower;
                })
                this.fistars[index].totalFollower = total;
            })
            //console.log(this.fistars, 'affterrrrrrrrrrr');
        });
    }

    setPage(pageInfo) {
        if (this.acctionSearch) {
            this.search(pageInfo.offset);
        } else {
            this.getFistars(pageInfo.offset);
        }
    }

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    openModal(template: TemplateRef<any>) {
        this.contentMessage = {
            title: '',
            message: ''
        };
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }

    onSelect({ selected }) {
        //console.log(selected,'fdf');
        this.sendMessageTo = [];
        for (const item of selected) {
            this.sendMessageTo.push({ fullname: item.fullname, uid: item.uid });
        }
    }

    getSNSCost(item, sns, isHtml = true) {
        let y = item.filter((i) => {
            return i.sns_id == sns
        })
        let x = y.map((i) => {
            return i
        })
        let html
        
        if(isHtml){
            if(x[0] && x[0].cost && x[0].sns_url){
                html = `<div class="sns_cost"><a href="${x[0].sns_url}" target="_blank"><img src="/assets//softone//sns//${sns}.png"><span>${this.commonService.parseLargeMoney(parseInt(x[0].cost))}</span></a></div>`
            }else{
                if(x[0] && x[0].sns_url){
                    html = `<div class="sns_cost"><a href="${x[0].sns_url}" target="_blank"><img src="/assets//softone//sns//${sns}.png"><span>-</span></a></div>`
                }else{
                    html = `<div class="sns_cost"><img class='gray' src="/assets//softone//sns//${sns}.png"><span>-</span></div>`
                }
                
            }
            return html;
        } else {
            if (x[0] && x[0].cost) {
                return this.commonService.parseLargeNum(parseInt(x[0].cost))
            } else {
                return 0
            }
        }

        //}

    }

    renderCostChannel(item) {
        //console.log(item, 'renderCostChannel')
        let html = ``;
        for (let i = 1; i <= 4; i++) {
            html += this.getSNSCost(item, i)
        }
        return html;
    }
    getLastestCampaignStatus(item) {
        //const lastItem = item.campaigns[item.campaigns.length - 1];
        // if (item.last_campaign_status) {
        //     return item.last_campaign_status.cd_label;
        // }
        if(item.fistar_campaign &&item.fistar_campaign.length>0){
            let x = item.fistar_campaign[0]
            return x.label.cd_label
        }
        return '-';
    }

    displayCheck(row, column, value) {
        //console.log('check');
    }

    removeChecked(uid) {
        this.sendMessageTo = this.sendMessageTo.filter(function (value, index, arr) {
            return value.uid != uid;
        });
        this.selected = this.selected.filter((item) => {
            return item.uid != uid
        });
        //console.log(this.sendMessageTo);
    }
    sendMessageFistar() {
        //console.log(this.cookieService.get('user'));;
        //console.log(this.contentMessage);
        //console.log(this.sendMessageTo);
        let arrFistars: any = [];
        let data: any = {};
        for (const item of this.sendMessageTo) {
            arrFistars.push(item.uid);
        }
        data = {
            uids: arrFistars,
            notice_title: this.contentMessage.title,
            notice_message: this.contentMessage.message,
            notice_writer: this.cookieService.get('user').reg_name,
            notice_type: 1,
            notice_state: 1
        }
        //console.log(arrFistars);
        if (arrFistars != '') {
            this.fistarService.sendMessageToFistar(data).subscribe((res: any) => {
                this.modalRef.hide();
                this.toast.success("send message success", '', {
                    timeOut: 1000
                });
                //console.log(res);
                this.sendMessageTo = [];
                this.selected = [];
            })
        }
        else {
            this.modalRef.hide();
            this.toast.error("please select one fistar");
        }
    }

    resetForm() {
        this.fistarSearch.gender = "";
        this.fistarSearch.age = "";
        this.fistarSearch.followers = "";
        this.fistarSearch.channel = "";
        this.fistarSearch.category = "";
        this.fistarSearch.location = "";
        this.fistarSearch.user_no = "";
        this.fistarSearch.fistarUserField = "keyword";
        this.fistarSearch.fistarUserValue = "";
        this.groupCheckbox = [
            { name: "Matching", value: 59, checked: false },
            { name: "Ready", value: 60, checked: false },
            { name: "On-going", value: 61, checked: false },
            { name: "Closed", value: 62, checked: false },
        ]
        this.checkedAll = false
    }

    getGender() {
        this.commonService.getGender().subscribe((res: any) => {
            this.gender = res;
            //console.log(this.gender);
        });
    }

    getAgeRange() {
        this.commonService.getAge().subscribe((res: any) => {
            this.age = res;
            //console.log(this.age);
        });
    }

    getLocation() {
        this.commonService.getLocation().subscribe((res: any) => {
            this.location = res;
            //console.log(this.location);
        });
    }

    getFollower() {
        this.commonService.getFollowers().subscribe((res: any) => {
            this.followers = res;
            //console.log(this.followers);
        });
    }

    getCategory() {
        this.commonService.getCategory().subscribe((res: any) => {
            this.category = res;
            //console.log(this.category);
        });
    }

    getChannel() {
        this.commonService.getChannel().subscribe((res: any) => {
            this.channel = res;
            //console.log(this.channel);
        });
    }

    search(page?) {
        if (page === undefined) {
            page = 1;
        } else {
            page++;
        }
        this.acctionSearch = true;
        let data: any = [];
        this.itemCheckBox().forEach(element => {
            data.push(element.value);
        });
        // //console.log(this.fistarSearch.age);
        let dataSearch: any = {
            cp_status: data,
            fistarUserField: this.fistarSearch.fistarUserField,
            fistarUserValue: this.fistarSearch.fistarUserValue,
            gender: this.fistarSearch.gender,
            age_range: this.fistarSearch.age,
            follower_range: this.fistarSearch.followers,
            channel: this.fistarSearch.channel,
            location: this.fistarSearch.location,
            page
        }
        //    //console.log(dataSearch);
        this.fistarService.search(dataSearch).subscribe((res: any) => {
            this.fistars = res.data;
            this.page = res;
        })
    }
    itemCheckBox() {
        return this.groupCheckbox
            .filter(opt => opt.checked == true);
        // //console.log(this.partnerSearch);
    }

    checkAll() {
        let value: boolean;
        if (this.checkedAll == false)
            value = true;
        else
            value = false
        if (value == true) {
            this.groupCheckbox.forEach(element => {
                element.checked = true;
            });
        }
        else {
            this.groupCheckbox.forEach(element => {
                element.checked = false;
            });
        }
    }

    unCheckAll() {
        setTimeout(() => {
            if (this.itemCheckBox().length == 4) {
                this.checkedAll = true;
            }
            else {
                this.checkedAll = false;
            }
        }, 300);
    }

    actionDisable(id) {
        let ids = [id];
        this.fistarService.disable(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }
    actionEnable(id) {
        let ids = [id];
        this.fistarService.enable(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }
    actionDelete() {
        console.log(this.selected, 'actionDELTTE')
        let ids = this.selected.map((item) => {
            return item.pid
        })
        this.fistarService.delete(ids).subscribe((res: any) => {
            {
                this.search()
                this.toast.success('Successfully');
            }
        });
    }

    dowloadCSV() {
        let CSVData = [];
        this.acctionSearch = true;
        let data: any = [];
        this.itemCheckBox().forEach(element => {
            data.push(element.value);
        });
        // //console.log(this.fistarSearch.age);
        let dataSearch: any = {
            cp_status: data,
            fistarUserField: this.fistarSearch.fistarUserField,
            fistarUserValue: this.fistarSearch.fistarUserValue,
            gender: this.fistarSearch.gender,
            age_range: this.fistarSearch.age,
            follower_range: this.fistarSearch.followers,
            channel: this.fistarSearch.channel,
            location: this.fistarSearch.location,
            page: this.page,
            
        }
        this.fistarService.search(dataSearch).subscribe((res: any) => {
            console.log(res, 'EXPORT')
            if (res.data && res.data.length > 0) {
                res.data.map((item) => {
                    CSVData.push({
                        'Id': item.uid,
                        'Name': item.fullname,
                        'Gender': item.gender.cd_label,
                        'Age': item.dob,
                        'Location': item.location.cd_label,
                        'Scrap': item.scraps_count,
                        'Followers': item.total_follower,
                        'Fime Fee': this.getSNSCost(item.channels, 1, false),
                        'Facebok Fee': this.getSNSCost(item.channels, 2, false),
                        'Youtube Fee': this.getSNSCost(item.channels, 3, false),
                        'Instagram Fee': this.getSNSCost(item.channels, 4, false),
                    })
                })
                let options = {
                    fieldSeparator: ',',
                    quoteStrings: '',
                    decimalseparator: '.',
                    useBom: true,
                    headers: ['Id',
                        'Name',
                        'Gender',
                        'Age',
                        'Location',
                        'Scrap',
                        'Followers',
                        'Fime Fee',
                        'Facebok Fee',
                        'Youtube Fee',
                        'Instagram Fee',
                    ]
                };
                this.csvService.dowloadCSV(CSVData, 'Fistars', options);
            } else {
                this.toast.error("Nothing to export")
            }
        })

    }
}
