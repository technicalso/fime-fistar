import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { PagerService } from '../service/pager.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientAdminService } from '../service/httpclient.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() items: {}[];
  @Input() headers: {}[];
  @Input() groupHeaders: {}[];
  @Input() isCheckItem: Boolean = false;
  @Input() showPage = true;
  @Input() isCheckItemRadio = false;
  @Input() pageSize = 10;
  @Input() totalPage;
  @Input() currentPage = 1;

  @Input() showNumberTotalDataTable = false;

  @Output() outputCheck = new EventEmitter();
  @Output() outputPage = new EventEmitter();
  @Output() outputSelect = new EventEmitter();
  @Output() outputOption = new EventEmitter();
  @Output() outputRow = new EventEmitter();
  @Output() outputTab = new EventEmitter();
  @Output() outputSns = new EventEmitter();

  @Output() getId = new EventEmitter();
  @Output() disab = new EventEmitter();

  @Output() access = new EventEmitter();
  @Output() outputShowModal = new EventEmitter();

  @Output() public outputReloadData = new EventEmitter();



  allItems: {}[];
  pager: any = {};
  pagedItems: {}[];
  isCheckAll: boolean = false;
  actionIndex = 0;
  dropdown = false;
  userAccess = {
    users: []
  };
  isBackgroundSelector = false;

  constructor(
    private campaignService: HttpClientAdminService,
    private pagerService: PagerService,
    private router: Router,
    private toa: ToastrService,
  ) {
  }

  ngOnInit() {

  }

  ngOnChanges(change) {
    this.isCheckAll = false;
    this.allItems = this.items;
    this.setPage(this.currentPage);
  }

  setNumberTotalPage() {
    if (this.showNumberTotalDataTable) {
      $('#numberTotal').text(this.pager['totalItems']);
    }
  }

  setPage(page) {


    this.pager = this.pagerService.getPager(this.totalPage, page, this.pageSize);
    this.setNumberTotalPage();
  }

  choosepage(page: number) {
    if (page < Number(this.pager['totalPages']) + 1) {
      this.outputPage.emit(page);
    }
  }

  onChange(event, value) {
    let check = event.currentTarget.checked;
    if (value === 'all') {
      this.isCheckAll = check;
      this.updateSelect(check);
    } else {
      let isAllCheck = true;
      _.forEach(this.items, (item, key) => {
        if (key === value) {
          item['check'] = check;
        }
        if (!item['check']) {
          isAllCheck = false;
        }
      });
      this.isCheckAll = isAllCheck;
    }
    let tmp = _.filter(this.items, function (o) {
      return o['check'];
    });
    this.outputCheck.emit({ value: tmp });
  }

  updateSelect(check) {
    _.forEach(this.allItems, (item, key) => {
      item['check'] = check;
    });
  }


  selectOption(items) {
    this.outputSelect.emit({ item: items, action: this.actionIndex });
  }
  delete(id) {
    this.getId.emit(id);
  }

  // changeDisabled(id)
  // {}

  // handleAction(it, item) {
  //   this.outputOption.emit({ action: it, item: item });
  // }
  changeDisabled(id) {
    this.disab.emit(id);
  }

  changeToDisabledStateCampaign(id) {
    let body = {
      cp_ids: [id],
      cp_state: 2,
    }
    this.campaignService.postData('api/admin/update-many/campaign', body).subscribe(
      res => {
        if (res['success']) {
          this.toa.success('Disabled successfully');
          this.outputReloadData.emit();
        }
      },
      err => {
        this.toa.error(err.error.message);
      }
    );
  }

  changeToEnabledStateCampaign(id) {
    let body = {
      cp_ids: [id],
      cp_state: 1,
    }
    this.campaignService.postData('api/admin/update-many/campaign', body).subscribe(
      res => {
        if (res['success']) {
          this.toa.success('Enabled successfully');
          this.outputReloadData.emit();
        }
      },
      err => {
        this.toa.error(err.error.message);
      }
    );
  }

  displaySub(event) {
    this.showDivHideSelector();
    const subs = document.querySelectorAll('.sub-control');
    subs.forEach(item => {
      item.classList.remove('dis');
    });
    event.target.nextElementSibling.classList.add('dis');
  }
  // displaySub(event)
  // {
  //   this.dropdown = true;

  showDivHideSelector() {
    this.isBackgroundSelector = true;
  }

  hideSelector() {
    this.isBackgroundSelector = false;
    $('.sub-control').removeClass('dis');
  }

  handleAction(it, item) {
    this.outputOption.emit({ action: it, item: item });
  }

  getAccess(event, user_no) {
    let item = {
      user_no: user_no,
      role_id: event.target.value
    }
    this.userAccess.users.push(item);
    this.access.emit(this.userAccess);
  }

  selectRow(item) {
    this.outputRow.emit(item);
  }

  leave() {
    const subs = document.querySelectorAll('.sub-control');
    subs.forEach(item => {
      item.classList.remove('dis');
    });
  }

  opennew(item) {
    this.outputTab.emit(item);
  }

  updateSnsStatus(item) {
    this.outputSns.emit(item);
  }

  showModal(item) {
    this.outputShowModal.emit(item);
  }

  goTolink(link, idMatching, idChannel) {
    this.router.navigate([`${link}`],
      { queryParams: { idMatching: idMatching, idChannel: idChannel } });
  }

  toaz (type) {
    switch (type) {
      case 'matched':
        this.toa.warning("This fistar is matched");
        break;
      case 'cancel':
        this.toa.warning("This fistar is rejected")
        break;
    }
  }
}
