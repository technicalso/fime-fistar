import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-admin-delivery-dialog',
    templateUrl: './delivery-dialog.component.html',
    styleUrls: ['./delivery-dialog.component.scss']
})
export class AdminDeliveryDialogComponent implements OnInit {
    public env: any;
    public form: any;
    public userTry: any;
    public shippings: [];
    public statuses: [];
    public onClose: Subject<boolean>;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        public bsModalRef: BsModalRef
    ) {
    }

    ngOnInit() {
        if (!this.userTry) {
            this.userTry = {
                dlvy_dt: moment.utc().toDate(),
                memo: ''
            };
        } else {
            this.userTry.dlvy_dt = moment.utc(this.userTry.dlvy_dt).toDate();
        }

        this.onClose = new Subject();

        this.form = new FormGroup({
            dlvy_compt_dt: new FormControl(this.userTry.dlvy_dt, [Validators.required]),
            dlvy_cmpny_code: new FormControl(this.userTry.dlvy_cmpny_code, [Validators.required]),
            dlvy_mth_code: new FormControl(this.userTry.dlvy_mth_code, [Validators.required]),
            invc_no: new FormControl(this.userTry.invc_no, [Validators.required])
        });

        this.getShippings();
        this.getShippingStatuses();
    }

    getShippings() {
        this.api.all('user-tries').customGET('getShippings').subscribe(res => {
            this.shippings = res.result;
        });
    }


    getShippingStatuses() {
        this.api.all('user-tries').customGET('getShippingStatuses').subscribe(res => {
            this.statuses = res.result;
        });
    }

    onSave() {
        this.userTry.dlvy_dt = moment(this.userTry.dlvy_dt).format('YYYY-MM-DD');
        this.api
            .all('user-tries/updateDeliveryInfo')
            .post(this.userTry)
            .subscribe(res => {
                if (res.result) {
                    this.toast.success(
                        'Delivery info has been created successfully.'
                    );
                    this.onClose.next(true);
                    this.bsModalRef.hide();
                }
            });
    }

    close() {
        this.bsModalRef.hide();
    }
}
