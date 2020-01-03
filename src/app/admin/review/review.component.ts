import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { formatDate } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AdminReviewDetailsComponent } from '../review-detail/review-details.component';

@Component({
    selector: 'app-admin-review',
    templateUrl: './review.component.html',
    styleUrls: [
        './review.component.scss'
    ]
})
export class AdminReviewComponent implements OnInit {
    public pageIndex: any;
    public pageSize: any;
    public reviews = [];
    public images = [];
    public totalReviews: any;
    public env: any;
    public modalRef: BsModalRef;
    public selected = [];
    public categories = [];
    public users = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public showNormal = false;
    public showPopular = false;
    public column = 'review_no';
    public sort = 'desc';
    public filter = {
        name: null,
        reg_name: null,
        is_disabled: 'null',
        type: 'null',
        category_id: 'null',
        from: null,
        to: null
    };
    public tryId: string;
    public pageLimitOptions = [];
    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        public modalService: BsModalService
    ) { }

    ngOnInit() {
        this.env = environment;
        this.tryId = this.route.snapshot.paramMap.get('tryId');
        this.pageIndex = 1;
        this.pageSize = 10;
        this.column = 'review_no';
        this.sort = 'desc';
        this.getCategories();
        this.getReviews();
        this.getUsers();
        this.pageLimitOptions = [
            {value: 5},
            {value: 10},
            {value: 20},
            {value: 25},
            {value: 50}
        ];
    }

    changePageLimit(limit: any): void {
        this.pageSize = limit;
        this.getReviews();

    }

    getReviews() {
        const from = this.filter.from ? formatDate(this.filter.from, 'MM/dd/yyyy', 'en-US') : null;
        const to = this.filter.to ? formatDate(this.filter.to, 'MM/dd/yyyy', 'en-US') : null;

        this.api.all('reviews').customGET('', {
            tryId: this.tryId,
            page: this.pageIndex, pageSize: this.pageSize, column: this.column, sort: this.sort,
            category_id: this.filter.category_id, name: this.filter.name, reg_name: this.filter.reg_name,
            is_disabled: this.filter.is_disabled, type: this.filter.type,
            from: from, to: to
        }).subscribe(res => {
            this.reviews = res.result.data;
            this.totalReviews = res.result.total;
            for (let i = 0; i < this.reviews.length; i++) {
                this.reviews[i].view_cnt = parseInt(this.reviews[i].view_cnt);
            }
        });
    }

    getCategories() {
        this.api.all('categories').customGET('').subscribe(res => {
            this.categories = res.result;
        });
    }
    getUsers() {
        this.api.all('admin/users/get-list').customGET('').subscribe(res => {
            this.users = res.result;
        });
    }

    onToggle(rows, toggle) {
        const ids = _.map(rows, 'review_no');

        this.api.all('reviews').customPUT({ ids: ids, toggle: toggle }, 'toggle').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.expsr_at = toggle ? 'Y' : 'N';
                }

                if (toggle) {
                    this.toast.success('The review has been approve');
                } else {
                    this.toast.success('The review has been disapprove');
                }
                this.selected = [];
            }
        });
    }

    onTogglePopular(rows, toggle) {
        const ids = _.map(rows, 'review_no');

        this.api.all('reviews').customPUT({ ids: ids, toggle: toggle }, 'togglePopular').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.conts_seq = toggle;
                }

                if (toggle) {
                    this.toast.success('The review has been made popular');
                } else {
                    this.toast.success('The review has been normalized');
                }
                this.selected = [];
            }
        });
    }

    onDelete(rows) {
        const ids = _.map(rows, 'review_no');

        this.api.all('reviews').customPOST({ ids: ids }, 'delete').subscribe(res => {
            if (res.result) {
                this.getReviews();
                this.toast.success('The review has been deleted');
            }
        });
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        if (this.selected.length > 0) {
            this.showDelete = true;

            let showDeactivate = true;
            let showActive = true;
            let showNormal = true;
            let showPopular = true;
            for (const item of this.selected) {
                if (item.expsr_at === 'N') {
                    showDeactivate = false;
                } else {
                    showActive = false;
                }
                if (!item.conts_seq) {
                    showNormal = false;
                } else {
                    showPopular = false;
                }
            }

            this.showDeactivate = showDeactivate;
            this.showActive = showActive;
            this.showNormal = showNormal;
            this.showPopular = showPopular;
        } else {
            this.showDeactivate = false;
            this.showActive = false;
            this.showDelete = false;
            this.showNormal = false;
            this.showPopular = false;
        }
    }

    onToggleMulti(toggle) {
        if (this.selected.length > 0) {
            this.onToggle(this.selected, toggle);
        }
    }

    onDeleteMulti() {
        if (this.selected.length > 0) {
            this.onDelete(this.selected);
        }
    }

    onTogglePopularMulti(toggle) {
        if (this.selected.length > 0) {
            this.onTogglePopular(this.selected, toggle);
        }
    }

    onSearch() {
        this.getReviews();
    }

    onReset() {
        this.filter = {
            name: null,
            reg_name: null,
            is_disabled: 'null',
            type: 'null',
            category_id: 'null',
            from: null,
            to: null
        };
    }

    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getReviews();
    }

    onSort(event) {
        this.column = event.sorts[0].prop;
        this.sort = event.sorts[0].dir;
        this.pageIndex = 1;
        this.getReviews();
        return false;
    }

    openReviewDetail(url) {
        window.open(url);
    }

    getReviewsDetail(slug) {
        this.images = [];
        this.api.all('reviews/details').customGET(slug).subscribe(res => {
            const initialState = {
                review: res.result
            };
            this.modalRef = this.modalService.show(
                AdminReviewDetailsComponent,
                {initialState}
            );

            this.modalRef.content.onClose.subscribe(res => {
                this.reviews = res.result;
            });
        });
    }

}
