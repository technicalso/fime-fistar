import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';

import {Restangular} from 'ngx-restangular';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {CookieService} from '../../../services/cookie.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.scss']
})
export class AdminNotificationDetailComponent implements OnInit {
    public env: any;
    public notificationId: any;
    public notification: any;
    public form: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    ngOnInit() {
        this.notification = {
            title: '',
            content: '',
            url: ''
        };
        this.env = environment;
        this.form = new FormGroup({
            title: new FormControl(this.notification.title, [Validators.required, Validators.maxLength(200)]),
            content: new FormControl(this.notification.content, [Validators.required, Validators.maxLength(500)]),
            url: new FormControl(this.notification.url, [Validators.required]),
        });
        this.activeRoute.params.forEach((params: Params) => {
            this.notificationId = params['id'];
        });

        if (this.notificationId) {
            this.getNotification();
        }
    }

    getNotification() {
        this.api.one('system-notification', this.notificationId)
            .get()
            .subscribe(res => {
                this.notification = res.result;
            });
    }

    save() {
        if (this.notificationId) {
            const data = {
                id: this.notificationId,
                title: this.notification.title,
                content: this.notification.content,
                url: this.notification.url,
            };
            this.api.all('system-notification').customPUT(data, 'update').subscribe(res => {
                if (res.result) {
                    this.toast.success('The system notification has been updated');
                    this.router.navigate(['/admin/notifications']);
                }
            });
        } else {
            const data = {
                title: this.notification.title,
                content: this.notification.content,
                url: this.notification.url,
                is_system: 1
            };
            this.api.all('system-notification').customPOST(data).subscribe(res => {
                this.toast.success('The system notification has been created');
                this.router.navigate(['/admin/notifications']);
            });
        }
    }
}
