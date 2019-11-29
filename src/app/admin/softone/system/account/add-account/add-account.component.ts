import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminResourceComponent } from '../../../../resource/resource.component';
import { AccountService } from '../../../service/system/account.service';
declare var $: any;

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  @ViewChild('resource') public resource: AdminResourceComponent;
  public env: any;
  public user_no: any;
  public user = {
    role_id: 1,
    email: '',
    id: '',
    name: '',
    reg_name: '',
    allow_review: true,
    active: true,
    allow_comment: true,
  };
  public form: any;
  public roles: any;
  public isExistedID = false;
  public isExistedEmail = false;
  public isSubmitted = false;

  constructor(
    private api: Restangular,
    public activeRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private accountService: AccountService) {
  }

  ngOnInit() {
    this.initForm();
    this.env = environment;
    this.getRoles();
    this.activeRoute.params.forEach((params: Params) => {
      this.user_no = params['id'];
      if (this.user_no) {
        this.getUser(this.user_no);
      }
      else {
         this.resetFormAdd();
      }
    });
  }

  resetFormAdd() {
    setTimeout(() => {
      this.form.reset();
      this.form.get('active').setValue(true);
      this.form.get('allow_comment').setValue(true);
      this.form.get('allow_review').setValue(true);
    }, 1000);
  }

  initForm() {
    this.form = new FormGroup({
      user_no: new FormControl({ disabled: true }),
      reg_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      id: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]),
      cellphone: new FormControl(''),
      home_addr1: new FormControl(),
      userRole: new FormControl(),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      active: new FormControl(),
      allow_comment: new FormControl(),
      allow_review: new FormControl(),
    });
  }

  getUser(id) {
    this.accountService.getAccountById(id).subscribe(
      res => {
        setTimeout(() => {
        this.setValueForm(res);
        },1200)
      },
      err => {
        console.log(err);
      }
    )
  }

  setValueForm(data) {
    this.checkPhone();
    this.form.get('user_no').setValue(data.USER_NO ? data.USER_NO : '');
    this.form.get('reg_name').setValue(data.REG_NAME ? data.REG_NAME : '');
    this.form.get('id').setValue(data.ID ? data.ID : '');
    this.form.get('cellphone').setValue(data.CELLPHONE ? data.CELLPHONE : '');
    this.form.get('home_addr1').setValue(data.HOME_ADDR1 ? data.HOME_ADDR1 : '');
    this.form.get('userRole').setValue(data.role_id ? data.role_id : '');
    this.form.get('email').setValue(data.EMAIL ? data.EMAIL : '');
    this.form.get('active').setValue(data.DELETE_AT == 'N' ? true : false);
    this.form.get('allow_comment').setValue(data.allow_comment == 1 ? true : false);
    this.form.get('allow_review').setValue(data.allow_review == 1 ? true : false);

    this.form.get('password').setValidators();
  }

  getFormDataAdd() {
    let data = {
      reg_name: this.form.value.reg_name,
      email: this.form.value.email,
      password: this.form.value.password,
      cellphone: this.form.value.cellphone,
      role_id: this.form.value.userRole,
      home_addr1: this.form.value.home_addr1,
      id: this.form.value.id,
      delete_at: this.form.value.active ? 'N' : 'Y',
      allow_comment: this.form.value.allow_comment ? '1' : '0',
      allow_review: this.form.value.allow_review ? '1' : '0',
    }
    return data;
  }

  getFormDataEdit() {
    let data = {
      reg_name: this.form.value.reg_name,
      email: this.form.value.email,
      cellphone: this.form.value.cellphone,
      role_id: this.form.value.userRole,
      home_addr1: this.form.value.home_addr1,
      id: this.form.value.id,
      delete_at: this.form.value.active ? 'N' : 'Y',
      allow_comment: this.form.value.allow_comment ? '1' : '0',
      allow_review: this.form.value.allow_review ? '1' : '0',
    }
    if (this.form.value.password != '' && this.form.value.password.length > 5) {
      data['password'] = this.form.value.password;
    }
    return data;
  }

  save() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return 0;
    }
    this.accountService.addAccountAdmin(this.getFormDataAdd()).subscribe(
      res => {
        this.toast.success('Add account successfully');
        this.router.navigate([`/admin/system/account`]);
      },
      err => {
        this.toast.error(err.error.errors.message);
      });
  }

  getRoles() {
    this.accountService.getAccount('/api/admin/role-admin-fime').subscribe(res => {
      console.log("role",res);
      
      this.roles = res['data'];

      setTimeout(() => {
        this.form.get('userRole').setValue(1);
      }, 800);
    });
  }

  showErrors(data) {
    let message = '';
    if (data.error.errors) {
      if (data.error.errors.cellphone) {
        message = data.error.errors.cellphone['0'];
      }
      else if (data.error.errors.email) {
        message = data.error.errors.email['0'];
      }
      else if (data.error.errors.home_addr1) {
        message = data.error.errors.home_addr1['0'];
      }
      else if (data.error.errors.id) {
        message = data.error.errors.id['0'];
      }
      else if (data.error.errors.password) {
        message = data.error.errors.password['0'];
      }
      else if (data.error.errors.reg_name) {
        message = data.error.errors.reg_name['0'];
      }
    }
    message = message == '' ? 'Errors' : message;
    this.toast.error(message);
  }

  updateEdit() {
    if (this.form.invalid) {
      return 0;
    }
    if (this.user_no) {
      this.accountService.editAccountAdmin(this.user_no, this.getFormDataEdit()).subscribe(
        res => {
          this.toast.success('Edit account successfully');
          this.router.navigate([`/admin/system/account`]);
        },
        err => {
          this.toast.error(err.error.errors ? err.error.errors.message : 'Something went wrong');
        });
    } else {
      this.router.navigate([`/admin/system/account`]);
    }
  }

  checkPhone (){
    console.log("2",this.form.value.cellphone);
    if (this.form.value.cellphone != '') {
      this.form.controls["cellphone"].setValidators([Validators.pattern('^[0-9]+$')])
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
