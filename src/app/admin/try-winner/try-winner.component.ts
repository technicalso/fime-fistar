import {Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {formatDate} from '@angular/common';
import * as _ from 'lodash';
import {AdminBrandDialogComponent} from '../brand-dialog/brand-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AdminDeliveryDialogComponent} from '../delivery-dialog/delivery-dialog.component';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-admin-try-winner',
    templateUrl: './try-winner.component.html',
    styleUrls: [
        './try-winner.component.scss'
    ]
})
export class AdminTryWinnerComponent implements OnInit {
    public tries = [];
    public env: any;
    public tryId: any;
    public try: any;
    public total: any;
    public filter = {
        name: null,
        is_selected: '-1'
    };
    public column = 'title';
    public sort = 'asc';
    public pageIndex = 1;
    public pageSize = 10;
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public modalRef: BsModalRef;

    constructor(
        private api: Restangular,
        private router: Router,
        private cd: ChangeDetectorRef,
        public activeRoute: ActivatedRoute,
        public modalService: BsModalService,
        private toast: ToastrService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.pageIndex = 1;
        this.pageSize = 10;
        this.column = 'name';
        this.sort = 'asc';
        this.try = {};
        this.activeRoute.params.forEach((params: Params) => {
            this.tryId = params['id'];
        });

        this.getTries();
    }

    getTries() {
        this.api.all('user-tries').customGET('',
            {
                page: this.pageIndex, pageSize: this.pageSize, column: this.column, sort: this.sort,
                name: this.filter.name, is_selected: this.filter.is_selected, try_id: this.tryId
            }).subscribe(res => {
            this.tries = res.result.user_tries.data;
            this.total = res.result.user_tries.total;
            this.try = res.result.try;
        });
    }

    onSearch() {
        this.pageIndex = 1;
        this.getTries();
    }

    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getTries();
    }

    onSort(event) {
        this.column = event.sorts[0].prop;
        this.sort = event.sorts[0].dir;
        this.pageIndex = 1;
        this.getTries();
        return false;
    }

    onReset() {
        this.filter = {
            name: null,
            is_selected: 'null'
        };

        this.getTries();
    }

    onToggle(item) {
        this.api.all('user-tries').customPOST({id: item.cntnts_no, user_no: item.user_no}, 'toggle').subscribe(res => {
            if (res.result) {
                this.getTries();
            } else {
                this.toast.error('Had enough winners');
            }
        });

    }

    editDeliveryInfo(userTry) {
        const initialState = {
            userTry: _.cloneDeep(userTry)
        };
        this.modalRef = this.modalService.show(
            AdminDeliveryDialogComponent,
            {initialState}
        );

        this.modalRef.content.onClose.subscribe(result => {
            this.getTries();
        });
    }

    onDownload() {
        this.api.all('admin/export').customGET('winner',
            {
                page: this.pageIndex, pageSize: this.pageSize, column: this.column, sort: this.sort,
                name: this.filter.name, is_selected: this.filter.is_selected, try_id: this.tryId
            }).subscribe(res => {
            if (res.result) {
                window.open(this.env.rootHost + res.result.path, '_blank');
            }
        });
    }
}
