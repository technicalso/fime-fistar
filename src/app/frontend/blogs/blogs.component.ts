import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: [
        './blogs.component.scss',
    ]
})

export class BlogsComponent implements OnInit {
    public env: any;
    public blogs: any;
    public mainblog: any;
    public subblogs: any;
    public listblog: any;
    private page = 0;
    public canLoadMore = true;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.blogs = [];
        this.mainblog = {
            title: '',
            content: '',
            slug: '',
            url: '',
            short_description: '',
            id: 0,
            resource_type: 1
        };
        this.subblogs = [];
        this.listblog = [];
        this.env = environment;
        this.getblogs();
        this.getTopViewblogs();
    }

    formatCreatedTime(blogs) {
        for (let i = 0; i < blogs.length; i++) {
            const now = moment();
            const created_time = moment(blogs[i].created_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                blogs[i].time = duration.years();
                blogs[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                blogs[i].time = duration.months();
                blogs[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                blogs[i].time = duration.days();
                blogs[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                blogs[i].time = duration.hours();
                blogs[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                blogs[i].time = duration.minutes();
                blogs[i].timeUnit = 'minute';
            } else {
                blogs[i].time = duration.seconds();
                blogs[i].timeUnit = 'second';
            }
        }
        return blogs;
    }


    getblogs() {
        this.page = this.page + 1;
        this.api.all('blogs').customGET('latest', {page: this.page}).subscribe(res => {
            if (res.result) {
                const result = this.formatCreatedTime(res.result.data);
                for (let i = 3; i < result.length; i++) {
                    this.blogs.push(result[i]);
                }
                if (this.page === 1) {
                    this.mainblog = result[0];
                    for (let i = 1; i < (result.length >= 3 ? 3 : result.length); i++) {
                        this.subblogs.push(result[i]);
                    }
                }
                if (res.result.current_page >=  res.result.last_page) {
                    this.canLoadMore = false;
                    return;
                }
            }
        });
    }

    getTopViewblogs() {
        this.api.all('blogs').customGET('top-view').subscribe(res => {
            if (res.result) {
                this.listblog = res.result.data;
                for (let i = 0; i < this.listblog.length; i++) {
                    // If youtube link, get thumbnail image
                    if (this.listblog[i].resource_type === 2) {
                        const paths = this.listblog[i].url.split('/');
                        this.listblog[i].video_id = paths[paths.length - 1];
                    }
                }
            }
        });
    }

}
