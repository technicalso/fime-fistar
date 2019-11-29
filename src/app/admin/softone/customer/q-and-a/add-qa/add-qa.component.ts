import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../../../environments/environment';
import { AdminResourceComponent } from '../../../../resource/resource.component';
import * as moment from 'moment';
import { QaService } from '../../../service/customer/qa.service';

@Component({
    selector: 'app-admin-customer-add-qa',
    templateUrl: './add-qa.component.html',
    styleUrls: ['./add-qa.component.scss']
})
export class AdminCustomerAddQAComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public env: any;
    public form: any;
    public bannerId: any;
    public banner: any;
    public required_upload_file_url: boolean;
    public imageChangedEvent: any;
    public imageBase64: any;
    public action: string = 'add';
    public categories: any;
    public error = {
        category: false,
        type: false
    }
    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private qaService: QaService
    ) { }

    ngOnInit() {
        this.env = environment;
        this.initForm();
        this.getParamPage();
        this.required_upload_file_url = false;
        this.banner = { is_youtube: false };
        this.qaService.getCategory().subscribe(res => {
            this.categories = res['data'];
        });
    }

    getParamPage() {
        this.activeRoute.params.forEach((params: Params) => {
            this.bannerId = params['id'];
            if (params['id']) {
                this.action = 'edit';
                this.qaService.getOneQA(this.bannerId).subscribe(res => {
                    this.form.controls['title'].setValue(res['qa_title']);
                    this.form.controls['question'].setValue(res['qa_question']);
                    this.form.controls['answer'].setValue(res['qa_answer']);
                    this.form.controls['type'].setValue(res['qa_type']);
                    this.form.controls['category'].setValue(res['qa_category']);
                    this.form.controls['state'].setValue(res['qa_state']);

                }, err => {
                    console.log(err);
                });
            }
        });
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl('', [Validators.required]),
            question: new FormControl('', [Validators.required]),
            answer: new FormControl('', [Validators.required]),
            type: new FormControl('', [Validators.required]),
            category: new FormControl('categories', [Validators.required]),
            state: new FormControl('state', [Validators.required]),
        });
    }

    save() {
        if (this.form.value.category === 'categories') {
            this.error.category = true;
            return false;
        }
        if (this.form.value.type === 'type') {
            this.error.type = true;
            return false;
        }
        if (this.action === 'add') {
            this.error.category = false;
            this.error.type = false;
            if (this.form.valid) {
                let item = {
                    qa_title: this.form.value.title,
                    qa_question: this.form.value.question,
                    qa_answer: this.form.value.answer,
                    qa_state: (this.form.value.state != '') ? this.form.value.state : 0,
                    qa_type: 0, // default
                    qa_category: this.form.value.category,
                    qa_user: 'Admin'
                }
                this.qaService.addQA(item).subscribe(res => {
                    this.toast.success('Update success');
                    this.redirectToPageList();
                }, err => {
                    this.toast.error(err.error.errors.qa_answer ? err.error.errors.qa_answer['0'] : 'Errors');
                });
            }
        } else {
            let item = {
                qa_title: this.form.value.title,
                qa_question: this.form.value.question,
                qa_answer: this.form.value.answer,
                qa_state: 1,
                qa_type: this.form.value.type,
                qa_category: this.form.value.category,
                qa_user: 'Admin'
            }
            this.qaService.updateQA(item, this.bannerId).subscribe(res => {
                this.toast.success('Update success');
                this.redirectToPageList();
            }, err => {
                this.toast.error(err.error.errors.qa_answer ? err.error.errors.qa_answer['0'] : 'Errors');
            });
        }
    }

    redirectToPageList() {
        this.router.navigate([`/admin/customer/qa`]);
    }

}
