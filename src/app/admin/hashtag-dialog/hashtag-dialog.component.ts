import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-hashtag-dialog',
  templateUrl: './hashtag-dialog.component.html',
    styleUrls: ['./hashtag-dialog.component.scss']
})
export class AdminHashtagDialogComponent implements OnInit {

  public env: any;
  public form: any;
  public hashtag: any;
  public onClose: Subject<boolean>;

  constructor(
    private api: Restangular,
    private toast: ToastrService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.form = new FormGroup({
      name: new FormControl(this.hashtag.hash_tag,[Validators.required])
    })
  }

  onSave(){
    if (this.hashtag.hash_seq) {
      this.api
          .one('hashtag', this.hashtag.hash_seq)
          .customPUT(this.hashtag)
          .subscribe(res => {
              if (res.result) {
                  this.toast.success(
                      'Hashtag has been updated successfully.'
                  );
                  this.onClose.next(true);
                  this.bsModalRef.hide();
              }
          });
    } else {
      this.api
          .all('hashtag')
          .post(this.hashtag)
          .subscribe(res => {
              if (res.result) {
                  this.toast.success(
                      'Hashtag has been created successfully.'
                  );
                  this.onClose.next(true);
                  this.bsModalRef.hide();
              }
          });
      }
  }

  close() {
    this.bsModalRef.hide();
  }
}
