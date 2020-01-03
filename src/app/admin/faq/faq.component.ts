import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-admin-review',
    templateUrl: './faq.component.html',
    styleUrls: [
        './faq.component.scss'
    ]
})
export class AdminFaqComponent implements OnInit {
    public faqs = [];
    private data = [];
    public faq_categories: [];
    public env: any;
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public filter = {
        name: '',
        is_approved: 'null',
        category_id: 'null',
    };
    public pageSize = 10;
    public pageLimitOptions = [];

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router
    ) { }

    ngOnInit() {
        this.env = environment;
        this.getFAQCategories();
        this.getFaqs();
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
        this.getFaqs();
    }

    getFAQCategories() {
        this.api
            .one('faq-categories')
            .get()
            .subscribe(res => {
                this.faq_categories = res.result;
            });
    }

    getFaqs() {
        this.api.all('faqs').customGET('').subscribe(res => {
            this.faqs = res.result;
            this.data = res.result.slice();
        });
    }

    onToggle(rows, toggle) {
        const cntnts_nos = _.map(rows, 'cntnts_no');

        this.api.all('faqs').customPUT({cntnts_nos: cntnts_nos, toggle: toggle ? 'Y' : 'N'}, 'toggle').subscribe(res => {
            if (res.result) {
                for (const row of rows) {
                    row.is_approved = toggle ? 'Y' : 'N';
                }

                if (toggle) {
                    this.toast.success('The faq has been approve');
                } else {
                    this.toast.success('The faq has been disapprove');
                }
                this.selected = [];
            }
        });
    }

    onDelete(rows) {
        const cntnts_nos = _.map(rows, 'cntnts_no');

        this.api.all('faqs').customPOST({ cntnts_nos: cntnts_nos }, 'delete').subscribe(res => {
            if (res.result) {
                this.getFaqs();
                this.toast.success('The faq has been deleted');
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
            for (const item of this.selected) {
                if (item.is_approved !== 'Y') {
                    showDeactivate = false;
                } else {
                    showActive = false;
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
        const self = this;
        const temp = _.map(this.data, function (o) {
           if (o.title.toLowerCase().includes(self.filter.name.toLowerCase())) {
               if (self.filter.category_id !== 'null' && o.code === self.filter.category_id) {
                   if (self.filter.is_approved === '1' && o.is_approved === 'Y') {
                       return o;
                   } else if (self.filter.is_approved === '0' && o.is_approved === 'N') {
                       return o;
                   } else if (self.filter.is_approved === 'null') {
                       return o;
                   }
               } else if (self.filter.category_id === 'null') {
                   if (self.filter.is_approved === '1' && o.is_approved === 'Y') {
                       return o;
                   } else if (self.filter.is_approved === '0' && o.is_approved === 'N') {
                       return o;
                   } else if (self.filter.is_approved === 'null') {
                       return o;
                   }
               }
           }
        });
        this.faqs = _.without(temp, undefined);
    }

    onReset() {
        this.filter = {
            name: '',
            is_approved: 'null',
            category_id: 'null',
        };
        this.faqs = this.data;
    }
}
