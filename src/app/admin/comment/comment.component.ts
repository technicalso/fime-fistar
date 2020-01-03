import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-review',
    templateUrl: './comment.component.html',
    styleUrls: [
        './comment.component.scss'
    ]
})
export class AdminCommentComponent implements OnInit {
    public message: string;
    public comments = [];
    public totalComments: any;
    public pageIndex: any;
    public env: any;
    private object_id: number;
    private object_type: string;
    public pageSize = 10;
    public pageLimitOptions = [];
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.pageIndex = 1;
        this.object_id = +this.route.snapshot.paramMap.get('object_id');
        this.object_type = this.route.snapshot.paramMap.get('object_type');

        this.getReviewComments();
        this.pageSize = 10;
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
        this.getReviewComments();
    }

    getReviewComments() {
        const id = this.object_id;
        this.api.all('comments/all/' + id).customGET('', { type: this.object_type, page: this.pageIndex }).subscribe(res => {
            if (res.result) {
                this.comments = res.result.data;
                this.totalComments = res.result.total;
            }
        });
    }

    onToggle(row) {
        this.api.one('comments', row.id).customPUT({ type: this.object_type }, 'toggle').subscribe(res => {
            if (res.result) {
                row.expsr_at = res.result.expsr_at;
                if (row.expsr_at === 'Y') {
                    this.toast.success('This comment has been approved');
                } else {
                    this.toast.success('This comment has been disapproved');
                }
            }
        });
    }


    // onDelete(row) {
    //     this.api.one('comments/delete').customPOST({id: row.id, type: this.object_type }).subscribe(res => {
    //         if (res.result) {
    //             this.getReviewComments();
    //             this.toast.success('This comment has been deleted');
    //         }
    //     });
    // }
    onDelete(rows) {
        const ids = _.map(rows, 'id');
        this.api.all('comments/delete').customPOST({id: ids, type: this.object_type }).subscribe(res => {
            if (res.result) {
                this.getReviewComments();
                this.toast.success('This comment has been deleted');
            }
        });
    }

    onDeleteMulti() {
        if (this.selected.length > 0) {
            this.onDelete(this.selected);
        }
    }

    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getReviewComments();
    }

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        if (this.selected.length > 0) {
            this.showDelete = true;

            let showDeactivate = true;
            let showActive = true;
            for (const item of this.selected) {
                if (item.expsr_at === 'Y') {
                    showActive = false;
                } else {
                    showDeactivate = false;
                }
            }

            this.showDeactivate = showDeactivate;
            this.showActive = showActive;
        } else {
            this.showDeactivate = false;
            this.showActive = false;
            this.showDelete = false;
        }
    }

}
