import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
// import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AdminCategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { AdminHashtagDialogComponent } from '../hashtag-dialog/hashtag-dialog.component';

@Component({
  selector: 'app-admin-hashtag-component',
  templateUrl: './hashtag.component.html',
    styleUrls: [
        './hashtag.component.scss'
    ]
})
export class AdminHashtagComponent implements OnInit {
  public hashtags = [];
  public selected = [];
  public env: any;
  public modalRef: BsModalRef;
  public pageSize = 10;
  public showDeactivate = false;
  public showActive = false;
  public pageLimitOptions = [];
  public total: any;
  public pageIndex = 1;
  public filter = {
        name: null,
        status: 'null'
    };
  constructor(private api: Restangular,
              private toast: ToastrService,
              public modalService: BsModalService
              ) { }

  ngOnInit() {
    this.env = environment;
    this.pageSize = 10;
    this.pageLimitOptions = [
        {value: 5},
        {value: 10},
        {value: 20},
        {value: 25},
        {value: 50}
    ];
    this.getHashtag();
  }

  changePageLimit(limit: any): void {
      this.pageSize = limit;
      this.getHashtag();
  }
  setPage(pageInfo) {
      this.pageIndex = pageInfo.offset + 1;
      this.getHashtag();
  }

  onSearch() {
      this.pageIndex = 1;
      this.getHashtag();
  }

  onReset() {
      this.filter = {
          name: null,
          status: 'null'
      };
      this.pageIndex = 1;
      this.getHashtag();
  }

  getHashtag(){
    this.api.all('hashtag').customGET('',{page: this.pageIndex,pageSize: this.pageSize,name: this.filter.name, status: this.filter.status}).subscribe(
      res => {
        this.hashtags = res.result.data;
        this.total = res.result.total;
      });
  }

  addHashtag() {
    const initialState = {
      hashtag: {}
    };
    this.modalRef = this.modalService.show(
      AdminHashtagDialogComponent,
        {initialState}
    );

    this.modalRef.content.onClose.subscribe(result => {
        this.getHashtag();
    });
  }

  editHashtag(hashtag) {
      const initialState = {
        hashtag: _.cloneDeep(hashtag)
      };
      this.modalRef = this.modalService.show(
        AdminHashtagDialogComponent,
          {initialState}
      );

      this.modalRef.content.onClose.subscribe(result => {
          this.getHashtag();
      });
  }

  onDelete(row) {
    this.api
        .one('hashtag', row.hash_seq)
        .customDELETE('')
        .subscribe(res => {
            if (res.result) {
                this.getHashtag();
                this.toast.success('The hashtag has been deleted');
            }
        });
  }

  onToggle(rows, toggle) {
    const ids = _.map(rows, 'hash_seq');

    this.api.all('hashtag').customPUT({ ids: ids, toggle: toggle }, 'toggle').subscribe(res => {
        if (res.result) {
            for (const row of rows) {
                row.status = toggle ? 1 : 0;
            }

            if (toggle) {
                this.toast.success('The hastag has been display');
            } else {
                this.toast.success('The hastag has been hidden');
            }
            this.selected = [];
        }
    });
  }

  onToggleMulti(toggle) {
    if (this.selected.length > 0) {
        this.onToggle(this.selected, toggle);
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    if (this.selected.length > 0) {

        let showDeactivate = true;
        let showActive = true;
        for (const item of this.selected) {
            if (item.status === '0') {
                showDeactivate = false;
            } else {
                showActive = false;
            }
        }

        this.showDeactivate = showDeactivate;
        this.showActive = showActive;
    } else {
        this.showDeactivate = false;
        this.showActive = false;
    }
  }

}
