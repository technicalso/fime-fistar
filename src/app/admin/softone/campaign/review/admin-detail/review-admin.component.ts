import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientAdminService } from '../../../../shared/service/httpclient.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormControlName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {CommonService} from '../../../../../admin/softone/service/common.service';
import { CampaignService } from '../../../service/campaign/campaign.service';
declare var $: any;


@Component({
    selector: 'admin-campaign-review-component',
    templateUrl: './review-admin.component.html',
    styleUrls: [
        './review-admin.component.scss'
    ]
})
export class AdminCampaignReviewDmncComponent implements OnInit {
    public campaignData:any={};
    public cp_id: any;
    public rv_id: any;
    public review_status: number;
    public reviewData:any={
        sns_id: '',
        m_ch_category: '',
        m_ch_title: '',
        m_ch_content: '',
        m_ch_url: '',
    };
    public action:any;
    public formControl:any;
    public categories: any;
    public channels: any;
    public showError: boolean=false;
    constructor(
        private router: Router,
        public activeRoute: ActivatedRoute,
        private formbuilder: FormBuilder,
        private toa: ToastrService,
        private commonService: CommonService,
        private campaignService: CampaignService

    ) {

        this.formControl = new FormGroup({
            cp_id: new FormControl(this.activeRoute.snapshot.paramMap.get('id')),
            sns_id: new FormControl(this.reviewData.sns_id ,Validators['required']),
            m_ch_category: new FormControl(this.reviewData.m_ch_category ,Validators['required']),
            m_ch_title: new FormControl(this.reviewData.m_ch_title ,Validators['required']),
            m_ch_content: new FormControl(this.reviewData.m_ch_content ,Validators['required']),
            m_ch_url: new FormControl(this.reviewData.m_ch_url ),
            m_ch_active_url: new FormControl(0),
        })
        
    }



    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            // each time the search data is change you'll get this running
            //Do what ever you need to refresh your search page
            console.log('New route params', params);
            this.action = params.action;
            this.cp_id = params.id;
            this.rv_id = params.rv;
            this.getCampaign();
            console.log(this.rv_id, this.rv_id>0, params.rv)         
            if(this.rv_id>0){
                this.getAdminReview()
                       
            }
            this.getCategory()
            this.getChannel()
            this.getReviewStatus()
          });
    }
     getReviewStatus(){
        this.campaignService.getReviewStatus(this.rv_id).subscribe((res:number)=>{
            this.review_status = res;
            console.log(this.review_status);
        })
     }
    getCampaign(){
        this.campaignService.getCampaign(this.cp_id).subscribe((res:any)=>{
            this.campaignData = res
            console.log(this.campaignData);
        })
    }

    getAdminReview(){

        this.campaignService.getAdminReview(this.rv_id).subscribe((res:any)=>{
            this.reviewData = res
            console.log(this.reviewData,'tets');
            this.formControl = new FormGroup({
                cp_id: new FormControl(this.cp_id),
                sns_id: new FormControl(this.reviewData.sns_id ,Validators['required']),
                m_ch_category: new FormControl(this.reviewData.m_ch_category ,Validators['required']),
                m_ch_title: new FormControl(this.reviewData.m_ch_title ,Validators['required']),
                m_ch_content: new FormControl(this.reviewData.m_ch_content ,Validators['required']),
                m_ch_url: new FormControl(this.reviewData.m_ch_url ),
                m_ch_active_url: new FormControl(0),
            })
            
            console.log(this.formControl, 'TH1')
        })
    }

    getCategory(){
        this.commonService.getCategory().subscribe((res:any)=>{
            this.categories = res.code;
        })
    }

    getChannel(){
        this.commonService.getChannel({sns_state: 1}).subscribe((res:any)=>{
            this.channels = res.data;
        })
    }


    goBack() {
        let url="admin/campaign/campaign-review/"+this.cp_id;
        this.router.navigate([url])
    }

    gotoEdit(){
        this.router.navigate(["/admin/campaign/campaign-review-admin/update/"+this.cp_id+"/"+this.rv_id])
    }
    
    save(){
        console.log(this.formControl.controls.m_ch_url.value,'fsdfdsf')
        this.showError = true
        console.log(this.formControl.value, "SAVE-75")
        console.log(!this.formControl.invalid);
        if(!this.formControl.invalid ){
            console.log('SUBMIT');
            if(this.action=='update' && (this.commonService.validUrl(this.formControl.controls.m_ch_url.value, this.formControl.controls.sns_id.value)||(this.formControl.controls.m_ch_url.value==null&&this.review_status!=105))){
                console.log(this.formControl.value);
                this.campaignService.UpdateAdminReview(this.formControl.value, this.rv_id).subscribe((res:any)=>{

                    this.toa.success('Update review successfully')
                    window.history.back();
                    // this.router.navigate(["admin/campaign/campaign-review/"+this.cp_id])
                })
            }else{
                console.log(this.formControl.value);
                let x = this.campaignData.admin_reviews.filter(item=>{
                    return item.sns_id == this.formControl.value.sns_id
                })
                
                if(x.length>0){
                    if(this.review_status!=105){
                        this.toa.error("A review for this channel already exists")
                    }
                }else{
                    
                    this.campaignService.createAdminReview(this.formControl.value).subscribe((res:any)=>{
                        this.toa.success('Create review successfully')
                        this.router.navigate(["admin/campaign/campaign-review/"+this.cp_id])
                    })
                }
            }
        }
    }

    addReview() {
        this.reviewData.m_ch_content='';
        this.reviewData.m_ch_url='';
        this.formControl.reset();
        this.router.navigate([`admin/campaign/campaign-review-admin/add/${this.cp_id}/0`]);
    }

    statusToModify(id){
        this.campaignService.statusToModify(id).subscribe((res:any)=>{
           this.getReviewStatus();
        });
    }

    statusToCheck(id){
        this.campaignService.statusToCheck(id).subscribe((res:any)=>{
           this.getReviewStatus();
        });
    }
    
    approveReview(id,rv_status){
        this.campaignService.approveReview(id,rv_status).subscribe((res:any)=>{
            this.getReviewStatus();
        })
    }

    goToLinkUrl(){ console.log(this.reviewData);
        if (this.reviewData.m_ch_url != '' && this.reviewData.m_ch_url) {
            window.open(this.reviewData.m_ch_url, '_blank');
        }
    }
}
