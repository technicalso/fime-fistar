import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgxMasonryOptions} from 'ngx-masonry';
import * as moment from 'moment';
import {Restangular} from 'ngx-restangular';
import {Subject} from 'rxjs';
import {CookieService} from '../../../../services/cookie.service';
import {TryDialogComponent} from '../../try-dialog/try-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {UsersLikeDialogComponent} from '../../users-like-dialog/users-like-dialog.component';

@Component({
    selector: 'app-search-page-tries',
    templateUrl: '../../tries/tries.component.html',
    styleUrls: [
        '../../tries/tries.component.scss',
        './search-page-tries.component.scss'
    ]
})

export class SearchPageTriesComponent implements OnInit, OnChanges {
    @Input()
    public searchValue: any;

    @Input()
    public searchKey: any;

    @Input()
    public needUpdateContent: any;

    public env: any;

    public myOptions: NgxMasonryOptions = {
        fitWidth: true,
        gutter: 20,
        horizontalOrder: true,
        transitionDuration: '0s'
    };

    public page = 1;
    public isLoading = false;
    public tries = [];
    public toggleDone: Subject<any>;
    public activeTab: any;
    public timeColorCodes: any;
    public modalRef: BsModalRef;

    constructor(private cookieService: CookieService,
                private toast: ToastrService,
                public modalService: BsModalService,
                private api: Restangular) {
        this.toggleDone = new Subject();
    }

    ngOnInit(): void {
        this.env = environment;
        this.timeColorCodes = [];
    }

    ngOnChanges(changes: any) {
        if (this.needUpdateContent && this.searchKey === 'tries') {
            this.page = 1;
            this.getColors();
        }
    }

    apply(item) {
        let fimer = {reviews: 0};
        this.api.all('fimers').customGET('profile').subscribe(res => {
            fimer = res.result;
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
                user: fimer
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

    getColors() {
        this.api.all('text-colors').customGET().subscribe(res => {
            if (res.result) {
                this.timeColorCodes = res.result;
            }
            this.getTries();
        });
    }

    onScroll() {
        if (this.searchKey === 'tries') {
            this.page++;
            this.getTries();
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
        });
    }

    getTries() {
        if (this.page === 1) {
            this.tries = [];
        }

        let param = {};
        if (this.searchValue === null) {
            param = {page: this.page};
        } else {
            param = {page: this.page, searchValue: this.searchValue};
        }

        this.isLoading = true;
        // this.toggleDone.next(false);
        this.api.all('search/tries').customGET('', param).subscribe(res => {
            this.isLoading = false;
            this.page = res.result.current_page;
            if (res.result.data) {
                for (const key in res.result.data) {
                    if (res.result.data.hasOwnProperty(key)) {
                        this.tries.push(res.result.data[key]);
                        this.countDownTryTime();
                    }
                }
            }
        });
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
