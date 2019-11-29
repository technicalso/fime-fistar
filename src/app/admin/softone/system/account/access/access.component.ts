import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../../../environments/environment';
import { AdminResourceComponent } from '../../../../resource/resource.component';
import * as moment from 'moment';
import { AccountService } from '../../../service/system/account.service';

@Component({
    selector: 'app-admin-system-account-access',
    templateUrl: './access.component.html',
    styleUrls: ['./access.component.scss']
})
export class AdminSystemAccountAccessComponent implements OnInit {
    @ViewChild('resource') public resource: AdminResourceComponent;

    public message: string;
    public categories: any;
    public env: any;
    public form: any;
    public bannerId: any;
    public banner: any;
    public required_upload_file_url: boolean;
    public imageChangedEvent: any;
    public imageBase64: any;
    public data : any;
    public managerment : any;
    public index;
    public statusAddCheckbox : boolean = false;
    public editAccess = {
        "role_id":1,
        "permission_ids": []
    }
    user_no;
    constructor(
        private api: Restangular,
        private router: Router,
        public activeRoute: ActivatedRoute,
        private toast: ToastrService,
        private accountService : AccountService
    ) { }

    ngOnInit() {
        this.env = environment;

        this.activeRoute.params.forEach((params: Params) => {
            this.getAccountById(params['id']);
            this.user_no = params['id'];
        });

        this.required_upload_file_url = false;

        this.banner = {
            is_youtube: false
        };

        this.form = new FormGroup({
            name: new FormControl(this.banner.name, []),
            description: new FormControl(this.banner.description, []),
            target_url: new FormControl(this.banner.target_url, []),
            target_type: new FormControl(this.banner.target_url, []),
            button_text: new FormControl(this.banner.button_text, []),
            period_from: new FormControl(this.banner.period_from, [Validators.required]),
            period_to: new FormControl(this.banner.period_from, [Validators.required]),
        });

    }


    save() {
        if (!this.resource.isChanged) {
            this.onSave();
        } else {
            this.resource.onSave((response) => {
                const name = response.name.split('.');
                const originalName = name[0] + '_ORIGINAL.' + name[1];
                this.banner.url = response.url + '/' + originalName;
                this.banner.resource_type = response.resource_type;
                this.onSave();
            });
        }
    }

    onSave() {
        if (this.bannerId) {
            this.api
                .one('banners', this.bannerId)
                .customPUT(this.banner)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Update banner successfully');
                        this.router.navigate(['/admin/banners']);
                    }
                });
        } else {
            this.api
                .all('banners')
                .customPOST(this.banner)
                .subscribe(res => {
                    if (res.result) {
                        this.toast.success('Add banner successfully');
                        this.router.navigate(['/admin/banners']);
                    }
                });
        }
    }

    getAccountById(id)
    {
        this.accountService.getAccountById(id).subscribe(res => {
            console.log(res);
            this.data = res;
            this.getPermission();
        })
    }

    getPermission()
    {
        this.accountService.getAccount('/api/admin/role-admin-fime').subscribe(res => {
            console.log(res,'123');
            this.managerment = res['data'];
            this.getIndex();
            console.log(this.managerment,this.index,this.managerment[this.index]);
            this.data.permissions.forEach(item => {
                this.managerment[this.index].permissions.forEach(it => {
                    if(it.id === item.id) { it['check'] = true; }
                })
            });
        })
    }

    getIndex()
    {
        this.managerment.forEach((item,index) => {
            if(item.id === this.data.roles[0].id)
            {
                this.index = index;
            }
        })
    }

    checkAllInput(event)
    {
        this.editAccess.permission_ids = [];
        console.log(event.target.checked,event.target.parentNode.parentNode)
        const id = event.target.parentNode.parentNode.getAttribute('id');
        const role_id = event.target.value;
        const listCheckbox = document.querySelectorAll('td p label' + " " +"input[type='checkbox']");
        listCheckbox.forEach(item => {
            let newItem = item as HTMLInputElement
            newItem.checked = false;
            newItem.disabled = true;
        });
        const checkbox = document.querySelectorAll('#' + id + " " +"input[type='checkbox']");
        console.log(checkbox,'#' + id + " input[type='checkbox']");
        checkbox.forEach(item => {
            let newItem = item as HTMLInputElement
            newItem.checked = true;
            newItem.disabled = false;
            this.editAccess.role_id = role_id;
            this.editAccess.permission_ids.push(newItem.value);
        });
        console.log(this.editAccess,'đây');
        
    }

    getCheckBox(event)
    {
        for(let i = 0;i < this.editAccess.permission_ids.length ;i++)
        {
            if(event.target.value == this.editAccess.permission_ids[i])
            {
                this.statusAddCheckbox = false;
                this.editAccess.permission_ids.splice(i,1);
                return false;
            }
        }
        this.editAccess.permission_ids.push(event.target.value);
        console.log(this.editAccess,'đây 2');
    }

    updateAccess()
    {
        this.accountService.updateAccess(this.user_no,this.editAccess).subscribe(res => {
            console.log(res);
        },err => {
            console.log(err);
        });
    }
}
