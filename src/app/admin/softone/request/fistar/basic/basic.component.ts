import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CommonService } from '../../../service/common.service';
import { RequestFistarService } from '../../../service/request/fistar/fistar.service';
@Component({
    selector: 'admin-request-fistar-basic',
    templateUrl: './basic.component.html',
    styleUrls: [
        './basic.component.scss'
    ]
})
export class AdminRequestFistarBasicComponent implements OnInit {
    public message: string;
    public data: any = [];
    public keywords: any = [];
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public id: string = "";
    public cdId: any = [];

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private route: ActivatedRoute,
        private requestFistar: RequestFistarService,
        public commonService: CommonService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getkeywords();
        this.getDetail();
    }
    getkeywords() {
        this.requestFistar.getKeywords().subscribe((res: any) => {
            console.log(res);
            this.keywords = res.code;
        })
    }

    getDetail() {
        this.requestFistar.getDetail(this.id).subscribe((res: any) => {
            for (const item of res.keywords) {
                this.cdId.push(item.cd_id);
            }
            this.data = res;
            console.log(this.data, 'FISTARINFO');
            console.log(this.cdId);
            console.log(this.keywords, 'keyword');
        });
    }

    accessRequest(stateId) {
        let dataRequest: any = { uid: [this.id], state: stateId };
        this.requestFistar.updateRequest(dataRequest).subscribe(res => {
            if (stateId == 2) {
                this.toast.success('Approve successfully');
            } else {
                this.toast.success('Reject successfully');
            }
            this.router.navigate(['/admin/request/fistar']);
        });
    }

    nFormatter(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    openNewWindown( url){
        window.open(url);
    }
}
