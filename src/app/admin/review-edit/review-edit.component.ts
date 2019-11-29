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
import { AdminMultipleImagesCustomComponent } from '../multiple-images/multiple-images-custom.component';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-admin-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['./review-edit.component.scss']
})
export class AdminReviewEditComponent implements OnInit {
  @ViewChild('images') public images: AdminMultipleImagesCustomComponent;

  public env: any;
  public reviewID: any;
  public categories: [];
  public review: any;
  public isSaving = false;
  public isHaveImage = false;
  public submitted = false;
  public isLoading = true;
  public reviewForm: any;
  public slug;
  private idFormat = '[0-9]+';


  constructor(
    private api: Restangular,
    private cookieService: CookieService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private toast: ToastrService,
    private reviewService: ReviewService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.review = {
      // name: '',
      // description: '',
      goods_cl_code: ''
    };

    this.env = environment;
    this.slug = this.activeRoute.snapshot.paramMap.get('slug');
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
    this.activeRoute.params.forEach((params: Params) => {
      this.reviewID = params['id'];
    });
    this.reviewForm = new FormGroup({
      name: new FormControl(this.review.goods_nm, Validators.required),
      category_id: new FormControl(this.review.goods_cl_code, [Validators.required, Validators.pattern(this.idFormat)]),
      short_description: new FormControl(this.review.review_short, [Validators.required]),
      description: new FormControl(this.review.review_dc, [Validators.required]),
      term: new FormControl(true, [Validators.requiredTrue]),
    });

    this.getReview();
    this.getCategories();
  }
  get form() {
    return this.reviewForm.controls;
  }

  hasError(form, formValue): boolean {
    if (form && formValue && formValue.errors && formValue.touched) {
      return true;
    }
    return false;
  }

  getCategories() {
    this.api.all('categories').customGET().subscribe(res => {
      this.isLoading = false;
      if (res.result) {
        this.categories = res.result;
      }
    });
  }

  getReview() {
    this.api.one('reviews', this.reviewID)
      .get()
      .subscribe(res => {
        this.review = res.result;
      });
  }

  updateReview() {
    this.api
      .all('reviews/edit')
      .customPUT(this.review)
      .subscribe(res => {
        this.isSaving = false;
        if (res.result) {
          this.toast.success('Update review successfully');
          this.router.navigate(['admin/reviews']);
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
      this.updateReview();
    });
  }

  isUpdate(): boolean {
    if (this.slug) {
      return false;
    } else {
      return true;
    }
  }
}
