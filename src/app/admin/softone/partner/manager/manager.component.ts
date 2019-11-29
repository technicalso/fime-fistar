import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../softone/service/partner/partner.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-admin-partner-manager',
    templateUrl: './manager.component.html',
    styleUrls: [
        './manager.component.scss'
    ]
})
export class AdminPartnerManagerComponent implements OnInit {
    public partner: any = [];
    public message: string;
    public form: any;
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    public listError:any = {};
    public activeForm:boolean=false;
    public id: string;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private partnerService: PartnerService,
        private activeRoute: ActivatedRoute,

    ) {

    }

    ngOnInit() {

        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.getPartner();
        this.form = new FormGroup({
            pid: new FormControl({ value: this.partner.pid, disabled: true }, []),
            pm_name: new FormControl(this.partner.pm_name, [Validators.required]),
            pm_id: new FormControl(this.partner.pm_id, [Validators.required]),
            pm_phone: new FormControl(this.partner.pm_phone, [Validators.required]),
            email: new FormControl(this.partner.email, [Validators.required,Validators.email]),
        });

        console.log(this.partner, this.form);
    }

    getPartner() {
        this.partnerService.getPartner(this.id).subscribe((res: any) => {
            console.log(res);
            this.partner = res;
        })
    }

    updatePartner() {
        this.activeForm = true;
        console.log(this.checkListValidate() )
        if (this.checkListValidate() == true && this.form.valid == true) {
            let data = {
                type: "manager_infomation",
                pid: this.partner.pid,
                pm_name: this.partner.pm_name,
                pm_phone: this.partner.pm_phone,
                email: this.partner.email,
                pm_id: this.partner.pm_id,
            };
            this.partnerService.updatePartner(this.id, data).subscribe((res: any) => {
                console.log(res);
                this.toast.success('update success');
                this.router.navigate(['/admin/partner']);
            },(err) => {
                this.listError = err;
                console.log(this.listError.error.errors)
                this.toast.error(this.listError.error.errors.message);
            });
        }

    }

    checkListValidate() {
        
        if (
            this.partner.pm_id.length > 50 ||
            this.partner.pm_phone.toString().length>15 ||
            this.partner.pm_phone.toString().length<9 ||
            this.partner.pm_name.length>255 

        ) {
            return false;
        }
        else
            return true;
    }

}
