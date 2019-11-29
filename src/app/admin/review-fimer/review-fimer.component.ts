import {Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-admin-review-fimer',
    templateUrl: './review-fimer.component.html',
    styleUrls: [
        './review-fimer.component.scss'
    ]
})
export class AdminReviewFimerComponent implements OnInit {
    public message: string;
    public settings: any;
    public fimers: any;
    public hotFimers = [];
    public env: any;
    public term: any;
    public selectedUser: any;
    public positionSelectedUser = '1';
    public selected = [];
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public group = 'review_fimer';

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.env = environment;
        this.settings = {
            config_manually: {},
            position: {},
            fimer: {
                value: []
            }
        };

        this.fimers = Observable.create((observer: any) => {
            this.cd.detectChanges();
            this.api.all('admin').customGET('user/searchByName', {term: this.term}).subscribe(res => {
                observer.next(res.result.data);
            });
        });

        this.getReviews();
    }

    getReviews() {
        this.api.all('settings').customGET('getByGroup', {group: this.group}).subscribe(res => {
            if (res.result) {
                this.settings = _.keyBy(res.result, 'key');
                if (this.settings['fimer']) {
                    this.settings['fimer'].value = JSON.parse(this.settings['fimer'].value);
                    this.getUsers();
                }

                if (this.settings['config_manually']) {
                    this.settings['config_manually'].value = this.settings['config_manually'].value === 'true' ? true : false;
                }
            }
        });
    }

    selectFimer(event) {
        this.selectedUser = event.item;
    }

    addFimer() {
        if (!this.settings['fimer']) {
            this.settings['fimer'] = {value: []};
        }

        this.settings['fimer'].value.push({userId: this.selectedUser.user_no, position: this.positionSelectedUser});

        this.onPutSettings({
            fimer: {
                group: this.group, key: 'fimer',
                value: JSON.stringify(this.settings['fimer'].value)
            }
        }, function (res) {
            if (res.result) {
                this.getUsers();
            }
        }.bind(this));
    }

    getUsers() {
        if (this.settings['fimer']) {
            const ids = [];
            for (const item of this.settings['fimer'].value) {
                ids.push(item.userId);
            }

            const fimerItems = _.keyBy(this.settings['fimer'].value, 'userId');

            this.api.all('admin').customPOST({ids: ids}, 'user/getByIds').subscribe(res => {
                this.hotFimers = res.result;
                for (const item of this.hotFimers) {
                    if (fimerItems[item.user_no]) {
                        item.position = fimerItems[item.user_no].position;
                    }
                }
            });
        }
    }

    arrayOrder(n: number): any[] {
        return Array(n);
    }

    changeConfig(value) {
        this.onPutSettings({
            config_manually: {
                group: this.group, key: 'config_manually',
                value: value + ''
            }
        }, function (res) {
        });
    }

    changePosition() {
        this.onPutSettings({
            position: {
                group: this.group, key: 'position',
                value: this.settings['position'].value + ''
            }
        }, function (res) {
        });
    }

    onDelete(row) {
        const index = _.findIndex<any>(this.settings['fimer'].value, item => item.userId === row.user_no);
        this.settings['fimer'].value.splice(index, 1);

        this.onPutSettings({
            fimer: {
                group: this.group, key: 'fimer',
                value: JSON.stringify(this.settings['fimer'].value)
            }
        }, function (res) {
            if (res.result) {
                this.getUsers();
            }
        }.bind(this));
    }

    onPutSettings(data, callback) {
        this.api.all('settings').customPUT({data: data}).subscribe(res => {
            callback(res);
            if (res.result) {
                this.toast.success('Update successfully');
            }
        });
    }
}
