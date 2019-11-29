import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../../../environments/environment';
import { AdminResourceComponent } from '../../../../resource/resource.component';
import * as moment from 'moment';
import { NotifiService } from '../../../service/customer/notifi.service';

@Component({
    selector: 'app-admin-customer-add-noti',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.scss']
})
export class AdminCustomerAddNotificationComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public banner: {
        is_youtube: false
    };
    public data: any = {
        notice_title: '',
        type: 3,
        notice_message: '',
        notice_state: ''
    };
    public required_upload_file_url = false;
    public imageChangedEvent: any;
    public imageBase64: any;
    public action: string = 'add';

    idNoti = '';
    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private notiService: NotifiService
    ) { }

    ngOnInit() {
        this.env = environment;
        this.initForm();
        this.setParamPage();
    }

    initForm() {
        this.form = new FormGroup({
            notice_title: new FormControl('', [Validators.required]),
            type: new FormControl('', [Validators.required]),
            notice_message: new FormControl('', [Validators.required]),
        });
    }

    setParamPage() {
        this.activeRoute.params.forEach((params: Params) => {
            if (params['id']) {
                this.action = 'edit';
                this.idNoti = params['id'];
                this.getNotification(params['id']);
            }
        });
    }


    getNotification(id) {
        this.notiService.getOneNoti(id).subscribe(
            res => {
                this.setValueFormEdit(res);
            },
            err => {
                console.log(err);
            })
    }

    setValueFormEdit(data) {
        this.data.notice_state = data.notice_state;
        this.data.notice_title = data.notice_title;
        this.data.type = data.notice_type;
        this.data.notice_message = data.notice_message;
    }

    save() {
        if (this.action === 'add') {
            this.addNotificaiton();
        } else {
            this.editNotification();
        }
    }

    addNotificaiton() {
        if (this.form.valid) {
            let item = {
                notice_title: this.form.value.notice_title,
                notice_message: this.form.value.notice_message,
                notice_writer: 'admin',
                notice_type: this.form.value.type,
                notice_state: 1
            }
            this.notiService.createNoti(item).subscribe(res => {
                this.navigateToList();
                this.toast.success('Add Notification Success');
            }, err => {
                // this.toast.error('Error');
                this.showErrors(err);

            });

        }
        else {
            this.toast.error('Error');
        }
    }

    editNotification() {
        let item = {
            notice_title: this.form.value.notice_title,
            notice_message: this.form.value.notice_message,
            notice_writer: 'admin',
            notice_type: this.form.value.type,
            notice_state: this.data.notice_state
        }
        this.notiService.updateNoti(item, this.idNoti).subscribe(res => {
            this.navigateToList();
            this.toast.success('Edit Notification Success');
        }, err => {
            // console.log(err);
            this.showErrors(err);
        });
    }

    showErrors(data) {
        let message = '';
        if (data.error.errors) {
          if (data.error.errors.notice_title) {
            message = data.error.errors.notice_title['0'];
          }
          else if (data.error.errors.notice_message) {
            message = data.error.errors.notice_message['0'];
          }
          else if (data.error.errors.notice_type) {
            message = data.error.errors.notice_type['0'];
          }
        }
        message = message == '' ? 'Errors' : message;
        this.toast.error(message);
      }


    navigateToList() {
        this.router.navigate([`admin/customer/notification`]);
    }

}
