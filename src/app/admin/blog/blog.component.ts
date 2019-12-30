import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';
@Component({
    selector: 'app-admin-blog',
    templateUrl: './blog.component.html',
    styleUrls: [
        './blog.component.scss'
    ]
})
export class AdminBlogComponent implements OnInit {
    public message: string;
    public blogs = [];
    public env: any;
    public total: any;
    public filter = {
        title: null,
        is_disabled: 'null',
        show_on_main: 'null',
        from: null,
        to: null
    };
    public column = 'title';
    public sort = 'asc';
    public pageIndex = 1;
    public pageSize = 10;
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;

    constructor(
        private api: Restangular,
        private cd: ChangeDetectorRef,
        private router: Router,
        private toast: ToastrService,
    ) { }

    ngOnInit() {
        this.env = environment;
        this.getBlogs();
    }

    getBlogs() {
        this.selected = [];
        const from = this.filter.from ? formatDate(this.filter.from, 'MM/dd/yyyy', 'en-US') : null;
        const to = this.filter.to ? formatDate(this.filter.to, 'MM/dd/yyyy', 'en-US') : null;

        this.api.all('blogs').customGET('getByPagination',
            { page: this.pageIndex, pageSize: this.pageSize, column: this.column, sort: this.sort,
                title: this.filter.title, is_disabled: this.filter.is_disabled, show_on_main: this.filter.show_on_main,
                from: from, to: to}).subscribe(res => {
                this.blogs = res.result.data;
                this.total = res.result.total;
            });
    }

    onToggle(rows, toggle) {
        const ids = _.map(rows, 'id');

        this.api.all('blogs').customPUT({ ids: ids, toggle: toggle }, 'toggle').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.is_disabled = toggle;
                }

                if (toggle) {
                    this.toast.success('The blog has been disabled');
                } else {
                    this.toast.success('The blog has been enabled');
                }
                this.selected = [];
                this.cd.detectChanges();
            }
        });
    }

    onDelete(rows) {
        const ids = _.map(rows, 'id');

        this.api.all('blogs').customPOST({ ids: ids }, 'deleteMulti').subscribe(res => {
            if (res.result) {
                this.getBlogs();
                this.toast.success('The banner has been deleted');
            }
        });
    }

    setPage(pageInfo) {
        this.pageIndex = pageInfo.offset + 1;
        this.getBlogs();
    }

    onSort(event) {
        this.column = event.sorts[0].prop;
        this.sort = event.sorts[0].dir;
        this.pageIndex = 1;
        this.getBlogs();
        return false;
    }

    onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        if (this.selected.length > 0) {
            this.showDelete = true;

            let showDeactivate = true;
            let showActive = true;
            for (const item of this.selected) {
                if (!item.is_disabled) {
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

    onSearch() {
        this.pageIndex = 1;
        this.getBlogs();
    }
    onReset() {
        this.filter = {
            title: null,
            is_disabled: 'null',
            show_on_main: 'null',
            from: null,
            to: null
        };

        this.getBlogs();
    }
}
