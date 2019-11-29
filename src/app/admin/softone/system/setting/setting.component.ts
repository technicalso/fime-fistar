import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { CommonService } from '../../../../admin/softone/service/common.service';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SettingServiceSoftone } from '../../service/system/setting.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'admin-system-setting',
    templateUrl: './setting.component.html',
    styleUrls: [
        './setting.component.scss'
    ]
})
export class AdminSystemSettingComponent implements OnInit {
    modalRef: BsModalRef;
    public data: any = {};
    public methodTime: any;
    public timeHours: any;
    public timeHoursMatching: any;
    public form: any;
    public formData = new FormData();
    public error: any;
    public time: any
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private settingService: SettingServiceSoftone,
        private commonService: CommonService,
        private modalService: BsModalService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        
        this.getSetting();
        console.log(this.data)

        this.form = new FormGroup({
            job_image_ai_schedule: new FormControl(this.data.job_image_ai_schedule, [Validators.required]),
            job_image_ai_schedule_time: new FormControl(this.data.job_image_ai_schedule_time, [Validators.required]),
            job_image_ai_rate_pass: new FormControl(this.data.job_image_ai_rate_pass, [Validators.required, Validators.max(100), Validators.min(0)]),
            job_image_ai_recent_photo: new FormControl(this.data.job_image_ai_recent_photo, [Validators.required]),
            job_fistar_on_thread: new FormControl(this.data.job_fistar_on_thread, [Validators.required]),
            job_thread: new FormControl(this.data.job_thread, [Validators.required]),
            job_matching_schedule: new FormControl(this.data.job_matching_schedule, [Validators.required]),
            job_matching_schedule_time: new FormControl(this.data.job_matching_schedule_time, [Validators.required]),
            // job_image_ai_rate_pass: new FormControl(this.data.job_image_ai_rate_pass, [Validators.required, Validators.maxLength(100)]),

        });
        console.log(this.data)
        
        
    }

    getSetting() {
        this.settingService.getSetting(1).subscribe((res: any) => {
            console.log(res, "BANNER DETAIL")
            this.data = res;
            this.getList();
        });
    }
    changeTime(time) {
        console.log(time, "as")
        if(time.value == "daily") {
            var arr = [], i, j;
            for (i = 0; i < 24; i++) {
                for (j = 0; j < 4; j++) {
                    arr.push({ value: (i > 10 ? i : "0" + i) + ":" + (j === 0 ? "00" : 15 * j), viewValue: i + ":" + (j === 0 ? "00" : 15 * j) });
                }
            }
            this.timeHours = arr;
        }else if(time.value == "weekly") {
            var arr = [], i, j;
            for (i = 2; i <= 7; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHours = arr;
        }else if(time.value == "monthly") {
            var arr = [], i, j;
            for (i = 1; i <= 30; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHours = arr;
        }
    }

    changeTimeMatching (time) {

        console.log(time, "as")
        if(time.value == "daily") {
            var arr = [], i, j;
            for (i = 0; i < 24; i++) {
                for (j = 0; j < 4; j++) {
                    arr.push({ value: (i > 10 ? i : "0" + i) + ":" + (j === 0 ? "00" : 15 * j), viewValue: i + ":" + (j === 0 ? "00" : 15 * j) });
                }
            }
            this.timeHoursMatching = arr;
        }else if(time.value == "weekly") {
            var arr = [], i, j;
            for (i = 2; i <= 7; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHoursMatching = arr;
        }else if(time.value == "monthly") {
            var arr = [], i, j;
            for (i = 1; i <= 30; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHoursMatching = arr;
        }

    }


    getList() {

        this.methodTime = [
            { value: 'daily', viewValue: 'Daily' },
            { value: 'weekly', viewValue: 'Weekly' },
            { value: 'monthly', viewValue: 'Monthly' }
        ];
        console.log(this.data.job_image_ai_schedule)
        console.log(this.data)
        

        if(this.data.job_image_ai_schedule == "daily") {
            console.log("daily")
            var arr = [], i, j;
            for (i = 0; i < 24; i++) {
                for (j = 0; j < 4; j++) {
                    arr.push({ value: (i > 10 ? i : "0" + i) + ":" + (j === 0 ? "00" : 15 * j), viewValue: i + ":" + (j === 0 ? "00" : 15 * j) });
                }
            }
            this.timeHours = arr;
        }else if(this.data.job_image_ai_schedule == "weekly") {
            console.log("weekly")
            console.log(this.data)
            if(this.data.job_image_ai_schedule_time) {
                this.data.job_image_ai_schedule_time = +this.data.job_image_ai_schedule_time
            }
            console.log(this.data)
            var arr = [], i, j;
            for (i = 2; i <= 7; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHours = arr;
        }else if(this.data.job_image_ai_schedule == "monthly") {
            console.log("monthly")
            if(this.data.job_image_ai_schedule_time) {
                this.data.job_image_ai_schedule_time = +this.data.job_image_ai_schedule_time
            }
            var arr = [], i, j;
            for (i = 1; i <= 30; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHours = arr;
        }

        if(this.data.job_matching_schedule == "daily") {
            var arr = [], i, j;
            for (i = 0; i < 24; i++) {
                for (j = 0; j < 4; j++) {
                    arr.push({ value: (i > 10 ? i : "0" + i) + ":" + (j === 0 ? "00" : 15 * j), viewValue: i + ":" + (j === 0 ? "00" : 15 * j) });
                }
            }
            this.timeHoursMatching = arr;
        }else if(this.data.job_matching_schedule == "weekly") {
            if(this.data.job_matching_schedule_time) {
                this.data.job_matching_schedule_time = +this.data.job_matching_schedule_time
            }
            var arr = [], i, j;
            for (i = 2; i <= 7; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHoursMatching = arr;
        }else if(this.data.job_matching_schedule == "monthly") {
            if(this.data.job_matching_schedule_time) {
                this.data.job_matching_schedule_time = +this.data.job_matching_schedule_time
            }
            var arr = [], i, j;
            for (i = 1; i <= 30; i++) {
                
                arr.push({ value:i, viewValue: i });
                
            }
            this.timeHoursMatching = arr;
        }
        


    }
    update() {
        console.log(this.form.value)
        let settingData = Object.assign({}, this.form.value);
        console.log(this.form)
        if (this.form.valid) {

            for (const key in settingData) {
                if (Array.isArray(settingData[key])) {
                    for (let i = 0; i < settingData[key].length; i++) {
                        this.formData.append(`${key}[]`, (this.form.value[key][i] == undefined || this.form.value[key][i] == null) ? '' : this.form.value[key][i]);
                    }
                } else {
                    console.log("else")
                    this.formData.append(key, (settingData[key] == undefined || settingData[key] == null) ? '' : settingData[key])
                    console.log(this.formData)
                }
            }

            this.formData.append('_method', 'PUT');

            this.settingService.updateSetting(settingData, 1).subscribe((res: any) => {
                console.log(res);
                if (res) {
                    this.commonService.updateAnalysisSetting().subscribe((res2: any) => {});
                    this.toast.success('Update setting successfull');
                    // this.router.navigate(['/admin/banner-fistar']);
                }
            }, (err) => {
                this.error = err;
                console.log(this.error);
                this.toast.error(this.error.error.message);
            });

        }
    }


    runNow(){
        this.toast.warning('Job in progress');
        this.commonService.callAnalysisNow().subscribe((res:any)=>{
            this.toast.success('Job is completed');
        }
        // ,(err) => {
        //     this.error = err;
        //     console.log(this.error);
        //     this.toast.error('Job is failed');
        // }
        );
    }



}
