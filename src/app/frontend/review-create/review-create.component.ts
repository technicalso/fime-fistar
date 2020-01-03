import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminMultipleImagesCustomComponent } from '../../admin/multiple-images/multiple-images-custom.component';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../../services/review.service';
import {BsModalService} from 'ngx-bootstrap';
import {GuideUploadDialogComponent} from '../guide-upload-dialog/guide-upload-dialog.component';

@Component({
    selector: 'app-reviews',
    templateUrl: './review-create.component.html',
    styleUrls: [
        './review-create.component.scss',
    ]
})
export class ReviewCreateComponent implements OnInit {
    @ViewChild('images') public images: AdminMultipleImagesCustomComponent;

    public env;
    public categories: [];
    public review: any;
    public reviewForm: any;
    private idFormat = '[0-9]+';
    public submitted = false;
    public isHaveImage = false;
    public isLoading = true;
    public slug;
    public try_id;
    public try_item;
    public isSaving = false;

    constructor(private api: Restangular,
        private cookieService: CookieService,
        public modalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private reviewService: ReviewService,
        private toast: ToastrService,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.review = {
            goods_cl_code: ''
        };
        this.env = environment;
        this.slug = this.route.snapshot.paramMap.get('slug');
        this.try_id = this.route.snapshot.paramMap.get('try_id');

        if (this.slug) {
            this.reviewService.getReviewDetail(this.slug);
            this.reviewService.reviewObser.subscribe(res => {
                this.isLoading = false;
                if (res) {
                    this.review = res;
                } else {
                    this.router.navigate(['/']);
                }
            });
        }

        if (this.try_id) {
            this.getTry();
        }

        this.getCategories();
        this.reviewForm = new FormGroup({
            name: new FormControl(this.review.goods_nm, Validators.required),
            category_id: new FormControl(this.review.goods_cl_code, [Validators.required, Validators.pattern(this.idFormat)]),
            short_description: new FormControl(this.review.review_short, [Validators.required]),
            description: new FormControl(this.review.review_dc, [Validators.required]),
            term: new FormControl(true, [Validators.requiredTrue]),
        });
    }

    get form() {
        return this.reviewForm.controls;
    }

    getTry() {
        this.api.one('tries/write-review').customGET(this.try_id, {}).subscribe(res => {
            this.isLoading = false;
            if (res.result) {
                this.try_item = res.result;
                this.review.goods_nm = this.try_item.cntnts_nm;
                this.review.cntnts_no = this.try_item.cntnts_no;
                this.review.review_dc = this.try_item.hash_tag ? this.try_item.hash_tag + '\n' : '';
                this.review.goods_cl_code = this.try_item.goods_cl_code;
            }
        });
    }

    getCategories() {
        this.api.all('categories').customGET().subscribe(res => {
            this.isLoading = false;
            if (res.result) {
                this.categories = res.result;
            }
        });
    }

    onSubmit() {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        this.submitted = true;
        this.isHaveImage = this.images.isValidData();
        if (!this.isHaveImage) {
            this.isSaving = false;
            return;
        }
        this.images.onSave(res => {
            this.review.images = res.images;
            this.onSubmitCallBack();
        });
    }

    onSubmitCallBack() {
        if (!this.slug) {
            this.createReview();
        } else {
            this.updateReview();
        }
    }

    createReview() {
        this.api
            .all('reviews')
            .customPOST(this.review)
            .subscribe(res => {
                this.isSaving = false;
                if (res.result) {
                    this.toast.success('Đăng review thành công');
                    this.router.navigate(['/reviews']);
                }
            });
    }

    updateReview() {
        this.api
            .all('reviews/edit')
            .customPUT(this.review)
            .subscribe(res => {
                this.isSaving = false;
                if (res.result) {
                    this.toast.success('Đã cập nhật bài review của bạn');
                    this.router.navigate(['/reviews']);
                }
            });
    }

    hasError(form, formValue): boolean {
        if (form && formValue && formValue.errors && formValue.touched) {
            return true;
        }
        return false;
    }

    isUpdate(): boolean {
        if (this.slug) {
            return false;
        } else {
            return true;
        }
    }

    showGuideDialog() {
        this.modalService.show(
            GuideUploadDialogComponent
        );
    }
}
