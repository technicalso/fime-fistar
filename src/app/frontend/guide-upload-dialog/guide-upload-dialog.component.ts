import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
// import * as _ from 'lodash';
import {BsModalRef} from 'ngx-bootstrap';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-delivery-dialog',
    templateUrl: './guide-upload-dialog.component.html',
    styleUrls: ['./guide-upload-dialog.component.scss']
})
export class GuideUploadDialogComponent implements OnInit {
    public env;

    constructor(
        public bsModalRef: BsModalRef
    ) {
    }

    ngOnInit() {
        this.env = environment;
    }

    close() {
        this.bsModalRef.hide();
    }
}
