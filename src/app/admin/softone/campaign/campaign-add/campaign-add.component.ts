import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { SoftoneResourceComponent } from './../../resource/resource.component';
import * as moment from 'moment';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { CampaignService } from '../../service/campaign/campaign.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {AdminMultipleImagesComponent} from '../../../multiple-images/multiple-images.component';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-admin-campaign-add',
  templateUrl: './campaign-add.component.html',
  styleUrls: ['./campaign-add.component.scss']
})
export class CampaignAddComponent implements OnInit {
  @ViewChild('resource') public resource: SoftoneResourceComponent;
  @ViewChild('images') public imagesAdd: AdminMultipleImagesComponent;
  idCampaign;
  form: any;

  dataBlind = {
    category: [],
    keyWord: [],
    keyWordChoose: [],
    arrUrlAttack: [],
    arrImageAttack: [''],
    arrVideoAttack: [''],
    arrLinkAttack: [''],
    filetextLink: [''],
    multiImg: [],
  };
  modalRef:any;
  image;
  isInputCustomerText = false;
  cpOutputText = 1;
  colors;
  campaign = {};
  image_description: File;
  image_main_image: File;
  images: File;
  env: any;
  image_main_image_type: any;
  partners;
  imagesArr = [];
  checkedstate = 0;
  error: any = {};
  fistars:any=[];
  brands:any=[];
  fistarsChannel:any=[];
  uids:any = [];
  sns:any=[1,2,3,4];
  channelBox:any = [];
  cpDate:any = {};
  dataImage: any = [];
  public isSubmitted = false;
  public isErrPeriod = false;
  public isErrDeliveryDate = false;
  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    private campaginService: HttpClientAdminService,
    private campaignServiceGet: CampaignService,
    private formbuilder: FormBuilder,
    private toa: ToastrService,
    private commonService: CommonService,
    private modalService: BsModalService,

  ) { }

  ngOnInit() {
    this.env = environment;
    this.getColor();
    this.initCategory();
    this.initForm();
    this.initKeyword();
    this.getPartner();
    this.getBrand();
  }
  getColor() {
    this.campaginService.getData(`api/admin/fimecodes?type=color`).subscribe(res => {
      this.colors = res;
    })
  }



  getBrand() {
    this.campaignServiceGet.getBrand().subscribe(res => {
      console.log(res)
      this.brands = res;
      
    })
    
  }

  validUrl() {
    let x = this.commonService.validUrl(this.form.controls.cp_product_url, '')
    if (!x) this.error.url = true;
    this.error.url = false
  }

  setValueOutputText(cp_output_text) {
    if (cp_output_text != '' && !cp_output_text) {
      this.form.controls.radio_cp_output_text.setValue(1);
    }
    else {
      this.form.controls.radio_cp_output_text.setValue(2);
    }
    this.checkCpOutputText();
  }

  setValueFielNull() {
    if (this.form.controls.cp_short_description.value == null) {
      this.form.controls.cp_short_description.setValue('');
    }
    if (this.form.controls.cp_model.value == null) {
      this.form.controls.cp_model.setValue('');
    }
  }


  initKeyword() {
    this.campaginService.getData(`api/admin/codes?cdg_id=11`).subscribe(
      res => {
        this.dataBlind.keyWord = res['data'];
      }, err => {
        console.log('dataBlind eror', err);

      });
  }

  initCategory() {
    this.campaginService.getData(`api/admin/codes?cdg_id=10`).subscribe(
      res => {
        this.dataBlind.category = res['data'];
      });
  }

  initForm() {
    this.form = new FormGroup(
      {
        cp_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        cp_short_description: new FormControl(''),
        cp_description: new FormControl('', [Validators.required]),
        cp_hashtag: new FormControl(''),
        // cp_brand: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        cp_brand: new FormControl('', Validators.required),
        cp_state: new FormControl(),
        cp_category: new FormControl('', Validators.required),
        cp_model: new FormControl('', Validators.maxLength(255)),
        cp_product_url: new FormControl(''),
        cp_product_price: new FormControl(''),
        cp_type: new FormControl(0, Validators.required),
        cp_campaign_price: new FormControl(''),
        // cp_sale_price: ['', Validators.required],
        cp_period_end: new FormControl('', Validators.required),
        cp_period_start: new FormControl('', Validators.required),
        cp_delivery_start_date: new FormControl('', [Validators.required]),
        cp_delivery_end_date: new FormControl('', [Validators.required]),
        cp_output_text: new FormControl(''),
        cp_text_color: new FormControl(''),
        // cp_image: new FormControl(''),
        // cp_image: new FormControl('', [Validators.required]),
        cp_image_title: new FormControl(''),
        keywords: new FormControl('', [Validators.required]),
        cp_total_influencer: new FormControl('', Validators.required),
        cp_total_free: new FormControl('', Validators.required),
        cp_attachment_type: new FormControl(''),
        cp_attachment_url: new FormControl('' ),
        cp_status: new FormControl(''),
        radio_cp_output_text: new FormControl(1),
        p_id: new FormControl('', [Validators.required]),
        cp_main_image: new FormControl('', [Validators.required]),
      }
    );
  }




  pushKeyWord(id, event) {
    if (event.target.checked) {
      this.dataBlind.keyWordChoose.push(id);
    } else {
      this.dataBlind.keyWordChoose.splice(this.dataBlind.keyWordChoose.indexOf(id), 1);
    }
    this.form.controls.keywords.setValue(this.dataBlind.keyWordChoose);
  }


  setType(value) {

    this.form.controls.cp_type.setValue(value);
  }

  setState(value) {
    this.form.controls.cp_state.setValue(value);
    this.checkedstate = value;

  }

  setcpImage(event) {
    if (event.target.files[0]) {
      this.form.controls.cp_image.setValue(event.target.files[0]);
    }
  }

  setcpImageTitle(event) {
    if (event.target.files[0]) {
      this.form.controls.cp_image_title.setValue(event.target.files[0]);
    }
  }

  chooseAttack(value) {
    this.form.controls.cp_attachment_type.setValue(value);
    this.form.controls.cp_attachment_url.setValue([]);
    this.dataBlind.arrImageAttack = [''];
    this.dataBlind.arrVideoAttack = [''];
    this.dataBlind.arrUrlAttack = [];
  }

  setTypeAttack(event) {
    if (event.target) {
      this.dataBlind.arrUrlAttack.push(event.target.files[0]);
      this.form.controls.cp_attachment_url.setValue(this.dataBlind.arrUrlAttack);
    }
  }

  pushArr(field) {
    this.dataBlind[field].push('');

  }

  getImage(evt) {
    let arr = [];
    arr.push(evt.file);
    this.form.get('cp_attachment_url').setValue(arr);
  }

  getImageMain(evt) {
    this.image_main_image = evt.file

    this.image_main_image_type = evt.type
    this.form.get('cp_main_image').setValue(this.image_main_image);
  }
  getImages(evt) {
    this.dataBlind.multiImg = [];
    Array.from(evt).forEach((item) => {
      this.dataBlind.multiImg.push(item);
    })
    this.form.get('cp_attachment_url').setValue(this.dataBlind.multiImg);
  }

  getImageDescription(evt) {
    this.image_description = evt.file
    this.form.get('cp_image').setValue(this.image_description);
  }


  async save() {
    //  console.log(this.imagesAdd);return;
    let arr: any = [];
    console.log(this.image_description,'dddd');
    this.isErrPeriod = false;
    this.isErrDeliveryDate = false;
    this.isSubmitted = true;
    console.log('test');
    // if (this.form.invalid || this.isErrPeriod || this.isErrDeliveryDate || this.imagesAdd.imagesBase64 ===  undefined || this.imagesAdd.imagesBase64.length == 0) {
    //   return 0;
    // }
    if (this.form.invalid || this.isErrPeriod || this.isErrDeliveryDate ) {
      return 0;
    }
    console.log('test');
    if (this.cpDate.cp_period_start instanceof Object) {
      this.form.controls.cp_period_start.setValue(moment(this.cpDate.cp_period_start).format('YYYY-MM-DD HH:mm:ss'));
    }
    if (this.cpDate.cp_period_end instanceof Object) {
      this.form.controls.cp_period_end.setValue(moment(this.cpDate.cp_period_end).format('YYYY-MM-DD HH:mm:ss'));
    }
    if (this.form.value.cp_delivery_start_date instanceof Object) {
      this.form.controls.cp_delivery_start_date.setValue(moment(this.form.value.cp_delivery_start_date).format('YYYY-MM-DD HH:mm:ss'));
    }
    if (this.form.value.cp_delivery_end_date instanceof Object) {
      this.form.controls.cp_delivery_end_date.setValue(moment(this.form.value.cp_delivery_end_date).format('YYYY-MM-DD HH:mm:ss'));
    }

    let formsData = new FormData();

    for(let item of this.imagesAdd.imagesBase64){
      arr.push([item.base64,item.url.replace(this.env.rootHost + '/storage/attachments/large/', '')]);
    }
//  console.log(arr,'array');return;
    for (var i = 0; i < arr.length; i++) {
      formsData.append('image['+i+'][0]', arr[i][0]);
      formsData.append('image['+i+'][1]', arr[i][1]);
      // console.log(arr[i]);

    }

    Object.keys(this.form.value).forEach(key => {
      if (this.form.value[key] instanceof Array) {
        for (let index = 0; index < this.form.value[key].length; index++) {
          formsData.append(key + '[]', this.form.value[key][index]);
        }
      } else {
        formsData.append(key, this.form.value[key]);
      }
    });

    if (this.image_description) formsData.append('cp_image', this.image_description);
    if (this.image_main_image) formsData.append('cp_main_image', this.image_main_image);

    formsData.append('cp_image_title', formsData.get('cp_name')); // cp_name
    //cp_attachment_type
    formsData.append('cp_attachment_type', '1'); // cp_name
    formsData.append('cp_main_image_type', this.image_main_image_type);
    let error = false;
    // if(this.uids.length>0){
    //   let fimeCount = 0;
    //   this.uids.forEach(i=>{
    //     if(i.indexOf('-1')>=0) fimeCount++;
    //   })
    //   if(fimeCount == 0) 
    //   {
    //     this.toa.error('Matching require minimum 1 fime channel');
    //     error = true;
    //   }else{
    //     this.uids.forEach(i=>{
    //       formsData.append('uids[]', i)
    //     })
    //   }
    // }

    if(this.uids.length>0){
      let fimeCount = 0;
      this.uids.forEach(i=>{
        if(i.indexOf('-1')>=0) fimeCount++;
      })
      //if(fimeCount == 0)
      //{
        //this.toa.error('Matching require minimum 1 fime channel');
        //error = true;
      //}else{
        this.uids.forEach(i=>{
          formsData.append('uids[]', i)
        })
      //}
    }
    this.cpDate.cp_period_start = moment.utc(this.form.value.cp_period_start).toDate();
    this.cpDate.cp_period_end = moment.utc(this.form.value.cp_period_end).toDate();
    console.log(this.cpDate.cp_period_start,'test dada');
    console.log(error);
    if(!error){
      this.campaginService.postData(`api/admin/create-campaign`, formsData).subscribe(
        data => {
          this.toa.success('Created campaign successfully');
          this.router.navigate(['/admin/campaign']);
        },
        err => {
          // var result = Object.keys(err.error.errors).map(function (key) {
          //   return [Number(key), err.error.errors[key]];
          // });
          // result.forEach(element => {
          //   this.toa.error(element[1][0]);
          // });
          this.toa.error('Upload file must be smaller than 8M');
        }
      );
    }
    
  }

  navigate(value) {
    this.router.navigate([`/admin/${value}/${this.idCampaign}`]);
  }

  checkCpOutputText() {
    this.isInputCustomerText = this.form.controls.radio_cp_output_text.value == 2 ? true : false;
    if (this.form.controls.radio_cp_output_text.value == 1) {
      this.form.controls.cp_output_text.setValue('');
    }
  }

  handleChangeDate(event: moment.Moment, column) {
    var target = moment(event).format('YYYY-MM-DD');
    var now = moment().format('YYYY-MM-DD');
    switch (column) {
      case 'cp_period_end':
        var message = "The period end date cannot less than now";
        break;
      case 'cp_period_start':
        var message = "The period start date cannot less than now";
        break;
      case 'cp_delivery_start_date':
        var message = "The delivery start date cannot less than now";
        break;
      case 'cp_delivery_end_date':
        var message = "The delivery end date cannot less than now";
        break;
      default:
        var message = "The date cannot less than now";
        break;
    }
    if (target < now) {
      this.toa.warning(message);
      return;
    }
  }

  getPartner() {
    this.campaginService.getData(`/api/admin/partners/create-campaign/list?paginate=10000000`).subscribe(res => {
      this.partners = res['data']
    }, err => {
      this.toa.error(err.error.message);
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, {
        class: 'md80',
      });
  }

  matchFistar(fistar){
    this.modalRef.hide()
    fistar.forEach(item=>{
      this.fistars.push(item)
      let data = this.makeItemUids(item);
        //console.log(data, 'data')
        if(data){
          this.fistarsChannel.push(data)
          this.setComboBoxChannel()
        }
    })
    console.log(this.fistarsChannel, this.uids, "this.fistarsChannel")
  }


  checkExistFistarChannel(uid, sns){
    let id = uid+'-'+sns.toString();
    if(this.uids.indexOf(id)<0) return false;
    return true;
  }
  makeItemUids(item){
    for(const i of item.channel){
      let checkExist = this.uids.filter(j=>{
        return j == item.uid+'-'+i.sns_id
      })
      if(checkExist.length==0){
        this.uids.push(item.uid+'-'+i.sns_id)
        let data:any = {
          item: {
            avatar: item.avatar,
            channel: item.channel,
            name: item.name,
            uid: item.uid
          },  
          sns: i.sns_id, 
          sns_name: this.getChannelName(i.sns_id),
          sns_cost: i.cost, 
        }
        return data
      }
      
    }
    // for(const i of this.sns){
    //   let data:any = {item, sns: i}
    //   console.log(data, 'data2')
    //   console.log(this.checkExistFistarChannel(item.uid, i), "this.checkExistFistarChannel(item.uid, i)")
    //   let channel = item.channel.filter(cn=>{
    //     return cn.sns_id == i;
    //   })
    //   console.log(channel)
    //   if(channel.length>0){
    //     let x=channel.map(z=>{
    //       return z.cost
    //     })
    //     data.sns_cost = x[0];
    //   }
    //   if(!this.checkExistFistarChannel(item.uid, i) && channel.length > 0)
    //   return data;
    // }
    return false;
  }

  getComboBoxChannel(item){
    let total = item.channel.map(i=>{
      return i.sns_id
    })
    let selectedUid = this.uids.filter(i=>{
      return i.indexOf(item.uid) >= 0
    })

    let selected = selectedUid.map(i=>{
      let x = i.split('-')
      return parseInt(x[1])
    })

    let availabel = total.filter(i=>{
      return selected.indexOf(i) < 0
    })
    availabel.sort(function(a, b){return a-b})
    return availabel;
  }

  setComboBoxChannel(){
    this.fistarsChannel.forEach(item=>{
        this.channelBox[item.item.uid] = this.getComboBoxChannel(item.item)
    })
    
  }

  getFistarFromList(uid){
    let x = this.fistars.filter(item=>{
      return item.uid == uid
    })
    if(x.length>0){
      return x[0]
    }return false;
  }

  changeSNS(event, fistar){
    console.log(event, fistar, "changeSNS-475")
    this.uids = this.uids.filter(item=>{
      return item != fistar.item.uid+'-'+fistar.sns
      //fistar.item.uid+'-'+event.target.value
    })
    this.fistarsChannel = this.fistarsChannel.filter(item=>{
      return item!= fistar
    })
    fistar.sns = parseInt(event.target.value)
    fistar.sns_name = this.getChannelName(parseInt(event.target.value))
    let x = this.getFistarFromList(fistar.item.uid)
    console.log(x, 'changeSNS-496')
    let y = x.channel.filter(i=>{
      return i.sns_id == parseInt(event.target.value)
    })
    let z = [];
    if(y){
      z = y.map(i=>{
        return i
      })
    }
    
    fistar.sns_cost = (z[0])?z[0].cost: 0

    this.fistarsChannel.push(fistar)
    this.uids.push(fistar.item.uid+'-'+event.target.value)
    this.setComboBoxChannel()
    console.log(this.uids, this.fistarsChannel, 'changeSNS-486')
  }
  
  getChannelName(i){
    switch(i){
      case 1: return "Fime";
      case 2: return "Facebook";
      case 3: return "Youtube";
      case 4: return "Instagram";
    }
  }
  
  removeFistar(item){
    let id = item.item.uid+'-'+item.sns
    this.uids = this.uids.filter(x=>{
      return x != id
    })
    this.fistarsChannel = this.fistarsChannel.filter(x=>{
      return x!=item
    })
  }

  countTotalFee(){
    let x = 0;
    if(this.fistarsChannel.length>0){
      this.fistarsChannel.forEach(i=>{
        x+=  parseInt(i.sns_cost)
      })
    }
    return x;
  }

}
