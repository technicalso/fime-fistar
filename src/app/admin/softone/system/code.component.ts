import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CodesService } from '../service/system/codes.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '../../shared/service/pager.service';
import { count } from 'rxjs/operators';
declare var $: any;


@Component({
    selector: 'app-admin-system-code',
    templateUrl: './code.component.html',
    styleUrls: [
        './code.component.scss'
    ],
    providers: [PagerService]
})
export class AdminSystemCodeComponent implements OnInit {
    public fistars: any = [];
    public message: string;
    public valueMainCode:any={};
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    modalRef: BsModalRef;
    formGroup: FormGroup;
    formSearch: FormGroup;
    formSubCode: FormGroup;
    formMainCode: FormGroup;
    image_activeImage: File;
    image_inactiveImage: File;

    data = {
        header: [
            [{ value: 'No', row: '2' },
            { value: 'Main Code Name', row: '2' },
            { value: 'Sub Code', col: '6' },],
            [{ value: 'Icon Active' },
            { value: 'Icon Inactive' },
            { value: 'Name' },
            { value: 'Date' },
            { value: 'State' },
            { value: 'Action' },]

        ],
        list: [],
        total_page: 0,
        page: 1,
    };
    searchCode = [];
    parent = [];
    titleMainCode = 'Create Main Code';
    actionMainCode = 'add';
    titleSubCode = 'Create Sub Code';
    idGroupCode;
    total = 0;
    pager = {};
    total_item = 0;
    page_current = 1;
    idSubCode = '';
    actionSubCode = 'add';
    urlImage = '/storage/codes/';
    isSearch = false;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService,
        private codeService: CodesService,
        private formBuilder: FormBuilder,
        private pagerService: PagerService
    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.getData();
        this.initForm();
        this.initFormSubCode();
        this.initFormMainCode();
        this.getSearchCodes();
    }

    initForm() {
        this.formGroup = this.formBuilder.group({
            cdg_name: [''],
            cdg_state: [''],
        });
        this.formSearch = this.formBuilder.group({
            name: [''],
            mainCode: [''],
            state: ['']
        });
    }

    initFormSubCode() {
        this.formSubCode = this.formBuilder.group({
            mainCode: ['', Validators.required],
            subCode: ['', Validators.required],
            codeStatus: ['', Validators.required],
            activeImage: [''],
            inactiveImage: [''],
        });
    }

    initFormMainCode() {
        this.formMainCode = this.formBuilder.group({
            cdg_name: ['', Validators.required],
            cdg_state: ['', Validators.required],
        });
    }

    openModal(template: TemplateRef<any>, action, item?) {
        console.log(this.valueMainCode,'tét');
        switch (action) {
            case 'add_main':
                this.titleMainCode = 'Add Main Code';
                this.actionMainCode = 'add';
                this.formMainCode.controls['cdg_name'].setValue('');
                this.formMainCode.controls['cdg_state'].setValue('');
                this.idGroupCode = '';
                break;
            case 'add_sub':
                this.titleSubCode = "Create Sub Code";
                this.formSubCode.reset();
                this.idSubCode = '';
                this.formSubCode.controls['mainCode'].setValue(this.valueMainCode.cdg_id);
                this.actionSubCode = 'add';
                
                break;
            case 'edit':
                this.formMainCode.controls['cdg_name'].setValue(item.cdg_name);
                this.formMainCode.controls['cdg_state'].setValue(item.cdg_state);
                this.idGroupCode = item.cdg_id;
                this.titleMainCode = 'Edit Main Code';
                this.actionMainCode = 'edit';
                break;
            case 'editSub':
                this.idSubCode = item.cd_id;
                this.titleSubCode = "Edit Sub Code";
                console.log(item);
                this.formSubCode.controls['mainCode'].setValue(item.cdg_id);
                this.formSubCode.controls['codeStatus'].setValue(item.cd_state);
                this.formSubCode.controls['subCode'].setValue(item.cd_label);
                this.actionSubCode = 'edit';

                break;
        }
        this.getSearchCodes();

        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');

    }

    convertData(data) {
        
        let arr = [];
        let count = 1;
        for (let index = 0; index < data.length; index++) {
            if (data[index]['code']) {
                for (let i = 0; i < data[index]['code'].length; i++) {
                    data[index]['code'][i]['index'] = count;
                    if (i == 0) {
                        data[index]['code'][i]['cdg_name'] = data[index]['cdg_name'];
                    }
                    else{
                        data[index]['code'][i]['cdg_name'] = '';
                    }
                    data[index]['code'][i]['cdg_id'] = data[index]['cdg_id'];
                    data[index]['code'][i]['cdg_state'] = data[index]['cdg_state'];

                    count++;
                }
                let obj = {
                    controls: [
                        { value: 'Edit', link: `/admin/customer/faq/add/${data[index]['faq_id']}` },
                        { value: 'Disable', link: '/customer/faq/add/:id' },
                        { value: 'Delete', action: 'delete', id: data[index]['faq_id'] }
                    ],
                    content: [
                        { title: data[index]['code'] },
                    ],
                    main_code: data[index]
                };
                arr.push(obj);
            }

        }
        return arr;
    }

    convertShowImage(url) {
        let responsive;
        responsive = url && url != '' ? (this.env.host_fistar + this.urlImage + url) : '';
        return responsive;
    }

    getSearchCodes() {
        console.log(this.formMainCode.value.cdg_name);
        const link = '/api/admin/code-groups?cdg_parent&type=1&paginate=10000000';
        this.codeService.getCodes(link).subscribe(res => {
            this.searchCode = res['data'];
            console.log(this.searchCode);
        }, err => {
            console.log(err);
        });
    }

    getData(page?) {
        this.isSearch = false;
        this.data.list = [];
        let link = '/api/admin/list-code?page=1';
        if (page) {
            link = `/api/admin/list-code?page=${page}`;
        }
        this.codeService.getCodes(link).subscribe(res => {
            if (page) {
                this.data.page = page;
            }
            this.data.total_page = res['total'];
            let data = res['data'];
            data =_.unionWith(data,_.isEqual)
            // this.data.list = this.convertData(res['data']);
            this.data.list = this.convertData(data);
            this.total_item = res['total'];
            this.total = res['total'];
            this.pager = this.pagerService.getPager(this.total_item, page, 15);

            console.log( this.data.list ,'test data');
            for(let item of this.data.list ){
                console.log( item.content[0].title.length,'test data');
            }

            this.data.list.map((item, index) => {
                item.content[0].title.map(() => {
                    this.data.list[index].content[0].title.lengthColumn = item.content[0].title.length;
                })
                
            });
            for(let item of this.data.list ){
                console.log( item,'map');
            }
            // console.log(this.data.list[0].content[0].,'map')
        }, err => {
            console.log(err);
        });
    }

    getItemMainCode() {
        let item = {
            cdg_name: this.formMainCode.value.cdg_name,
            cdg_state: this.formMainCode.value.cdg_state,
            cdg_parent: 1
        }
        return item;
    }

    addData(action) {
        if (action == 'add') {
            if (this.formMainCode.valid) {
                let item = this.getItemMainCode();

                this.codeService.createCodeGroup(item).subscribe(res => {
                    this.toast.success("Add main code success");
                    this.modalRef.hide();
                    this.getData();
                    this.getSearchCodes();

                }, err => {
                    this.showErrors(err);
                })
            } else {
                this.toast.error("Errors");

            }
        } else {
            this.updateCodeGroup(this.idGroupCode);
        }
    }

    updateCodeGroup(id) {
        if (id) {
            if (this.formMainCode.valid) {
                let item = this.getItemMainCode();
                this.codeService.updateCodeGroup(id, item).subscribe(res => {
                    this.toast.success("Update success");
                    this.modalRef.hide();
                    this.getData();
                    this.getSearchCodes();
                }, err => {
                    this.showErrors(err);
                });
            } else {
                this.toast.error("Errors");
            }
        }
        else {
            this.toast.error("Errors");
        }

    }

    showErrors(data) {
        let message = '';
        if (data.error.errors && data.error.errors.cdg_name) {
            message = data.error.errors.cdg_name['0'];
        }
        message = message == '' ? 'Errors' : message;
        this.toast.error(message);
    }

    search(param?) {
        let mainCode = this.formSearch.value.mainCode;
        console.log(mainCode,'fdsfsd');
        this.valueMainCode =  this.searchCode.filter(function(value) {
            return value.cdg_id == mainCode;
        });
        this.valueMainCode = this.valueMainCode[0];
        console.log(this.valueMainCode,'test');
        this.isSearch = true;
        if (this.formSearch.value.name == '' && this.formSearch.value.state == '' && this.formSearch.value.mainCode == '') {
            return this.getData(1);
        }
        let page = param ? param : 1;
        this.codeService.searchCode(this.formSearch.value.name, this.formSearch.value.state, this.formSearch.value.mainCode, page).subscribe(res => {

            this.data.list = this.convertData(res['data']);
            this.data.total_page = res['total'];
            this.total_item = res['total'];
            this.total = res['total'];
            this.pager = this.pagerService.getPager(this.total_item, page, 15);
            
        }, err => {
            console.log(err);
        });
    }

    resetFormSearch() {
        this.formSearch.reset();
        this.formSearch.controls.mainCode.setValue('');
        this.formSearch.controls.state.setValue('');
        this.formSearch.controls.name.setValue('');
        this.getData(1);
        this.isSearch = false;
    }

    setcpImage(event, action) {
        let control = this.formSubCode.controls.activeImage;
        if (action === 'inactive') {
            control = this.formSubCode.controls.inactiveImage;
        }
        if (event.target.files[0]) {
            control.setValue(event.target.files[0]);
        }
    }

    createSubCode() {
        if (this.formSubCode.valid) {
            let data = this.getBodySubCode();
            this.codeService.createCodes(data).subscribe(res => {
                this.updateSuccess('Add Sub Code Success');
                this.getSearchCodes();
            }, err => {
                this.toast.error('Errors');
            });
        }
    }


    getBodySubCode() {
        let formsDatas = new FormData();
        if (this.formSubCode.value.activeImage != '' && this.formSubCode.value.activeImage) formsDatas.append('cd_active_icon', this.formSubCode.value.activeImage);
        if (this.formSubCode.value.inactiveImage != '' && this.formSubCode.value.inactiveImage) formsDatas.append('cd_inactive_icon', this.formSubCode.value.inactiveImage);
        formsDatas.append('cd_label', this.formSubCode.value.subCode);
        formsDatas.append('cd_state', this.formSubCode.value.codeStatus);
        formsDatas.append('cdg_id', this.formSubCode.value.mainCode);
        return formsDatas;
    }

    updateSuccess(message) {
        this.toast.success(message);
        this.modalRef.hide();
        this.getData();
        this.getSearchCodes();
    }



    delete(id) {
        let r = window.confirm('Do you delete it?');
        if (r) {
            let body = {
                cd_ids: [id]
            }
            this.codeService.deleteCode(body).subscribe(res => {
                this.toast.success('Delete success');
                this.getData();
            }, err => {
                console.log(err);
            });
        }
    }

    updateCode() {
        if (this.idSubCode != '') {
            let data = this.getBodySubCode();
            this.codeService.updateCode(this.idSubCode, data).subscribe(res => {
                this.updateSuccess('Edit Sub Code Success');
                this.getSearchCodes();
            }, err => {
                this.toast.error('Erros');
            });
        }
        else {
            this.toast.error('Erros');
        }

    }

    choosepage(page) {
        if (page < Number(this.pager['totalPages']) + 1) {
            if (this.isSearch) {
                this.search(page);
            }
            else {
                this.getData(page);
            }
        }
    }

    deleteMainCode(cdg_id){
        this.codeService.deleteCodes(cdg_id).subscribe((res:any) => {
           this.ngOnInit();
           this.toast.success('delete  main code success');
        })
    }

}
