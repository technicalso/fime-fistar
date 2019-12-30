import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestFistarService } from '../../service/request/fistar/fistar.service';
import { FistarService } from '../../service/fistar/fistar.service';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../service/common.service';
declare var $: any;

@Component({
    selector: 'app-admin-sns',
    templateUrl: './sns.component.html',
    styleUrls: [
        './sns.component.scss'
    ]
})
export class AdminFistarSNS implements OnInit {
    public env: any;
    public fistar: any = [];
    public formFime: any;
    public formFacebook: any;
    public formYoutube: any;
    public formIstagram: any;
    public keywords: any = [];
    public id: string;
    public totalMoney: number = 0;
    public channels: any = [];
    public channelFime: any = {};
    public channelFacebook: any = {};
    public channelYoutube: any = {};
    public channelIstagram: any = {};
    public fiSimilar: any = [];
    public yearCurren: number;
    public Math;
    public active: boolean = false;
    modalRef: BsModalRef;
    constructor(
        private api: Restangular,
        private router: Router,
        private toast: ToastrService,
        private requestFistar: RequestFistarService,
        private activeRoute: ActivatedRoute,
        private fistarService: FistarService,
        private modalService: BsModalService,
        private commonService: CommonService,
    ) {
        this.Math = Math;
    }

    ngOnInit() {
        var d = new Date();
        this.yearCurren = d.getFullYear();
        this.id = this.activeRoute.snapshot.paramMap.get('id');
        this.getFistar();
        this.fistarSimilar();
        this.formFime = new FormGroup({
            costFime: new FormControl('', [Validators.required]),
        });

        this.formFacebook = new FormGroup({
            costFacebook: new FormControl('', [Validators.required]),
            urlFacebook: new FormControl('', [Validators.required]),
        });

        this.formYoutube = new FormGroup({
            costYoutube: new FormControl('', [Validators.required]),
            urlYoutube: new FormControl('', []),
        });

        this.formIstagram = new FormGroup({
            costIstagram: new FormControl('', [Validators.required]),
            urlIstagram: new FormControl('', []),

        });

        // console.log(this.formFacebook, this.formIstagram, this.formYoutube)
    }

    checkSNSData(sns){
        let formData: any;
        let sns_id:any;
        switch(sns){
            case 'Facebook': sns_id=2; formData = this.formFacebook; break;
            case 'Youtube': sns_id=3; formData = this.formYoutube; break;
            case 'Istagram': sns_id=4; formData = this.formIstagram; break;
        }
        // console.log(formData, sns)
        if(formData.dirty){
            if(sns == 'Facebook') {
                if(formData.value['url'+sns] == null || formData.value['url'+sns] == '') return sns+' is required'
            }
            if(formData.value && formData.value['url'+sns] != null && formData.value['url'+sns] != ''){
                
                if(!this.commonService.validUrl(formData.value['url'+sns], sns_id)) return sns.replace('Istagram', 'Instagram')+' URL is invalid'
                if((formData.value['cost'+sns] != null && !/[0-9]/.test(formData.value['cost'+sns])) || parseInt(formData.value['cost'+sns]) <= 0) return sns.replace('Istagram', 'Instagram')+' cost is invalid'
            }
        }
        // console.log(formData.dirty, /[0-9]/.test(formData.value['cost'+sns]))
        
        return false;
    }

    getFistar() {
        this.fistarService.getFistar(this.id).subscribe((res: any) => {
            this.fistar = res;
            for (let i = 0; i < this.fistar.channels.length; i++) {
                this.totalMoney = this.totalMoney + Number(this.fistar.channels[i].cost)
            }
            console.log(this.fistar);
            
            let availabelChannel = [1,2,3,4];
            let currentChannel = [];
            
            for(let item of this.fistar.channels){
                if(item.cost==null){
                    item.cost = 0;
                }
                currentChannel.push(item.sns_id)
            }

            let addingChannel = availabelChannel.filter(id=>{
                return currentChannel.indexOf(id) < 0
            })

            console.log(addingChannel, 'ADD')
            addingChannel.forEach(id=>{
                this.fistar.channels.push({
                    cost: 0,
                    created_at: "",
                    sns_id: id,
                    sns_url: '',
                    uid: this.id,
                    updated_at: "",
                    usn_comment: 0,
                    usn_follower: 0,
                    usn_like: 0,
                    usn_post: 0,
                    usn_share: 0,
                    usn_view: 0,
                })
            })
            this.fistar.channels.sort(function (obj1, obj2) {
                return obj1.sns_id - obj2.sns_id;
            });


            console.log(this.fistar.channels, 'fistarchannel')
        });
            

    }

    checkNegative(channels:any){
        let dem=0;
        for(let item of channels){
            if(item.cost<0)
                dem=1;
        }
        if(dem==1)
            return false;
        else
            return true
    } 
    updateChannels() {
        console.log(this.fistar.channels);
        if(this.checkNegative(this.fistar.channels) == true){
            let data: any = { type: "sns_channel", channels: this.fistar.channels, uid: this.id };
            this.fistarService.updateFistar(data).subscribe((res: any) => {
                console.log(res);
                this.toast.success('Update SNS Channel success');
                this.router.navigate(['/admin/fistar']);
            });
        }
       
    }

    getAge(dob) {
        // return moment.utc(dob).month(0).from(moment.utc().month(0))
        return moment.utc().diff(moment.utc(dob), 'years')
        //  return moment(dob).month(0).from(moment().month(0))
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'gray modal-lg' })
        );
        $(".modal").addClass('disable');

    }

    fistarSimilar() {
        this.fistarService.fistarSimilar(this.id).subscribe((res: any) => {
            this.fiSimilar = res;
            this.fiSimilar.map((item, index) => {
                var total = 0;
                var totalCost = 0;
                item.channels.map((itemChannel) => {
                    total += itemChannel.usn_follower;
                    totalCost += Number(itemChannel.cost);
                })
                this.fiSimilar[index].totalFollower = total;
                this.fiSimilar[index].totalCost = totalCost;
            })
            console.log('total', this.fiSimilar);
        });
    }

    goToDetail(item: any) {
        this.router.navigate(['/admin/fistar/basic-infomation', item.uid]);
    }

    private validateChannels() {
        let isValid = true;
        for (let channel of this.fistar.channels) {
            if (!this.isNumberOnly(channel.cost)) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    private isNumberOnly(value) {
        let reg = /^-?\d*\.?\d*$/;
        return reg.test(value);
    }

    getCostChannel(list, sns) {
        let x = list.filter((item) => {
            return item.sns_id == sns
        })
        let y = x.map((i) => {
            return i
        })

        if (y[0]) {
            return `<div class="sns_cost"><img src="/assets//softone//sns//${sns}.png"><span>${this.commonService.parseLargeNum(parseInt(y[0].cost))}</span></div>`
        }
        return '-'
    }

    sumCost(list) {
        //console.log(list, 'sumCost')
        let sum = 0;
        list.map((item) => {
            sum += parseFloat(item.cost)
        })
        //console.log(sum);
        return sum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    hiddenSubmit() {
        return this.active;
    }
}
