import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../../../services/cookie.service';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    public user: any;
    public isLoading = true;
    public showSidebar = false;
    constructor(private api: Restangular, public translate: TranslateService,
        private cs: CookieService, private router: Router) {
        translate.use('en');
    }

    ngOnInit() {
        this.user = {};
        if (this.cs.get('X-Token')) {
            this.getProfile();
        } else {
            this.isLoading = false;
            this.router.navigate(['/admin/login']);
        }
    }

    getProfile() {
        this.api.all('fimers').customGET('profile').subscribe(res => {
            this.isLoading = false;
            this.showSidebar = true;
            if (res.result && res.result.isOwner) {
                // document.getElementsByClassName('admin-sidebar')[0].classList.remove('hidden');
                this.user = res.result;
                console.log(this.user)
                // this.router.navigate(['/admin/try']);
            } else {
                this.router.navigate(['/']);
            }
        });
    }
    gotoProfile(){
        this.router.navigate(['/admin/profile']);
    }
}
