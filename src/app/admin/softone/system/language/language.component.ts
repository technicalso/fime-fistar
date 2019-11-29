import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LanguageService } from '../../service/system/language.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '../../../shared/service/pager.service';
import { count } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'app-admin-system-language',
    templateUrl: './language.component.html',
    styleUrls: [
        './language.component.scss'
    ],
    providers: [PagerService]
})
export class AdminSystemLanguageComponent implements OnInit {
    public fistars: any = [];
    public message: string;

    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    modalRef: BsModalRef;
    formUICode: FormGroup;
    formUnitCode: FormGroup;
    formSearch: FormGroup;
    header = ['No', 'UI Code', 'Unit Code', 'Unit Code Contents', 'Language', 'State', 'Action'];
    data = [];
    dataLang: any;
    subLang = {
        en: 'English',
        vi: 'Vietnamese',
        ko: 'korean'
    }
    uiCodes = [];
    unitCodes = [];
    idUi: any;
    unitCodeForm = {
        uiCode: '',
        unitCode: '',
        en: '',
        vi: '',
        ko: '',
        codeStatus: ''
    }
    ideditUI;
    newLang = {};
    statusEdit;
    dataGroupTable = [];
    isEditUnitCode = false;
    contentLang = [];
    idEditUnitCode;
    isSearch = false;
    pager = {};
    total_item = 0;
    page_current = 1;
    path;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private languageService: LanguageService,
        private formBuilder: FormBuilder,
        private pagerService: PagerService
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.getData(1);
        this.getListLangSelectSearch();
        this.initForm();
    }

    getUICode() {
        this.languageService.getUICode(`/api/admin/ui-codes?paginate=100000`).subscribe(res => {
            this.uiCodes = res['data'];
        },
            err => {
                console.log(err);
            }
        );
    }

    getListLangSelectSearch() {
        this.languageService.getUICode(`/api/languages`).subscribe(res => {
            this.dataLang = res;
            let item = [];
            for (let i = 0; i < this.dataLang.length; i++) {
                item[i] = this.dataLang[i] + ' ' + (this.dataLang[i++] > this.dataLang.length) ? this.dataLang[i] : this.dataLang[i++];
            }
        });
    }

    initForm() {
        this.formUICode = this.formBuilder.group({
            uic_code: ['', Validators.required],
            status: ['', Validators.required]
        });
        this.formUnitCode = this.formBuilder.group({
            uiCode: ['', Validators.required],
            unitCode: ['', Validators.required],
            codeStatus: [''],
        });
        this.formSearch = this.formBuilder.group({
            filter: ['uicode'],
            keyword: [''],
            language: ['all'],
            state: ['all']
        });
    }

    openModal(template: TemplateRef<any>, action, data?) {
        this.getUICode();

        switch (action) {
            case 'editUIC':
                this.statusEdit = true;
                if (data) {
                    this.idEditUnitCode = data.unc_id;
                    this.languageService.getUICode(`/api/admin/unit-codes/${this.idEditUnitCode}`).subscribe(res => {
                        this.formUnitCode.controls['uiCode'].setValue(res['uic_id']);
                        this.formUnitCode.controls['unitCode'].setValue(res['unc_code']);
                        for (let index = 0; index < res['unitcodecontents'].length; index++) {
                            $("#" + res['unitcodecontents'][index]['lang_id'] + "_lang").val(res['unitcodecontents'][index]['unc_content']);
                        }
                    });
                }
                break;
            case 'editUI':
                if (data) {
                    this.languageService.getUICode(`/api/admin/ui-codes/${data}`).subscribe(res => {
                        this.formUICode.controls['uic_code'].setValue(res['uic_code']);
                        this.formUICode.controls['status'].setValue(res['uic_state']);
                    });
                    this.ideditUI = data;
                }
                break;
            default:
                this.formUnitCode.reset();
                this.formUICode.reset();
                this.statusEdit = false;
                break;
        }
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }

    getData(page) {
        this.data = [];
        let link = `/api/admin/ui-code-contents?page=${page}&sort=uic_id&order=desc`;
        this.isSearch = false;
        this.languageService.getUICode(link).subscribe(res => {
            this.total_item = res['total'];
            this.pager = this.pagerService.getPager(this.total_item, page, 10);
            this.convertData(res['data']);
        });
    }

    groupRowLanguage(data) {
        this.dataGroupTable = [];
        let responsive = [];
        let index = '';
        let countGr = 1;
        let countGroup = 0;
        data.forEach((item, i) => {
            if (i != 0) {
                if (index == item.uic_id) {
                    countGr++;
                    responsive[item.uic_id] = countGr;
                }
                else {
                    index = item.uic_id;
                    responsive[item.uic_id] = 1;
                    countGr = 1;
                }
            }
            else {
                index = item.uic_id;
            }
        });

        data.forEach((item, i) => {
            if (i != 0) {
                if (index == item.uic_id) {
                    countGroup++;
                    this.pushDataGroup(responsive, index, countGroup);
                }
                else {
                    index = item.uic_id;
                    countGroup = 0;
                    this.pushDataGroup(responsive, index, 0);
                }
            }
            else {
                index = item.uic_id;
                this.pushDataGroup(responsive, index, 0);
            }
        });
        return this.dataGroupTable;
    }

    pushDataGroup(responsive, uic_id, number) {
        let count_push = 1
        responsive.forEach((value, key) => {
            if (key == uic_id && count_push == 1) {
                this.dataGroupTable.push([value, number]);
                count_push++;
            }
        });
    }

    convertLang(data) {
        let arr = data.split(',');
        let lang_en = arr.indexOf('1') > -1 ? 'EN' : '';
        let lang_vi = arr.indexOf('2') > -1 ? 'VI' : '';
        let lang_ko = arr.indexOf('3') > -1 ? 'KO' : '';
        let lang = lang_en + (lang_en != '' ? ' ' : '') + lang_vi + (lang_vi != '' ? ' ' : '') + lang_ko;
        return lang;
    }

    convertData(data) {
        let groupArray = this.groupRowLanguage(data);
        data.forEach((item, i) => {
            let newItem = {
                uic: '',
                unc: '',
                uncContents: '',
                lang: '',
                state: '',
                arrLang: [],
                uic_id: 0,
                rowspan: 1,
                index: 0,
                contents: [],
                unc_id: ''
            }
            newItem.uic_id = item.uic_id;
            newItem.unc_id = item.unc_id
            newItem.uic = item.uic_code;
            newItem.unc = item.unc_code;
            newItem.state = item.unc_state;
            newItem.uncContents = item.unc_content;
            newItem.lang = this.convertLang(item.lang);
            newItem.arrLang = [' '];
            newItem.contents = item.contents['0'];

            for (let j = 0; j < groupArray.length; j++) {
                if (j == i) {
                    newItem.rowspan = groupArray[j][0];
                    newItem.index = groupArray[j][1];
                    break;
                }
            }
            this.data.push(newItem);
            newItem = {
                uic: '',
                unc: '',
                uncContents: '',
                lang: '',
                state: '',
                arrLang: [],
                uic_id: 0,
                rowspan: 1,
                index: 0,
                contents: [],
                unc_id: ''
            }

        });
    }

    createUICode() {
        let link = '/api/admin/ui-codes';
        let body = {
            uic_code: this.formUICode.value.uic_code,
            uic_state: this.formUICode.value.status
        }
        if (this.ideditUI) {
            link = `/api/admin/ui-codes/${this.ideditUI}`;
            this.languageService.updateUiCode(body, this.ideditUI).subscribe(res => {
                this.toast.success('Success');
                this.modalRef.hide();
                this.resetForm();
                this.getData(1);
            }, err => {
                this.toast.error(err.error.message);

            })
        } else {
            this.languageService.createCode(link, body).subscribe(res => {
                this.toast.success('Success');
                this.modalRef.hide();
            }, err => {
                this.toast.error(err.error.message);
            });
        }
    }

    updateUICode() {
        let body = {
            uic_code: this.formUICode.value.uic_code,
            status: this.formUICode.status
        }
        this.languageService.updateUiCode(body, this.idUi).subscribe(res => {
            this.toast.success('Success');
            this.resetForm();
            this.getData(1);
        }, err => {
            this.toast.error(err.error.message);

        })
    }

    saveUnitCode() {
        let body = this.getBodyUnitCode();
        if (this.contentLang.length == 0) {
            return this.toast.error('Please enter language content');
        }

        if (this.statusEdit && this.idEditUnitCode) {
            this.languageService.update(this.idEditUnitCode, body).subscribe(res => {
                this.toast.success('Success');
                this.modalRef.hide();
                this.resetForm();
                this.getData(1);

            }, err => {
                this.toast.error(err.error.message);
            });
        } else {
            let link = '/api/admin/unit-code-contents';
            this.languageService.createCode(link, body).subscribe(res => {
                this.toast.success('Success');
                this.modalRef.hide();
                this.resetForm();
                this.getData(1);
            }, err => {
                this.toast.error('Errors');

            })
        }
    }

   

    getBodyUnitCode() {
        this.contentLang = [];
        let body = {
            uic_id: this.formUnitCode.value.uiCode,
            "unc_code": this.formUnitCode.value.unitCode,
            "contents": []
        }
        const langs = document.querySelectorAll('.lang textarea');
        langs.forEach(item => {
            let newItem = item as HTMLInputElement;
            body['contents'].push({ lang_id: item.getAttribute('lang'), unc_content: newItem.value });
            if (newItem.value != '') {
                this.contentLang.push({ lang_id: item.getAttribute('lang'), unc_content: newItem.value });
            }
        });
        return body;
    }

    delete(id) {
        let body = {
            unc_ids: [id]
        }
        let r = window.confirm('Do you delete it?');
        if (r) {
            this.languageService.deleteCode(body).subscribe(res => {
                this.toast.success('Success');
                this.resetForm();
            }, err => {
                this.toast.error('Error');
            });
        }
    }


    search(page, type?) {
        if (!type && type != 'pagination') {
            page = 1;
        }
        this.data = [];
        const valueSearch = this.formSearch.value;
        this.isSearch = true;
        let filter = valueSearch.filter != '' && valueSearch.keyword != '' ? `filter=${valueSearch.filter}&keyword=${valueSearch.keyword}` : '';
        let language = valueSearch.language != 'all' ? ((filter != '' ? '&' : '') + `lang_id=${valueSearch.language}`) : '';
        let state = valueSearch.state != 'all' ? ((language != '' || filter != '' ? '&' : '') + `uic_state=${valueSearch.state}`) : '';
        this.path = `/api/admin/ui-code-contents?sort=uic_id&order=desc&` + filter + language + state;
        if (this.path == '/api/admin/ui-code-contents?sort=uic_id&order=desc&') {
            this.reset();
        }

        this.languageService.searchLanguage(this.path, page).subscribe(res => {
            this.total_item = res['total'];
            this.pager = this.pagerService.getPager(this.total_item, page, 10);
            this.convertData(res['data']);
        }, err => {
        });
    }

    reset() {
        this.formSearch.controls.keyword.setValue('');
        this.formSearch.controls.language.setValue('all');
        this.formSearch.controls.state.setValue('all');
        this.formSearch.controls.filter.setValue('uicode');
        this.path = '';
        this.getData(1)
    }

     resetForm() {
        this.formUICode.reset();
        this.formUnitCode.reset();
        this.formSearch.reset();
        this.formSearch.controls.keyword.setValue('');
        this.formSearch.controls.language.setValue('all');
        this.formSearch.controls.state.setValue('all');
        this.formSearch.controls.filter.setValue('uicode');
        this.path = '';
        this.getData(1);
    }


    choosepage(page) {

        if (page < Number(this.pager['totalPages']) + 1) {
            if (this.isSearch) {
                this.search(page, 'pagination');
            }
            else {
                this.getData(page);
            }
        }
    }
}
