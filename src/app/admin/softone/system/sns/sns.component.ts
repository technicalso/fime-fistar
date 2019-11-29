import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SnsService } from '../../service/system/sns.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '../../../shared/service/pager.service';
declare var $: any;


@Component({
    selector: 'app-admin-system-sns',
    templateUrl: './sns.component.html',
    styleUrls: [
        './sns.component.scss'
    ]
})
export class AdminSystemSNSComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public displayPopup = false;
    public titlePopup = 'Add Group';
    public btnPopup = 'Add';
    public actionPopup = 'add';
    private idEdit;
    public statusError = false;
    public statusChangeDisabled = false;
    pager = {};
    total_item = 0;
    page_current = 1

    modalRef: BsModalRef;
    data = {
        title: ['No', 'SNS', 'URL', 'State', 'Action'],
        list: []
    }
    formGroup: FormGroup;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private snsService: SnsService,
        private formBuilder: FormBuilder,
        private pagerService: PagerService
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.initForm();
        this.getData(1);
    }

    initForm() {
        this.formGroup = this.formBuilder.group({
            sns_name: ['', [Validators.required]],
            sns_url: ['', [Validators.required]],
            sns_state: ['', [Validators.required]]
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');

    }

    getData(page?) {
        let param_page = page ? page : 1;
        // let link = `/api/admin/sns&page=${param_page}`;
        let link = `/api/admin/sns`;
        this.snsService.getSNS(link).subscribe(res => {
            console.log('sns-data-all', res);
            this.data.list = res['data'];
            this.total_item = res['total'];
            this.pager = this.pagerService.getPager(this.total_item, page, 10);
        });
    }

    display(action, item?) {
        if (action === 'edit') {
            console.log(item);
            this.idEdit = item.sns_id;
            this.titlePopup = 'Edit SNS';
            this.btnPopup = 'Edit';
            this.actionPopup = 'edit';
            this.formGroup.controls['sns_name'].setValue(item.sns_name);
            this.formGroup.controls['sns_url'].setValue(item.sns_url);
            this.formGroup.controls['sns_state'].setValue(item.sns_state);
        }
        if (action === 'add') {
            this.formGroup.reset();
            this.titlePopup = 'Add SNS';
            this.btnPopup = 'Add';
            this.actionPopup = 'add';
        }
        this.displayPopup = true;
    }

    save(action) {
        console.log(action, this.formGroup.value);

        if (this.formGroup.valid) {
            if (action === 'add') {
                console.log(this.formGroup.value);
                let body = {
                    sns_name: this.formGroup.value.sns_name,
                    sns_url: this.formGroup.value.sns_url,
                    sns_state: this.formGroup.value.sns_state
                }
                this.snsService.createSNS(body).subscribe(res => {
                    this.toast.success('Success');
                    this.getData(1);
                    this.displayPopup = false;
                }, err => {
                    if (!this.statusError) {
                        this.toast.error("This field is required");
                        this.statusError = true;
                    }
                });
            }
            if (action === 'edit') {

                console.log(this.formGroup.value);
                let body = {
                    sns_name: this.formGroup.value.sns_name,
                    sns_url: this.formGroup.value.sns_url,
                    sns_state: this.formGroup.value.sns_state
                }
                console.log(body);

                this.snsService.updateSNS(body, this.idEdit).subscribe(res => {
                    this.toast.success('Success');
                    this.getData(1);
                    this.displayPopup = false;
                }, err => {
                    console.log(err);

                    this.toast.error(err.error.errors.message);
                });
            }
        }
    }

    disabled(event) {
        let state = event.sns_state == 1 ? 0 : 1;
        let body = {
            sns_name: event.sns_name,
            sns_url: event.sns_url,
            sns_state: state
        }
        this.snsService.updateSNS(body, event.sns_id).subscribe(res => {
            this.getData(1);
            this.toast.success('Success');
        }, err => {
            this.toast.error(err.error.message);
        });
    }

    delete(id) {
        let body = {
            sns_ids: [id]
        }
        let r = window.confirm('Do you delete it?')
        if (r) {
            this.snsService.deleteSNS(body).subscribe(res => {
                this.getData(1);
                this.toast.success('Delete SNS Success');
            }, err => {
                this.toast.error(err.error.errors.message);
            });
        }
    }

    hide() {
        this.displayPopup = false;
    }

    choosepage(page) {
        if (page < Number(this.pager['totalPages']) + 1) {
            this.getData(page);
        }
    }
}
