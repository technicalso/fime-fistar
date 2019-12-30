import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { RequestPartnerService } from '../../service/request/partner/partner.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';

@Component({
    selector: 'app-admin-request-partner',
    templateUrl: './partner.component.html',
    styleUrls: [
        './partner.component.scss'
    ]
})
export class AdminRequestFartnerComponent implements OnInit {
    public partners: any = [];
    public page: any = {};
    public data: any = [];
    public request: any = [];
    public message: string;
    public form: any;
    public selected = [];
    public env: any;
    public acctionSearch: boolean = false;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public active = true;
    public approveReject: boolean = true;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private requestPartner: RequestPartnerService,
        private commonService: CommonService,
    ) {

    }

    ngOnInit() {
        this.data.state = 1;
        this.env = environment;
        this.getPartners();
        this.form = new FormGroup({
            state: new FormControl(this.data.state, []),
            keyword: new FormControl(this.data.keyword, []),
            period_from: new FormControl(this.data.period_from, []),//[Validators.required]
            period_to: new FormControl(this.data.period_to, []),
        });
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

    onSearch(page?: number) {
        if (page === undefined) {
            page = 1;
        } else {
            page++;
        }
        this.data.page = page;
        if(!this.data.state) this.data.state = [1,3]
        this.acctionSearch = true;
        console.log(this.form, 'FORM DATA SEARCH')
        this.requestPartner.searchRequestPartners(this.data).subscribe((res: any) => {
            this.page = res;
            this.partners = res.data;
        });

    }
    getPartners(page?: number) {
        this.acctionSearch = false;
        
        this.requestPartner.getRequestPartners(page, [this.data.state]).subscribe((res: any) => {
            this.page = res;
            this.partners = res.data;
            // console.log(res);
        });
    }

    setPage(pageInfo) {
        if (this.acctionSearch) {
            this.onSearch(pageInfo.offset);
        } else {
            this.getPartners(pageInfo.offset);
        }
    }

    onSelect({ selected }) {
        if (selected != '')
            this.approveReject = false;
        else
            this.approveReject = true;
        this.showHide();
        this.toast.clear();
        this.active = true;
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        this.request = [];
        for (const item of selected) {
            this.request.push(item.pid);
        }
    }
    accessRequest(stateId) {

        let dataRequest: any = { pid: this.request, pc_state: stateId };
        if (this.active == true) {
            this.requestPartner.updateRequest(dataRequest).subscribe(res => {
                this.selected = [];
                this.active = false;
                
                if (stateId == 2)
                    this.toast.success('approve success')
                else if (stateId == 3) {
                    this.toast.success('reject success')
                }
                if (this.acctionSearch == true)
                    this.onSearch();
                else{
                    this.getPartners();
                    this.approveReject = true;
                }
                    
            });
        }
    }

    showHide() {
        return this.approveReject;
    }

}

