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
import {FileUploader} from 'ng2-file-upload';

const URL = environment.host + '/uploads';

@Component({
    selector: 'app-admin-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})


export class AdminCategoryDialogComponent implements OnInit {
    public env: any;
    public form: any;
    public category: any;
    public onClose: Subject<boolean>;
    public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'category'});
    public uploaderInactive: FileUploader = new FileUploader({url: URL, itemAlias: 'category'});
    public imageChangedEvent: any;
    public fileBase64: any;
    public type = 0;
    public activeImages = '';
    public inactiveImages = '';
    public isSubmitted = false;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        public bsModalRef: BsModalRef
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();

        this.env = environment;

        this.form = new FormGroup({
            name: new FormControl(this.category.name, [Validators.required])
        });
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploaderInactive.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        if (typeof this.category !== 'undefined' && typeof this.category.code_nm !== 'undefined') {
            this.inactiveImages = this.category.additional_inactive;
            this.activeImages = this.category.additional;
        }
    }

    onSave() {
        this.isSubmitted = true;
        if (this.activeImages === '' || this.inactiveImages === '' || this.form.invalid) {
            return 0;
        }
        if (this.inactiveImages !== '') {
            this.category.additional_inactive = this.inactiveImages;
        }
        if (this.activeImages !== '') {
            this.category.additional = this.activeImages;
        }

        if (this.category.code) {
            this.api
                .one('categories', this.category.code)
                .customPUT(this.category)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Category has been updated successfully.'
                        );
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                });
        } else {
            this.api
                .all('categories')
                .post(this.category)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success(
                            'Category has been created successfully.'
                        );
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                });
        }
    }

    close() {
        this.bsModalRef.hide();
    }

    fileChangeEvent(event: any, type): void {
        this.type = type;
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = this.handleImageResult.bind(this);
            reader.readAsDataURL(file);
        }
    }

    handleImageResult(readerEvt) {
        this.fileBase64 = readerEvt.target.result;
        this.api.all('uploads').customPOST({file: this.fileBase64}).subscribe(res => {
            if (this.type === 1) {
                this.activeImages = res.result.url + '/' + res.result.name;
            } else {
                this.inactiveImages = res.result.url + '/' + res.result.name;
            }
        });
    }
}
