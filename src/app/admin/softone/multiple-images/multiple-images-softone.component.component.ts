import {Component, OnInit, Input, ChangeDetectorRef, OnChanges} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {AdminResourceDialogImageCropSoftOneComponent} from './dialog-image-crop-softone.component';

@Component({
    selector: 'app-admin-multiple-images-softone',
    templateUrl: './multiple-images-softone.component.html',
    styleUrls: ['./multiple-images-softone.component.scss']
})

export class AdminMultipleImagesSoftOneComponent implements OnInit, OnChanges {
    public env: any;
    @Input()
    public images: any;

    @Input()
    public aspectRatio: number;

    @Input()
    public resizeToWidth: any;

    @Input()
    public needToCrop: any;

    @Input()
    public maxImage: any;

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
        this.env = environment;
    }

    ngOnChanges(changes: any) {
        if (this.images && typeof this.images !== 'undefined' && this.images.data && this.images.data !== 'undefined') {
            const data = this.images.data;
            const data_length = data.length;
            console.log(this.images,'data');
            for (let i = 0; i < data_length; i++) {
                this.imagesBase64.push(new ImageBase64('', '', this.env.rootHostFistar + '/storage/attachments/large/'+data[i].cp_attachment_url));
                console.log(this.env.rootHostFistar + '/storage/attachments/large/'+data[i].cp_attachment_url);
            }
        
        }
        this.cd.detectChanges();
    }

    fileChangeEvent(event: any): void {
        this.change = true;
        let maxImages = Number.MAX_VALUE;
        if (typeof this.maxImage !== 'undefined') {
            maxImages = 1;
        }
        if (this.imagesBase64.length > maxImages - 1) {
            return;
        }
        const files = event.target.files;
        const min = Math.min(maxImages, files.length);
        for (let i = 0; i < min; i++) {
            if (this.imagesBase64.length > maxImages - 1) {
                break;
            }
            const reader = new FileReader();
            reader.onload = this.handleImageResult.bind(this);
            reader.readAsDataURL(files[i]);
        }
    }

    handleImageResult(reader) {
        this.imagesBase64.push(new ImageBase64(this.base64MimeType(reader.target.result), reader.target.result, ''));
        if (typeof this.needToCrop !== 'undefined' && !this.needToCrop) {
            return;
        } else {
            this.editImage(this.imagesBase64.length - 1);
        }
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
        const dialogRef = this.dialogEditImage.open(AdminResourceDialogImageCropSoftOneComponent, {
            width: '720px',
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
            if (this.images.data) {
                for (let i = 0; i < this.images.data.length; i++) {
                    const item = this.images.data[i];
                    if (item.name) {
                        data.push(item);
                    } else if (item.stre_file_nm) {
                        data.push({name: item.stre_file_nm, url: item.file_cours});
                    }
                }
                callback({images: data});
            } else {
                callback({images: data});
            }
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

export class ImageBase64 {
    public type: any;
    public base64: any;
    public url: any;

    constructor(type, base64, url) {
        this.type = type;
        this.base64 = base64;
        this.url = url;
    }
}
