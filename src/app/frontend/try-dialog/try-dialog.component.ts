import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../services/cookie.service';
// import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-try-dialog',
    templateUrl: './try-dialog.component.html',
    styleUrls: ['./try-dialog.component.scss']
})
export class TryDialogComponent implements OnInit {
    public confirmationAddress = true;
    public confirmationInfo = true;
    public env: any;
    public token: any;
    public form: any;
    public tryItem: any;
    public onClose: Subject<boolean>;
    public user: any;
    public isLoading: any;
    public tryType: any;

    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        public bsModalRef: BsModalRef
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.token = this.cookieService.get('X-Token');
        this.env = environment;
        this.isLoading = false;
    }

    onSave() {
        if (!this.confirmationAddress) {
            this.toast.error('Bạn cần phải xác nhận địa chỉ được giao.');
            return;
        }

        if (!this.confirmationInfo) {
            this.toast.error('Bạn phải xác nhận nội dung của ghi chú.');
            return;
        }

        if (!this.user.cellphone) {
            this.toast.error('Vui lòng cập nhật số điện thoại để thử miễn phí sản phẩm.');
            return;
        }

        if (!this.user.home_addr1) {
            this.toast.error('Vui lòng cập nhật địa chỉ thử miễn phí sản phẩm.');
            return;
        }

        this.api.all('user-tries').customPOST({try_id: this.tryItem.cntnts_no}).subscribe(res => {
            if (res.result !== false) {
                this.toast.success('Đăng ký nhận sản phẩm miễn phí thành công.');
                this.onClose.next(res.result);
                this.bsModalRef.hide();
            } else {
                this.toast.error('Bạn đã đăng ký sử dụng sản phẩm này.');
            }
        });
    }

    close() {
        this.bsModalRef.hide();
    }
}
