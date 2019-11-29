import {
    Directive,
    HostListener,
    ElementRef,
    Renderer,
    Input,
    Output,
    EventEmitter,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../services/cookie.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';


@Directive({
    selector: '[appAuth]'
})

export class AuthDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('appAuth') appAuth: string;

    @Output()
    public action = new EventEmitter();

    public token: any;

    @ViewChild('confirmSwal') private confirmSwal: SwalComponent;

    @HostListener('click', ['$event']) onClick($event) {
        if (this.token) {
            this.action.emit(null);
        } else {
            this.confirmSwal.show();
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer,
        private api: Restangular, private cookie: CookieService,
        private router: Router) {
        this.confirmSwal = new SwalComponent({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn-hero btn-danger',
            cancelButtonClass: 'btn-hero btn-cancel',
            text: 'Vui lòng đăng nhập',
            type: 'info',
            preConfirm: this.redirectToLoginPage
        });
        this.token = this.cookie.get('X-Token');
    }
    redirectToLoginPage = () => {
        const href = this.router.url;
        console.log('/login?redirect=' + href);
        this.router.navigate(['/login'], {queryParams: {redirectUrl: href}});
    }
}
