import {Component, OnInit, Input, ChangeDetectorRef, OnChanges} from '@angular/core';
import {Restangular} from 'ngx-restangular';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {FileUploader, FileSelectDirective} from 'ng2-file-upload';

const URL = environment.host + '/uploads';

@Component({
    selector: 'app-admin-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class AdminResourceComponent implements OnInit, OnChanges {
    @Input()
    public resource: any;

    @Input()
    public title: string;

    @Input()
    public aspectRatio: number;

    @Input()
    public resizeToWidth: any;

    @Input()
    public needToCrop: any;

    public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'video'});
    public brands = [];
    public env: any;
    public imageChangedEvent: any;
    public fileBase64: any;
    public videoFormData: any;
    public uploadDone: Subject<any>;
    public videoName;
    public isChanged = false;

    constructor(
        private api: Restangular,
        private toast: ToastrService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.uploadDone = new Subject();
        this.env = environment;

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
    }

    ngOnChanges(changes: any) {
        const data = changes.resource.currentValue;
        if (typeof this.needToCrop !== 'undefined' && !this.needToCrop) {
            this.resource.resource_type = '1';
            this.resource.image_url = data.url;
        } else {
            this.needToCrop = true;
            this.resource.resource_type = this.resource.resource_type ? this.resource.resource_type + '' : '1';
            if (data.resource_type === '1') {
                this.resource.image_url = data.url;
            } else if (data.resource_type === '2') {
                this.resource.video_url = data.url;
            } else if (data.resource_type === '3') {
                this.resource.video_url = data.url;
            }
        }


        this.cd.detectChanges();
    }

    fileChangeEvent(event: any): void {
        this.isChanged = true;
        const files = event.target.files;
        const file = files[0];
        if (files && file) {
            const reader = new FileReader();
            if (this.resource.resource_type === '1') {
                if (file.type === 'image/gif') {
                    this.needToCrop = false;
                    reader.onload = this.handleReaderLoaded.bind(this);
                    reader.readAsBinaryString(file);
                } else {
                    if (this.needToCrop) {
                        this.imageChangedEvent = event;
                    } else {
                        reader.onload = this.handleImageNotCrop.bind(this);
                        reader.readAsDataURL(file);
                    }
                }
            } else if (this.resource.resource_type === '3') {
                this.videoFormData = new FormData();
                this.videoFormData.append('file', file, file.name);
            }
        }
    }

    detectVideoChangeEvent(event: any): void {
        this.isChanged = true;
        const files = event.target.files;
        const file = files[0];
        if (files && file) {
            this.videoName = file.name;
        }
    }

    handleImageNotCrop(img) {
        this.fileBase64 = img.target.result;
    }

    handleReaderLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.fileBase64 = 'data:image/gif;base64,' + btoa(binaryString);
    }

    handleReaderVideoLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.fileBase64 = 'data:video/gif;base64,' + btoa(binaryString);
    }

    imageCropped(event: ImageCroppedEvent) {
        this.fileBase64 = event.base64;
    }

    onSave(callback) {
        if (this.fileBase64 && this.resource.resource_type === '1') {
            this.api.all('uploads').customPOST({file: this.fileBase64, resource_type: this.resource.resource_type}).subscribe(res => {
                const url = res.result.url;
                const name = res.result.name;
                callback({url: url, resource_type: this.resource.resource_type, name: name});
            });
        } else if (this.resource.resource_type === '3') {
            this.uploader.uploadAll();
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                const rs = JSON.parse(response);
                callback({url: rs.result.url, resource_type: this.resource.resource_type, name: rs.result.name});
            };
        } else {
            if (this.resource.resource_type === '1') {
                if (typeof this.resource.image_url !== 'undefined') {
                    const path = this.resource.image_url.split('/');
                    const name = path[path.length - 1];
                    path.pop();
                    const url = path.join('/');
                    callback({url: url, resource_type: this.resource.resource_type, name: name});
                } else {
                    callback();
                }
            } else {
                const path = this.resource.video_url.split('/');
                const name = path[path.length - 1];
                path.pop();
                const url = path.join('/');
                callback({url: url, resource_type: this.resource.resource_type, name: name});
            }
        }
    }
}
