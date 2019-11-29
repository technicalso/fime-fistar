import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import * as moment from 'moment';
import {Restangular} from 'ngx-restangular';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../../services/cookie.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DeliveryDialogComponent } from '../../../delivery-dialog/delivery-dialog.component';
import {UsersLikeDialogComponent} from '../../../users-like-dialog/users-like-dialog.component';

@Component({
    selector: 'app-my-page-tries',
    templateUrl: '../../../tries/tries.component.html',
    styleUrls: [
        '../../../tries/tries.component.scss',
        './my-page-tries.component.scss'
    ]
})

export class MyPageTriesComponent implements OnInit, OnChanges {
    @Input()
    public user: any;

    @Input()
    public filterType: any;

    @Input()
    public needUpdateContent: any;

    public env: any;
    public activeTab = 0;
    public defaultImage = 'assets/icons/default_image.png';
    public myOptions: NgxMasonryOptions = {
        gutter: 50,
        horizontalOrder: true,
        transitionDuration: '0s'
    };
    public modalRef: BsModalRef;
    public page = 1;
    public isLoading = false;
    public tries = [];
    public toggleDone: Subject<any>;
    private timeColorCodes: any;
    public timeToShowCountdown = 48; // Hours
    public timeToPreOpen = 72; // Hours


    constructor(private cookieService: CookieService,
        public modalService: BsModalService,
        private api: Restangular) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;
        this.timeColorCodes = [];
    }

    ngOnChanges(changes: any) {
        if (typeof this.needUpdateContent && this.needUpdateContent) {
            this.page = 1;
            if (this.filterType && typeof this.filterType !== 'undefined' && this.filterType === 'try-free') {
                this.getTries();
            }
        }
    }

    onScroll() {
        if (this.filterType === 'try-free') {
            this.page++;
            this.getColors();
        }
    }

    setTab(tab) {

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

            const crrUser = this.cookieService.get('user');
            if (crrUser && crrUser.user_no === this.user.user_no) {
                this.toggleDone.next(false);
            }
        });
    }

    getTries() {
        if (typeof this.user !== 'undefined' && typeof this.user.user_no !== 'undefined' && this.filterType === 'try-free') {
            if (this.page === 1) {
                this.tries = [];
            }
            this.api.all('usr-info/tries').customGET('', {page: this.page, userId: this.user.user_no}).subscribe(res => {
                this.isLoading = false;
                this.page = res.result.current_page;
                if (res.result.data) {
                    for (let i = 0; i < res.result.data.length; i++) {
                        res.result.data[i].remaining_time_to_open = this.remainingTimeToOpen(res.result.data[i].event_bgnde);
                    }
                    for (const key in res.result.data) {
                        if (res.result.data.hasOwnProperty(key)) {
                            this.tries.push(res.result.data[key]);
                            this.countDownTryTime();
                        }
                    }
                }
            });
        }
    }

    remainingTimeToOpen(startTime) {
        const now = moment();
        const beginAt = moment.utc(startTime);
        const d = moment.duration(beginAt.diff(now));
        return d.asHours();
    }

    countDownTryTime() {
        setInterval(() => {
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

    openDelivery(item) {
        const initialState = {
            delivery: item
        };

        this.modalRef = this.modalService.show(
            DeliveryDialogComponent,
            {initialState}
        );
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
}
