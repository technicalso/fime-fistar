import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AdminResourceComponent } from '../resource/resource.component';

@Component({
    selector: 'app-admin-blog',
    templateUrl: './blog-details.component.html',
    styleUrls: ['./blog-details.component.scss']
})
export class AdminBlogDetailsComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public blogId: any;
    public blog: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.blogId = params['id'];
        });


        this.blog = {
        };

        this.form = new FormGroup({
            title: new FormControl(this.blog.title, [Validators.required]),
            short_description: new FormControl(this.blog.short_description, [Validators.required]),
            content: new FormControl(this.blog.content, [Validators.required]),
            is_disabled: new FormControl(this.blog.url, []),
            show_on_main: new FormControl(this.blog.show_on_main, [])
        });

        if (this.blogId) {
            this.getBlog();
        }
    }

    getBlog() {
        this.api.one('blogs', this.blogId).get()
            .subscribe(res => {
                this.blog = res.result;
            });
    }

    onSave() {
        this.resource.onSave((response) => {
            this.blog.url = response.url + '/' + response.name;
            this.blog.resource_type = response.resource_type;
            this.onSaveCallback();
        });
    }

    onSaveCallback() {
        if (this.blogId) {
            this.api
                .one('blogs', this.blogId)
                .customPUT(this.blog)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update blog successfully');
                        this.router.navigate(['/admin/blogs']);
                    }
                });
        } else {
            this.api
                .all('blogs')
                .customPOST(this.blog)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add blog successfully');
                        this.router.navigate(['/admin/blogs']);
                    }
                });
        }
    }
}
