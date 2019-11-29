import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import * as _ from 'lodash';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})

export class AdminDeliveryComponent implements OnInit {

  public tries = [];
    public env: any;
    public total: any;
    public filter = {
        name: null,
        is_disabled: 'null',
        type: 'null',
        brand_id: 'null',
        category_id: 'null',
        from: null,
        to: null
    };
    public column = 'cntnts_no';
    public sort = 'desc';
    public pageIndex = 1;
    public pageSize = 10;
    public selected = [];
    public brands = [];
    public categories = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public pageLimitOptions = [];

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.pageIndex = 1;
        this.pageSize = 10;
        this.column = 'cntnts_no';
        this.sort = 'desc';
        this.getTries();
        this.getBrands();
        this.getCategories();
        this.pageLimitOptions = [
            {value: 5},
            {value: 10},
            {value: 20},
            {value: 25},
            {value: 50}
        ];

    }

    getBrands() {
        this.api.all('brands').customGET('').subscribe(res => {
            this.brands = res.result;
        });
    }

    getCategories() {
        this.api.all('categories').customGET('').subscribe(res => {
            this.categories = res.result;
        });
    }

    getTries() {
        const from = this.filter.from ? formatDate(this.filter.from, 'MM/dd/yyyy', 'en-US') : null;
        const to = this.filter.to ? formatDate(this.filter.to, 'MM/dd/yyyy', 'en-US') : null;

        this.api.all('tries').customGET('getTriesDeliveryAction',
            {
                page: this.pageIndex, pageSize: this.pageSize, column: this.column, sort: this.sort,
                category_id: this.filter.category_id, brand_id: this.filter.brand_id,
                name: this.filter.name, is_disabled: this.filter.is_disabled, type: this.filter.type,
                from: from, to: to
            }).subscribe(res => {
            this.tries = res.result.data;
            for (let i = 0; i < this.tries.length; i++) {
                this.tries[i].event_bgnde = moment.utc(this.tries[i].event_bgnde);
                this.tries[i].event_endde = moment.utc(this.tries[i].event_endde);
            }
            this.tries = _.orderBy(this.tries, ['count_down_type'], ['desc']);
            this.total = res.result.total;
        });
    }
    
    openTryDetail(url) {
        window.open(url);
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

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        if (this.selected.length > 0) {
            this.showDelete = true;

            let showDeactivate = true;
            let showActive = true;
            for (const item of this.selected) {
                if (item.is_disabled === 'Y') {
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

    onReset() {
        this.filter = {
            name: null,
            is_disabled: 'null',
            type: 'null',
            brand_id: 'null',
            category_id: 'null',
            from: null,
            to: null
        };

        this.getTries();
    }

    

    onDelete(rows) {
        const ids = _.map(rows, 'cntnts_no');

        this.api.all('tries').customPOST({ids: ids}, 'deleteMulti').subscribe(res => {
            if (res.result) {
                this.getTries();
                this.toast.success('The try has been deleted');
            }
        });
    }

    onDeleteMulti() {
        if (this.selected.length > 0) {
            this.onDelete(this.selected);
        }
    }

    onDownload() {
        const from = this.filter.from ? formatDate(this.filter.from, 'MM/dd/yyyy', 'en-US') : null;
        const to = this.filter.to ? formatDate(this.filter.to, 'MM/dd/yyyy', 'en-US') : null;

        this.api.all('admin/export').customGET('tries', {
            category_id: this.filter.category_id,
            brand_id: this.filter.brand_id,
            name: this.filter.name,
            is_disabled: this.filter.is_disabled,
            type: this.filter.type,
            from: from, to: to
        }).subscribe(res => {
            if (res.result) {
                window.open(this.env.rootHost + res.result.path, '_blank');
            }
        });
    }
    
    changePageLimit(limit: any): void {
        this.pageSize = limit;
        this.getTries();
    }

}
