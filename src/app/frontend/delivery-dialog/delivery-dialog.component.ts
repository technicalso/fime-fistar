import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-delivery-dialog',
    templateUrl: './delivery-dialog.component.html',
    styleUrls: ['./delivery-dialog.component.scss']
})
export class DeliveryDialogComponent implements OnInit {
    public env: any;
    public token: any;
    public delivery: any;
    public isLoading: any;

    constructor(
        private cookieService: CookieService,
        public bsModalRef: BsModalRef
    ) {
    }

    ngOnInit() {
        this.token = this.cookieService.get('X-Token');
        this.env = environment;
        this.isLoading = false;
    }

    close() {
        this.bsModalRef.hide();
    }
}
