import {Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import * as moment from 'moment';
import {TryDialogComponent} from '../try-dialog/try-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {isPlatformBrowser} from '@angular/common';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';
import {ToastrService} from 'ngx-toastr';
import { MetaService } from '@ngx-meta/core';

@Component({
    selector: 'app-tries',
    templateUrl: './tries.component.html',
    styleUrls: [
        './tries.component.scss',
    ]
})
export class TriesComponent implements OnInit {
    public env: any;
    public activeTab = 0;
    public tries = [];
    private page = 1;
    public modalRef: BsModalRef;
    public interval: any;
    public isLoading: any;
    private timeColorCodes: any;
    public timeToPreOpen = 240; // Hours
    public timeToShowCountdown = 48; // Hours
    public isApplying = false;

    public myOptions: NgxMasonryOptions = {
        horizontalOrder: true,
        gutter: 50,
        transitionDuration: '0.1'
    };

    constructor(private api: Restangular,
                public modalService: BsModalService,
                private toast: ToastrService,
                public meta: MetaService,

                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (window.innerWidth < 1920 && window.innerWidth >= 1280) {
                this.myOptions.gutter = 30;
            } else if (window.innerWidth <= 1024 && window.innerWidth > 767) {
                this.myOptions.gutter = 20;
            } else if (window.innerWidth < 426) {
                this.myOptions.gutter = 0;
            }
        }
        this.timeColorCodes = [];
        this.env = environment;
        this.getColors();
        this.meta.setTitle("fi:me / Tries");
        this.meta.setTag('og:title', "fi:me / Tries");
        this.meta.setTag('og:url', environment.url + "/tries");
    }

    getTries() {
        this.isLoading = true;
        this.api.all('tries/all').customGET('', {page: this.page, period: this.activeTab}).subscribe(res => {
            this.isLoading = false;
            if (res.result) {
                for (let i = 0; i < res.result.length; i++) {
                    // If youtube link, get thumbnail image
                    if (res.result[i].resource_type === 2) {
                        const paths = res.result[i].file.file_cours.split('/');
                        res.result[i].video_id = paths[paths.length - 1];
                    }
                }
                for (let i = 0; i < res.result.length; i++) {
                    res.result[i].remaining_time_to_open = this.remainingTimeToOpen(res.result[i].event_bgnde);
                    res.result[i].remaining_time_to_close = this.remainingTimeToClose(res.result[i].event_endde);
                    if (res.result[i].remaining_time_to_open <= this.timeToPreOpen) {
                        this.tries.push(res.result[i]);
                    }
                }
                this.countDownTryTime();
                this.tries = this.sortTries(this.tries);
            }
        });
    }

    sortTries(tries) {
        const now = moment();
        const onAir = [], standBy = [], expired = [];
        for (let i = 0; i < tries.length; i++) {
            const startTime = moment.utc(tries[i].event_bgnde);
            const endTime = moment.utc(tries[i].event_endde);
            if (startTime > now) {
                standBy.push(tries[i]);
            } else if (startTime <= now && endTime > now) {
                onAir.push(tries[i]);
            } else {
                expired.push(tries[i]);
            }
        }
        onAir.sort((a, b) => (a.remaining_time_to_close < b.remaining_time_to_close) ? 1
            : ((b.remaining_time_to_close < a.remaining_time_to_close) ? -1 : 0));
        standBy.sort((a, b) => (a.remaining_time_to_open > b.remaining_time_to_open) ? 1
            : ((b.remaining_time_to_open > a.remaining_time_to_open) ? -1 : 0));
        expired.sort((a, b) => (a.remaining_time_to_close < b.remaining_time_to_close) ? 1
            : ((b.remaining_time_to_close < a.remaining_time_to_close) ? -1 : 0));
        let returnData = [];
        returnData = returnData.concat(onAir);
        returnData = returnData.concat(standBy);
        returnData = returnData.concat(expired);
        return returnData;
    }

    remainingTimeToOpen(startTime) {
        const now = moment();
        const beginAt = moment.utc(startTime);
        const d = moment.duration(beginAt.diff(now));
        return d.asHours();
    }

    remainingTimeToClose(endTime) {
        const now = moment();
        const endAt = moment.utc(endTime);
        const d = moment.duration(endAt.diff(now));
        return d.asHours();
    }

    // User like
    toggleLikeReview(try_id, index) {
        this.api.all('user-likes').customPOST({object_id: try_id, object_type: 'try'}).subscribe(res => {
            if (res.result) {
                if (res.result.is_liking) {
                    this.tries[index].is_liked = 1;
                } else {
                    this.tries[index].is_liked = 0;
                }

                this.tries[index].likes = res.result.total;
                this.tries[index].users_liked = res.result.users;
            }
        });
    }

    // Dev code
    times(n: number): any[] {
        return Array(n);
    }

    onScroll() {
        if (!this.isLoading) {
            this.page++;
            this.getTries();
        }
    }

    scrollToTop(event): void {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 100); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 10);
    }

    countDownTryTime() {
        clearInterval(this.interval);

        this.interval = setInterval(() => {
            const now = moment();
            for (const item of this.tries) {
                const startTime = moment.utc(item.event_bgnde);
                const endTime = moment.utc(item.event_endde);

                let remainingTime = null;
                if (startTime > now) {
                    // Coming soon
                    item.count_down_type = 0;
                    remainingTime = moment.duration(startTime.diff(now));
                } else if (startTime <= now && endTime > now) {
                    // Coming soon
                    item.count_down_type = 1;
                    remainingTime = moment.duration(endTime.diff(now));
                } else {
                    item.count_down_type = 2;
                    continue;
                }

                item.days = remainingTime.days();
                item.hours = remainingTime.hours();
                item.minutes = remainingTime.minutes();
                item.seconds = remainingTime.seconds();
            }

        }, 1000);
    }

    setTab(tab) {
        this.page = 1;
        this.activeTab = tab;
        this.tries = [];
        this.getTries();
    }

    apply(item) {
        if (this.isApplying) {
            return;
        }
        this.isApplying = true;
        let fimer = {reviews: 0};
        this.api.all('fimers').customGET('profile').subscribe(res => {
            fimer = res.result;
            this.isApplying = false;
            if (item.is_try_event === 1) {
                if (fimer.reviews < item.quantity_to_qualify) {
                    const remainingReviews = item.quantity_to_qualify - fimer.reviews;
                    this.toast.error('Bạn chưa đủ điều kiện tham gia try free này. Hãy viết thêm ' + remainingReviews +
                        ' reviews để tham gia');
                    return;
                }
            }

            const initialState = {
                tryItem: item,
                user: fimer,
                tryType: item.event_knd_code
            };
            this.modalRef = this.modalService.show(
                TryDialogComponent,
                {initialState}
            );

            this.modalRef.content.onClose.subscribe(result => {
                item.total_apply = result;
                item.is_joined = true;
            });
        });
    }

    usersLikeDialog(object_id, object_type) {
        this.api.all('user-likes/get-list').customGET('',
            {object_id: object_id, object_type: object_type})
            .subscribe(res => {
                if (res.result) {
                    const initialState = {
                        users: res.result.data,
                        object_id: object_id,
                        object_type: object_type,
                    };
                    this.modalRef = this.modalService.show(
                        UsersLikeDialogComponent,
                        {initialState}
                    );
                }
            });
    }

    getColors() {
        this.api.all('text-colors').customGET().subscribe(res => {
            if (res.result) {
                this.timeColorCodes = res.result;
            }
            this.getTries();
        });
    }

    renderColor(time_color_code) {
        switch (time_color_code) {
            // WHITE
            case '400001':
                return '#fff';
            // BLACK
            case '400002':
                return '#222';
            // CUSTOM
            case '400003':
                if (this.timeColorCodes[2]) {
                    return this.timeColorCodes[2].code_nm;
                } else {
                    return '#222';
                }
            default:
                return '#222';
        }
    }
}
