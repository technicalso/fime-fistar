import {
    Component,
    OnInit,
    Inject,
    PLATFORM_ID,
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { CookieService } from '../../../services/cookie.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin-faq',
    templateUrl: './faq-details.component.html',
    styleUrls: ['./faq-details.component.scss']
})
export class AdminFaqDetailsComponent implements OnInit {
    public env: any;
    public form: any;
    public faqId: any;
    public faq: any;
    public faq_categories: any;

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
        this.getFAQCategories();

        this.env = environment;
        this.faq = {
            faq_se_code: 0
        };

        this.activeRoute.params.forEach((params: Params) => {
            this.faqId = params['id'];
        });

        this.form = new FormGroup({
            sj: new FormControl(this.faq.sj, [Validators.required]),
            cn: new FormControl(this.faq.cn, [Validators.required]),
        });

        if (this.faqId) {
            this.getFAQ();
        }
    }

    getFAQCategories() {
        this.api
            .one('faq-categories')
            .get()
            .subscribe(res => {
                this.faq_categories = res.result;
                this.faq.faq_se_code = res.result[0].code;
            });
    }

    getFAQ() {
        this.api
            .one('faqs', this.faqId)
            .get()
            .subscribe(res => {
                this.faq = res.result;
            });
    }

    save() {
        if (this.faqId) {
            this.api
                .one('faqs', this.faqId)
                .customPUT(this.faq)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update faq successfully');
                        this.router.navigate(['/admin/faqs']);
                    }
                });
        } else {
            this.api
                .all('faqs')
                .customPOST(this.faq)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add faq successfully');
                        this.router.navigate(['/admin/faqs']);
                    }
                });
        }
    }

    changeFAQCategoriesID(event, faq_category_code) {
        this.faq.faq_se_code = faq_category_code;
    }
}
