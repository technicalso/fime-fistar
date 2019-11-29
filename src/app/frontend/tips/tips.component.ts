import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';
import { MetaService } from '@ngx-meta/core';

@Component({
    selector: 'app-tips',
    templateUrl: './tips.component.html',
    styleUrls: [
        './tips.component.scss',
    ]
})

export class TipsComponent implements OnInit {
    public env: any;
    public tips: any;
    public otherTips: any;
    public mainTip: any;
    public subTips: any;
    public listTip: any;
    private page = 0;
    public canLoadMore = true;
    public intervalTime = 0;
    public isLoading = true;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                public meta: MetaService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.tips = [];
        this.otherTips = [];
        this.mainTip = {
            title: '',
            content: '',
            slug: '',
            url: '',
            short_description: '',
            id: 0,
            resource_type: 1
        };
        this.subTips = [];
        this.listTip = [];
        this.env = environment;
        this.getTips();
        this.getTopViewTips();
        this.meta.setTitle("fi:me / Tips");
        this.meta.setTag('og:title', "fi:me / Tips");
        this.meta.setTag('og:url', environment.url + "/tips");
    }

    formatCreatedTime(tips) {
        for (let i = 0; i < tips.length; i++) {
            const now = moment();
            const created_time = tips[i].updated_at ? moment.utc(tips[i].updated_at) : moment.utc(tips[i].created_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                tips[i].time = duration.years();
                tips[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                tips[i].time = duration.months();
                tips[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                tips[i].time = duration.days();
                tips[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                tips[i].time = duration.hours();
                tips[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                tips[i].time = duration.minutes();
                tips[i].timeUnit = 'minute';
            } else {
                tips[i].time = duration.seconds();
                tips[i].timeUnit = 'second';
            }
        }
        return tips;
    }


    getTips() {
        this.page = this.page + 1;
        this.api.all('tips').customGET('').subscribe(res => {
            this.isLoading = false;
            if (res.result) {
                this.tips = this.formatCreatedTime(res.result);
                this.mainTip = this.tips[0] ;
                this.otherTips = this.tips.slice(1, this.tips.length - 1);
            }
        });
    }

    getTopViewTips() {
        this.api.all('tips').customGET('top-view').subscribe(res => {
            if (res.result) {
                this.listTip = this.formatCreatedTime(res.result);
            }
        });
    }

}
