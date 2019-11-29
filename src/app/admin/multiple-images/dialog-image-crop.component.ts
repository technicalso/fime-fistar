import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {Restangular} from 'ngx-restangular';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
    selector: 'app-admin-resource-dialog-image-crop',
    templateUrl: './dialog-image-crop.component.html',
    styleUrls: ['./dialog-image-crop.component.scss']
})

export class AdminResourceDialogImageCropComponent implements OnInit {
    public env: any;
    public imageBase64: any;
    public imageChangedEvent: any;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private cd: ChangeDetectorRef,
        public dialogRef: MatDialogRef<AdminResourceDialogImageCropComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
            dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.env = environment;
        if (this.data.base64 !== '') {
            this.imageBase64 = this.data.base64;
        } else if (this.data.url !== '') {
            // this.data.base64 = this.getBase64Image(document.getElementById("imageid"));
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    imageCropped(event: ImageCroppedEvent) {
        this.data.base64 = event.base64;
    }
}

export interface DialogData {
    type: any;
    base64: any;
    url: any;
    animal: any;
}
