import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { RequestFistarService } from '../../service/request/fistar/fistar.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';


@Component({
    selector: 'app-admin-request-fistar',
    templateUrl: './fistar.component.html',
    styleUrls: [
        './fistar.component.scss'
    ]
})
export class AdminRequestFistarComponent implements OnInit {
    public fistars: any = [];
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
    public image: string;
    public approveReject: boolean = true;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private requestFistar: RequestFistarService,
        private commonService: CommonService,
    ) {

    }

    ngOnInit() {
        this.data.state = 1;
        this.env = environment;
        this.getFistars();
        this.form = new FormGroup({
            state: new FormControl(this.data.state, []),
            keyword: new FormControl(this.data.keyword, []),
            period_from: new FormControl(this.data.period_from),
            period_to: new FormControl(this.data.period_to),
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

    onSearch(page?) {
        if (page === undefined) {
            page = 1;
        } else {
            page++;
        }
        if(!this.data.state) this.data.state = [1,3]
        this.data.page = page;
        this.acctionSearch = true;
        this.requestFistar.searchRequestFistars(this.data).subscribe((res: any) => {
            this.page = res;
            this.fistars = res.data;
        });

    }
    getFistars(page?) {
        this.acctionSearch = false;
        this.requestFistar.getRequestFistars(page, [this.data.state]).subscribe((res: any) => {
            this.page = res;
            this.fistars = res.data;

        });
    }

    setPage(pageInfo) {
        if (this.acctionSearch) {
            this.onSearch(pageInfo.offset);
        } else {
            this.getFistars(pageInfo.offset);
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
            this.request.push(item.uid);
        }
    }

    countFollower(item, channel = 1) {
        // console.log(item)
        let x = item.channels.filter((i) => {
            return i.sns_id == channel
        }).map(obj => obj);
        //console.log(x, this.commonService.parseLargeNum(x[0].usn_follower))
        if (x[0])
            return this.commonService.parseLargeNum(x[0].usn_follower);
        else
            return "-";
    }

    accessRequest(stateId) {

        let dataRequest: any = { uid: this.request, state: stateId };
        if (this.active == true) {
            this.requestFistar.updateRequest(dataRequest).subscribe(res => {
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
                    this.getFistars();
                    this.approveReject = true;
                }
                    
            });
        }
    }

    showHide() {
        return this.approveReject;
    }

}
