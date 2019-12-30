import {Component, OnInit, Input, ChangeDetectorRef, OnChanges} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {AdminResourceDialogImageCropComponent} from './dialog-image-crop.component';
import {ImageBase64} from './multiple-images.component';
import * as EXIF from 'exif-js/exif';

@Component({
    selector: 'app-admin-multiple-images-custom',
    templateUrl: './multiple-images-custom.component.html',
    styleUrls: ['./multiple-images-custom.component.scss']
})

export class AdminMultipleImagesCustomComponent implements OnInit, OnChanges {
    public env: any;
    @Input()
    public images: any;

    @Input()
    public aspectRatio: number;

    @Input()
    public resizeToWidth: any;

    public brands = [];
    public uploadDone: Subject<any>;
    public imagesBase64: ImageBase64[] = [];
    public imageIndex = 0;
    public change = false;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private cd: ChangeDetectorRef,
        public dialogEditImage: MatDialog
    ) {
    }

    ngOnInit() {
        this.env = {};
        this.env = environment;
    }

    ngOnChanges(changes: any) {
        this.env = environment;
        if (this.images && typeof this.images !== 'undefined' && this.images.data && this.images.data !== 'undefined') {
            const data = this.images.data;
            const data_length = data.length;
            for (let i = 0; i < data_length; i++) {
                this.imagesBase64.push(new ImageBase64('', '', this.env.rootHost + data[i].FILE_COURS + '/' + data[i].STRE_FILE_NM));
            }
        }
        this.cd.detectChanges();
    }

    fileChangeEvent(event: any): void {
        this.change = true;
        const maxImages = 7;
        if (this.imagesBase64.length > maxImages - 1) {
            return;
        }
        const files = event.target.files;
        const min = Math.min(Math.abs(maxImages - this.imagesBase64.length), files.length);
        for (let i = 0; i < min; i++) {
            if (this.imagesBase64.length > maxImages - 1) {
                break;
            }

            const that = this;

            const reader = new FileReader();
            reader.onloadend = function (e) {
                EXIF.getData(files[i], function () {
                    const allMetaData = EXIF.getAllTags(this);
                    const exifOrientation = allMetaData.Orientation;
                    that.rotateBase64Image(e.target.result, exifOrientation);
                });
            }.bind(that);
            reader.readAsDataURL(files[i]);
        }
    }

    rotateBase64Image(base64Image, exifOrientation) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        const that = this;

        img.onload = function () {
            let imgWidth = img.width;
            let imgHeight = img.height;
            const size = 2048;
            if (imgWidth > size || imgHeight > size) {
                if (imgWidth > imgHeight) {
                    imgHeight = size * imgHeight / imgWidth;
                    imgWidth = size;
                } else {
                    imgWidth = size * imgWidth / imgHeight;
                    imgHeight = size;
                }
            }

            canvas.height = imgHeight;
            canvas.width = imgWidth;

            const styleWidth = canvas.style.width;
            const styleHeight = canvas.style.height;

            const width = canvas.width;
            const height = canvas.height;


            if (exifOrientation > 4) {
                canvas.width = img.height;
                canvas.height = width;
                canvas.style.width = styleHeight;
                canvas.style.height = styleWidth;
            }

            switch (exifOrientation) {
                case 2:
                    // horizontal flip
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    // 180° rotate left
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    // vertical flip
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    // vertical flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    // 90° rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    // horizontal flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    // 90° rotate left
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
            }

            ctx.drawImage(img, 0, 0, width, height);

            that.imagesBase64.push(new ImageBase64(that.base64MimeType(canvas.toDataURL()), canvas.toDataURL(), ''));

        }.bind(that);

        img.src = base64Image;
    }

    base64MimeType(encoded) {
        let result = null;

        if (typeof encoded !== 'string') {
            return result;
        }
        const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
            result = mime[1];
        }
        return result;
    }


    editImage(index) {
        this.change = true;
        const dialogRef = this.dialogEditImage.open(AdminResourceDialogImageCropComponent, {
            width: '500px',
            data: this.imagesBase64[index]
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    deleteImage(index) {
        this.change = true;
        if (this.imagesBase64[index]) {
            this.imagesBase64.splice(index, 1);
        }
    }

    setImageToDefault(index) {
        this.change = true;
        this.imageIndex = index;
    }

    onSave(callback) {
        if (this.change === true) {
            this.api.all('uploads').customPOST({files: this.imagesBase64}).subscribe(res => {
                callback({change: this.change, images: res.result.images});
            });
        } else {
            const data = [];
            for (let i = 0; i < this.images.data.length; i++) {
                const item = this.images.data[i];
                if (item.name) {
                    data.push(item);
                } else if (item.STRE_FILE_NM) {
                    data.push({name: item.STRE_FILE_NM, url: item.FILE_COURS});
                }
            }
            callback({images: data});
        }
    }

    isValidData() {
        if (this.imagesBase64.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}
