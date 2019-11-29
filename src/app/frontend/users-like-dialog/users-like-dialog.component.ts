import {Component, OnInit, Inject, PLATFORM_ID, HostListener} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Router} from '@angular/router';
import {TryService} from '../../../services/try.service';
import {ToastrService} from 'ngx-toastr';
import {ShareFacebookService} from '../../../services/share-facebook.service';
import {environment} from '../../../environments/environment';
import {CookieService} from '../../../services/cookie.service';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'app-users-like-dialog',
    templateUrl: './users-like-dialog.component.html',
    styleUrls: [
        './users-like-dialog.component.scss',
    ]
})
export class UsersLikeDialogComponent implements OnInit {
    public env: any;
    public crrUserNo: any;
    public users: any;
    public object_id: any;
    public object_type: any;
    private page = 1;

    constructor(private api: Restangular,
                private cookieService: CookieService,
                public activeRoute: ActivatedRoute,
                private tryService: TryService,
                private router: Router,
                private toast: ToastrService,
                private shareFacebookService: ShareFacebookService,
                @Inject(PLATFORM_ID) private platformId: Object,
                public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.env = environment;
        if (this.cookieService.get('user')) {
            this.crrUserNo = this.cookieService.get('user').user_no;
        }
    }

    toggleFollowFimer(user) {
        this.api.all('user-follows').customPOST({
            followed_user_id: user.user_no
        }).subscribe(res => {
            if (res.result) {
                user.followed = res.result.followed;
                user.number_of_followers = res.result.total;
            }
        });
    }

    goToUserProfle(slug) {
        this.close();
        this.router.navigate(['/usr/' + slug]);
    }

    close() {
        this.bsModalRef.hide();
    }

    onScroll() {
        this.page++;
        this.api.all('user-likes/get-list').customGET('',
            {object_id: this.object_id, object_type: this.object_type, page: this.page})
            .subscribe(res => {
                if (res.result.data) {
                    for (let i = 0; i < res.result.data.length; i++) {
                        this.users.push(res.result.data[i]);
                    }
                }
            });
    }

    @HostListener('scroll', ['$event'])
    scrolled(event: any) {
        // Visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.onScroll();
        }
    }
}
