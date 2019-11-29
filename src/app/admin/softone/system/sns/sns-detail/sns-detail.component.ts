import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnsService } from '../../../service/system/sns.service';
declare var $: any;


@Component({
    selector: 'app-admin-system-sns-detail',
    templateUrl: './sns-detail.component.html',
    styleUrls: [
        './sns-detail.component.scss'
    ]
})
export class AdminSystemSNSDetailComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    modalRef: BsModalRef;
    snsName;
    public data = {
        title: ['No', 'Permission', 'Permission Name', 'Description'],
        list: []
    };
    sns_id: any;
    formAddPermission: FormGroup;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private snsService: SnsService,
        private activeRoute: ActivatedRoute
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.initFormMainCode();
        this.activeRoute.params.forEach((params: Params) => {
            this.getItem(params['id']);
            this.getDetailSns(params['id']);
        });
    }

    initFormMainCode()
    {
        this.formAddPermission = this.formBuilder.group({
            permission_name: ['', Validators.required],
            permission_alias: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    getDetailSns(id)
    {
        this.snsService.detailtSns(id).subscribe(res => {
            this.snsName = res['sns_name'];
            this.sns_id = res['sns_id'];
        }, err => {
            console.log(err)
        });
    }
    getItem(id) {
        this.snsService.getOneSNS(id).subscribe(res => {
            this.data.list = res['data'];
            console.log(res);

        }, err => {
        });
    }

    getDataForm() {
        return {
            sns_id: this.sns_id,
            permission_name: this.formAddPermission.value.permission_name,
            permission_alias: this.formAddPermission.value.permission_alias,
            description: this.formAddPermission.value.description
        }
    }

    addPermission() {
            if (this.formAddPermission.valid) {
                this.snsService.createSnsPermission(this.getDataForm()).subscribe(res => {
                    this.toast.success("Add permission successfully.");
                    this.modalRef.hide();
                    this.getItem(this.sns_id);
                    this.getDetailSns(this.sns_id);

                }, err => {
                    console.log(err, 'errr');
                    this.toast.error(err);
                })
            } else {
                this.toast.error("Please fill all input");

            }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }

}