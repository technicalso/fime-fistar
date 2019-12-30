import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from '../../../../services/cookie.service';
import {AdminLayoutComponent} from '../admin-layout/admin-layout.component';

@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
    public showMenu: string;
    public pushRightClass: string;

    @Input()
    public user: any;

    constructor(
        private cookie: CookieService,
        public router: Router
    ) {
    }

    ngOnInit() {
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        console.log(this.router.url.indexOf('/admin/request/partner'), "ROUTER")
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        this.cookie.remove('X-Token');
        this.cookie.remove('user');
        this.router.navigate(['/admin/login']);
    }

}
