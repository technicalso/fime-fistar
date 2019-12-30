import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../environments/environment';
import {Router, ActivatedRoute, Params} from '@angular/router';
import * as moment from 'moment';
import {TryDialogComponent} from '../try-dialog/try-dialog.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {TryService} from '../../../services/try.service';
import {ShareFacebookService} from '../../../services/share-facebook.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {AdminResourceDialogImageCropComponent} from '../../admin/multiple-images/dialog-image-crop.component';
import {UsersLikeDialogComponent} from '../users-like-dialog/users-like-dialog.component';

@Component({
    selector: 'app-try-detail',
    templateUrl: './try-detail.component.html',
    styleUrls: [
        './try-detail.component.scss',
    ]
})
export class TryDetailsComponent implements OnInit {
    public env: any;
    public try: any;
    public slug: any;
    public isLoading: any;
    public modalRef: BsModalRef;
    public images: [];
    public isApplying = false;

    constructor(private api: Restangular,
                public modalService: BsModalService,
                public activeRoute: ActivatedRoute,
                private tryService: TryService,
                private router: Router,
                private toast: ToastrService,
                private shareFacebookService: ShareFacebookService,
                public dialogUsersLike: MatDialog,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        this.env = environment;
        this.activeRoute.params.forEach((params: Params) => {
            this.slug = params['slug'];
        });

        this.isLoading = true;
        this.tryService.getTryDetail(this.slug);
        this.tryService.tryObserve.subscribe(data => {
            this.isLoading = false;
            if (data) {
                this.try = data;
                this.images = data.images;
                this.countDownTryTime();
            } else {
                this.router.navigate(['/']);
            }
        });
    }

    countDownTryTime() {
        setInterval(() => {
            const now = moment();
            const startTime = moment.utc(this.try.event_bgnde);
            const endTime = moment.utc(this.try.event_endde);

            let remainingTime = null;
            if (startTime > now) {
                // Coming soon
                this.try.count_down_type = 0;
                remainingTime = moment.duration(startTime.diff(now));
            } else if (startTime <= now && endTime > now) {
                // Coming soon
                this.try.count_down_type = 1;
                remainingTime = moment.duration(endTime.diff(now));
            } else {
                this.try.count_down_type = 2;
                return;
            }

            this.try.days = remainingTime.days();
            this.try.hours = remainingTime.hours();
            this.try.minutes = remainingTime.minutes();
            this.try.seconds = remainingTime.seconds();

        }, 1000);
    }

    apply() {
        if (this.isApplying) {
            return;
        }
        this.isApplying = true;
        let fimer = {reviews: 0};
        this.api.all('fimers').customGET('profile').subscribe(res => {
            fimer = res.result;
            this.isApplying = false;
            if (this.try.is_try_event === 1) {
                if (fimer.reviews < this.try.quantity_to_qualify) {
                    const remainingReviews = this.try.quantity_to_qualify - fimer.reviews;
                    this.toast.error('Bạn chưa đủ điều kiện tham gia try free này. Hãy viết thêm ' + remainingReviews +
                        ' reviews để tham gia');
                    return;
                }
            }

            const initialState = {
                tryItem: this.try,
                user: fimer
            };
            this.modalRef = this.modalService.show(
                TryDialogComponent,
                {initialState}
            );

            this.modalRef.content.onClose.subscribe(result => {
                this.try.total_apply = result;
                this.try.is_joined = true;
            });
        });
    }

    toggleLikeReview() {
        this.api.all('user-likes').customPOST({object_id: this.try.cntnts_no, object_type: 'try'}).subscribe(res => {
            if (res.result) {
                if (res.result.is_liking) {
                    this.try.is_liked = 1;
                } else {
                    this.try.is_liked = 0;
                }

                this.try.likes = res.result.total;
                this.try.users_liked = res.result.users;
            }
        });
    }

    toggleFollowFimer(user) {
        this.api.all('user-follows').customPOST({
            followed_user_id: user.user_no
        }).subscribe(res => {
            if (res.result) {
                user.followed = res.result.followed;
                user.follows = res.result.total;
            }
        });
    }

    updateCommentCount(count) {
        this.try.comments = count;
    }

    shareLink() {
        const href = this.env.url + this.router.url;
        this.shareFacebookService.share(href);
        this.shareFacebookService.response.subscribe(res => {
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
}
