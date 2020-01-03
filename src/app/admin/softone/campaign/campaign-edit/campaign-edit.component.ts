import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { SoftoneResourceComponent } from './../../resource/resource.component';
import { AdminCampaignSearchFistarComponent } from './../campaign-add/search-fistar/search-fistar.component'
import * as moment from 'moment';
import { HttpClientAdminService } from '../../../shared/service/httpclient.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../service/common.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CampaignService } from '../../service/campaign/campaign.service';
import { AdminMultipleImagesSoftOneComponent } from './../../../softone/multiple-images/multiple-images-softone.component.component';
import { AdminMultipleImagesComponent } from '../../../multiple-images/multiple-images.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-admin-campaign-edit',
  templateUrl: './campaign-edit.component.html',
  styleUrls: ['./campaign-edit.component.scss']
})
export class AdminCampaignEditComponent implements OnInit {
  @ViewChild('resource') public resource: SoftoneResourceComponent;
  @ViewChild('images') public images: AdminMultipleImagesComponent;
  //TUAN DEV
  idCampaign;
  env: any;
  public campaignErrors: any;
  form: FormGroup;
  modalRef: any;
  dataBlind = {
    category: [],
    keyWord: [],
    keyWordChoose: [],
    arrUrlAttack: [],
    arrImageAttack: [''],
    arrVideoAttack: [''],
    arrLinkAttack: [''],
    filetextLink: [''],
    multiImgArr: []
  };
  image;
  isInputCustomerText = false;
  cpOutputText = 1;
  colors;
  campaign: any;
  image_description: File;
  image_main_image: File;
  image_main_image_type: any;
  isShowCampaignImg = false;
  fistars: any = [];
  brands: any = [];
  fistarsChannel: any = [];
  uids: any = [];
  sns: any = [1, 2, 3, 4];
  channelBox: any = [];
  active = false;
  cpDate: any = {};
  dataImage: any = [];

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    private campaginService: HttpClientAdminService,
    private campaignServiceGet: CampaignService,
    private formbuilder: FormBuilder,
    private toa: ToastrService,
    public commonService: CommonService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.env = environment;
    this.activeRoute.params.forEach((params: Params) => {
      if (params['id']) {
        this.idCampaign = params['id'];
        this.getInfo(params['id']);
      }
    });
    this.getColor();
    this.initCategory();
    this.initForm();
    this.getBrand();
    this.getDataImage();
  }

  getDataImage() {
    this.campaignServiceGet.getDataImage(this.idCampaign).subscribe((res: any) => {
      this.dataImage = res;
      console.log(this.dataImage, 'data');
    })
  }
  getBrand() {
    this.campaignServiceGet.getBrand().subscribe(res => {
      //console.log(res)
      this.brands = res;

    })

  }

  getInfo(id) {
    this.campaginService.getData(`api/admin/campaigns/${id}`).subscribe(
      res => {
        //console.log(res);
        this.campaign = res;
        this.image = this.commonService.getImageLink(res['cp_image'], 'campaigns', 'original');
        this.form.patchValue(res);
        this.setValueFielNull();
        this.setValueOutputText(res['cp_output_text']);
        this.form.controls.cp_attachment_type.setValue(1);
        // this.form.controls.cp_text_color.setValue(res['cp_text_color']);
        this.form.controls.cp_attachment_url.setValue(this.dataBlind.arrUrlAttack);
        this.checkedstate = res['cp_state'];
        this.initKeyword(res['keywords']);
        this.isShowCampaignImg = true;
        this.currentMatchingData(res)
        //console.log(this.form, this.form.value.cp_period_start, '------109')
        this.cpDate.cp_period_start = moment.utc(this.form.value.cp_period_start).subtract({ hours: 7 }).toDate();
        this.cpDate.cp_period_end = moment.utc(this.form.value.cp_period_end).subtract({ hours: 7 }).toDate();
      },
      err => {

      }
    );
  }

  getColor() {
    this.campaginService.getData(`api/admin/fimecodes?type=color`).subscribe(res => {
      //console.log('colors', res);
      this.colors = res;
    })
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


  initKeyword(arr) {
    for (let index = 0; index < arr.length; index++) {
      this.dataBlind.keyWordChoose.push(arr[index]['cd_id']);
    }
    this.form.controls.keywords.setValue(this.dataBlind.keyWordChoose);
    this.campaginService.getData(`api/admin/codes?cdg_id=11`).subscribe(
      res => {
        this.dataBlind.keyWord = this.keywordChecked(arr, res['data']);
      });
  }

  keywordChecked(array, data) {
    // tslint:disable-next-line:prefer-const
    let arr = [];
    for (let index = 0; index < data.length; index++) {
      // tslint:disable-next-line:prefer-const
      let object = data[index];
      for (let second = 0; second < array.length; second++) {
        if (array[second]['cd_id'] === data[index]['cd_id']) {
          object['checked'] = true;
        }
      }
      arr.push(object);
    }
    return arr;
  }

  initCategory() {
    this.campaginService.getData(`api/admin/codes?cdg_id=10`).subscribe(
      res => {
        this.dataBlind.category = res['data'];
      });
  }

  initForm() {
    this.form = this.formbuilder.group(
      {
        cp_name: ['', Validators.required],
        cp_short_description: [],
        cp_description: ['', Validators.required],
        cp_hashtag: [],
        cp_brand: ['', Validators.required],
        cp_state: [],
        cp_category: ['', Validators.required],
        cp_model: [],
        cp_product_url: [],
        cp_product_price: [''],
        cp_type: ['', Validators.required],
        cp_campaign_price: ['', Validators.required],
        // cp_sale_price: ['', Validators.required],
        cp_period_end: ['', Validators.required],
        cp_period_start: ['', Validators.required],
        cp_delivery_start_date: ['', Validators.required],
        cp_delivery_end_date: ['', Validators.required],
        cp_maxcount: ['', Validators.required],
        cp_output_text: [],
        cp_text_color: [],
        // cp_image: ['', Validators.required],
        cp_image: [''],
        cp_image_title: ['', Validators.required],
        keywords: ['', Validators.required],
        cp_total_influencer: [''],
        cp_total_free: [''],
        cp_attachment_type: [''],
        cp_attachment_url: [''],
        cp_status: [],
        radio_cp_output_text: 1,
      }
    );
  }




  pushKeyWord(id, event) {

    if (event.target.checked) {
      this.dataBlind.keyWordChoose.push(id);
      //(this.dataBlind.keyWordChoose);
    } else {
      this.dataBlind.keyWordChoose.splice(this.dataBlind.keyWordChoose.indexOf(id), 1);
      //(this.dataBlind.keyWordChoose);
    }
    this.form.controls.keywords.setValue(this.dataBlind.keyWordChoose);
  }


  setType(value) {
    this.form.controls.cp_type.setValue(value);
  }

  checkedstate;
  setState(value) {
    //(value);
    this.form.controls.cp_state.setValue(value);
    this.checkedstate = value;
    //(this.form.value);

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
    //('evt', evt);
    this.form.get('cp_attachment_type').setValue(evt.type);
  }

  getImageMain(evt) {
    //(evt, 'getImageMain')
    this.image_main_image = evt.file
    this.image_main_image_type = evt.type
  }

  getImageDescription(evt) {
    //(evt, 'getImageDescription')
    this.image_description = evt.file
  }

  getListImage(evt) {
    this.dataBlind.multiImgArr = [];
    Array.from(evt).forEach((item) => {
      this.dataBlind.multiImgArr.push(item);
    })
    //('multiImgArr', this.dataBlind.multiImgArr);
    this.form.get('cp_attachment_url').setValue(this.dataBlind.multiImgArr);
  }

  async save() {
    // console.log(this.form.invalid);
    // console.log(this.form.controls.cp_name.invalid,'name');
    // console.log(this.form.controls.cp_description.invalid,'cp_description');
    // console.log(this.form.controls.cp_brand.invalid,'cp_brand');
    // console.log(this.form.controls.cp_category.invalid,'cp_category');
    // console.log(this.form.controls.cp_type.invalid,'cp_type');
    // console.log(this.form.controls.cp_period_end.invalid,'cp_period_end');
    // console.log(this.form.controls.cp_period_start.invalid,'cp_period_start');
    // console.log(this.form.controls.cp_delivery_start_date.invalid,'cp_delivery_start_date');
    // console.log(this.form.controls.cp_delivery_end_date.invalid,'cp_delivery_end_date');
    // console.log(this.form.controls.cp_image.invalid,'cp_image');
    // console.log(this.form.controls.cp_image_title.invalid,'cp_image_title');
    // console.log(this.form.controls.keywords.invalid,'keywords');
    // // console.log(this.form.controls.cp_name.invalid,'name');
    //     if(this.form.controls.cp_name.invalid || this.form.controls.cp_description.invalid || this.form.controls.cp_brand.invalid || this.form.controls.cp_category.invalid || this.form.controls.cp_type.invalid
    //       || this.form.controls.cp_period_end.invalid || this.form.controls.cp_period_start.invalid || this.form.controls.cp_delivery_start_date.invalid ||this.form.controls.cp_delivery_end_date.invalid 
    //          ||this.form.controls.cp_image_title.invalid ||this.form.controls.keywords.invalid )
    //    console.log('true');
    //    else
    //    console.log('false');
    //     return;
    // console.log(this.form.controls.cp_delivery_start_date);return;"0000-00-00 00:00:00"

    //   for(let item of this.images.imagesBase64){
    //     arr.push([item.base64,item.url.replace(this.env.rootHost + '/storage/uploads/', '')]);
    //   }
    //  console.log(arr);
    //   let formsData = new FormData();

    //   for (var i = 0; i < arr.length; i++) {
    //     formsData.append('image['+i+'][0]', arr[i][0]);
    //     formsData.append('image['+i+'][1]', arr[i][1]);
    //     // console.log(arr[i]);

    //   }
    //     this.campaginService.postData(`api/admin/edit-campaign/${this.idCampaign}`, formsData).subscribe(
    //       data => {
    //         this.getInfo(this.idCampaign);
    //         this.toa.success('Success');
    //         console.log(data);
    // //this.router.navigate(['/admin/campaign']);
    //       },
    //       err => {
    //         this.campaignErrors = err.error.errors;
    //         // this.toa.error(err.error.message);
    //         this.toa.error('Upload file must be smaller than 8M');
    //       }
    //     );

    // console.log(formsData.get('image[]'));return;
    // await this.getImage();
    //(this.form.value.cp_total_influencer);
    console.log(this.images);
    this.active = true;
    let arr: any = [];
    if (this.form.controls.cp_name.invalid || this.form.controls.cp_description.invalid || this.form.controls.cp_brand.invalid || this.form.controls.cp_category.invalid || this.form.controls.cp_type.invalid
      || this.form.controls.cp_period_end.invalid || this.form.controls.cp_period_start.invalid || this.form.controls.cp_delivery_start_date.invalid || this.form.controls.cp_delivery_end_date.invalid
      || this.form.controls.cp_image_title.invalid || this.form.controls.keywords.invalid)
      return 0;

    console.log(this.fistarsChannel, 'save----xxx');
    
    if (this.activeEdit() == true) {

      //(this.cpDate)
      if (this.cpDate.cp_period_start instanceof Object) {
        // tslint:disable-next-line:max-line-length
        this.form.controls.cp_period_start.setValue(moment(this.cpDate.cp_period_start).format('YYYY-MM-DD HH:mm:ss'));
      }
      if (this.cpDate.cp_period_end instanceof Object) {
        // tslint:disable-next-line:max-line-length
        this.form.controls.cp_period_end.setValue(moment(this.cpDate.cp_period_end).format('YYYY-MM-DD HH:mm:ss'));
      }
      if (this.form.value.cp_delivery_start_date instanceof Object) {
        this.form.controls.cp_delivery_start_date.setValue(moment(this.form.value.cp_delivery_start_date).format('YYYY-MM-DD HH:mm:ss'));
      }
      if (this.form.value.cp_delivery_end_date instanceof Object) {
        this.form.controls.cp_delivery_end_date.setValue(moment(this.form.value.cp_delivery_end_date).format('YYYY-MM-DD HH:mm:ss'));
      }

      //(this.form.value);

      let formsData = new FormData();

      for (let item of this.images.imagesBase64) {
        arr.push([item.base64, item.url.replace(this.env.rootHostFistar + '/storage/attachments/large/', '')]);
      }
      //  console.log(arr,'array');return;
      if(this.images.imagesBase64.length==0)
        formsData.append('image', '');
      else
        for (var i = 0; i < arr.length; i++) {
          formsData.append('image[' + i + '][0]', arr[i][0]);
          formsData.append('image[' + i + '][1]', arr[i][1]);
          // console.log(arr[i]);
        }
      console.log(formsData.get('image'));
      Object.keys(this.form.value).forEach(key => {
        if (this.form.value[key] instanceof Array) {
          //(1);
          for (let index = 0; index < this.form.value[key].length; index++) {
            formsData.append(key + '[]', this.form.value[key][index]);
          }
        } else {
          formsData.append(key, this.form.value[key]);
        }
      });

      if (this.image_description) formsData.append('cp_image', this.image_description);
      if (this.image_main_image) formsData.append('cp_main_image', this.image_main_image);
      if (this.image_main_image_type) formsData.append('cp_main_image_type', this.image_main_image_type);
      //formsData.append('imagebase64', this.images.imagesBase64[0].base64);
      // formsData.append('images', 'fdsf');
      formsData.forEach((value, key) => {
        //(key + " " + value)
      });



      this.cpDate.cp_period_start = moment.utc(this.form.value.cp_period_start).toDate();
      this.cpDate.cp_period_end = moment.utc(this.form.value.cp_period_end).toDate();
      let error = false;
      // if (this.uids.length > 0) {
      //   let fimeCount = 0;
      //   this.uids.forEach(i => {
      //     if (i.indexOf('-1') >= 0) fimeCount++;
      //   })
      //   if (fimeCount == 0) {
      //     this.toa.error('Matching require minimum 1 fime channel');
      //     error = true;
      //   } else {
      //     this.uids.forEach(i => {
      //       formsData.append('uids[]', i)
      //     })
      //   }
      // }
      if (this.uids.length > 0) {
        let fimeCount = 0;
        this.uids.forEach(i => {
          if (i.indexOf('-1') >= 0) fimeCount++;
        })
        //if (fimeCount == 0) {
        //  this.toa.error('Matching require minimum 1 fime channel');
        //  error = true;
        //} else {
          this.uids.forEach(i => {
            formsData.append('uids[]', i)
          })
        //}
      }
      if (!error) {
        this.campaginService.postData(`api/admin/edit-campaign/${this.idCampaign}`, formsData).subscribe(
          data => {
            this.getInfo(this.idCampaign);
            this.router.navigate(['/admin/campaign']);
            this.toa.success('Success');
            //this.router.navigate(['/admin/campaign']);
          },
          err => {
            this.campaignErrors = err.error.errors;
            // this.toa.error(err.error.message);
            this.toa.error('Upload file must be smaller than 8M');
          }
        );
      }
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
  convertImageDescription(images) {
    let result = [];

    if (images && images.length > 0) {

      for (let i = images.length - 1; i >= 0; i--) {
        let imageLink = this.commonService.getImageLink(images[i]['cp_attachment_url'], 'attachments', 'original');
        result.push(imageLink)
        if (result.length >= 4) break;
      }
    }
    //('result', result);

    return result;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;


  }






  //MATCHING FISTAR
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'md80',
    });
  }

  matchFistar(fistar) {
    this.modalRef.hide()
    fistar.forEach(item => {
      console.log(item, 'matchFistar');
      this.fistars.push(item)
      let data = this.makeItemUids(item);
      ////(data, 'data')
      if (data) {
        this.fistarsChannel.push(data)
        this.setComboBoxChannel()
      }
    })
      (this.fistarsChannel, this.uids, "this.fistarsChannel")
  }


  checkExistFistarChannel(uid, sns) {
    let id = uid + '-' + sns.toString();
    if (this.uids.indexOf(id) < 0) return false;
    return true;
  }
  makeItemUids(item) {
    for (const i of item.channel) {
      let checkExist = this.uids.filter(j => {
        return j == item.uid + '-' + i.sns_id
      })
      if (checkExist.length == 0) {
        this.uids.push(item.uid + '-' + i.sns_id)
        let data: any = {
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
    //   //console.log(data, 'data2')
    //   //console.log(this.checkExistFistarChannel(item.uid, i), "this.checkExistFistarChannel(item.uid, i)")
    //   let channel = item.channel.filter(cn=>{
    //     return cn.sns_id == i;
    //   })
    //   //console.log(channel)
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

  getComboBoxChannel(item) {
    let total = item.channel.map(i => {
      return i.sns_id
    })
    let selectedUid = this.uids.filter(i => {
      return i.indexOf(item.uid) >= 0
    })

    let selected = selectedUid.map(i => {
      let x = i.split('-')
      return parseInt(x[1])
    })

    let availabel = total.filter(i => {
      return selected.indexOf(i) < 0
    })
    availabel.sort(function (a, b) { return a - b })
    return availabel;
  }

  getComboBoxChannel2(item) {
    let total = item.channels.map(i => {
      return i.sns_id
    })
    let selectedUid = this.uids.filter(i => {
      return i.indexOf(item.uid) >= 0
    })

    let selected = selectedUid.map(i => {
      let x = i.split('-')
      return parseInt(x[1])
    })

    let availabel = total.filter(i => {
      return selected.indexOf(i) < 0
    })
    availabel.sort(function (a, b) { return a - b })
    return availabel;
  }

  setComboBoxChannel() {
    this.fistarsChannel.forEach(item => {
      this.channelBox[item.item.uid] = this.getComboBoxChannel(item.item)
    })

  }

  getFistarFromList(uid) {
    console.log(this.fistars, 'getFistarFromList')
    let x = this.fistars.filter(item => {
      return item.uid == uid
    })
    console.log(x, 'getFistarFromList--2')
    if (x.length > 0) {
      return x[0]
    } return false;
  }

  changeSNS(event, fistar) {
    //console.log(event, fistar, "changeSNS-475")
    this.uids = this.uids.filter(item => {
      return item != fistar.item.uid + '-' + fistar.sns
      //fistar.item.uid+'-'+event.target.value
    })
    this.fistarsChannel = this.fistarsChannel.filter(item => {
      return item != fistar
    })
    fistar.sns = parseInt(event.target.value)
    fistar.sns_name = this.getChannelName(parseInt(event.target.value))
    let x = this.getFistarFromList(fistar.item.uid)
    console.log(fistar, x, 'changeSNS-496')
    let y
    if (x && x.channel) {
      y = x.channel.filter(i => {
        return i.sns_id == parseInt(event.target.value)
      })
    }
    if (x && x.channels) {
      y = x.channels.filter(i => {
        return i.sns_id == parseInt(event.target.value)
      })
    }

    let z = [];
    if (y) {
      z = y.map(i => {
        return i
      })
    }

    fistar.sns_cost = (z[0]) ? z[0].cost : 0

    this.fistarsChannel.push(fistar)
    this.uids.push(fistar.item.uid + '-' + event.target.value)
    this.setComboBoxChannel()
    //console.log(this.uids, this.fistarsChannel, 'changeSNS-486')
  }

  getChannelName(i) {
    switch (i) {
      case 1: return "Fime";
      case 2: return "Facebook";
      case 3: return "Youtube";
      case 4: return "Instagram";
    }
  }

  removeFistar(item) {
    let id = item.item.uid + '-' + item.sns
    this.uids = this.uids.filter(x => {
      return x != id
    })
    this.fistarsChannel = this.fistarsChannel.filter(x => {
      return x != item
    })
  }

  countTotalFee() {
    let x = 0;
    if (this.fistarsChannel.length > 0) {
      this.fistarsChannel.forEach(i => {
        x += parseInt(i.sns_cost)
      })
    }
    return x;
  }

  currentMatchingData(res) {
    if (res.matchings.length > 0) {
      res.matchings.forEach(item => {
        if (item.matching_channel.length > 0) {
          item.matching_channel.forEach(m => {
            if (m.m_ch_selected == 1) {
              let y = item.influencer.channels.filter(i => {
                return i.sns_id == parseInt(m.sns_id)
              })
              let z = [];
              if (y) {
                z = y.map(i => {
                  return i
                })
              }

              let influencer = {
                avatar: item.influencer.picture,
                channel: item.influencer.channels,
                name: item.influencer.fullname,
                uid: item.influencer.uid
              }

              let data = {
                item: influencer,
                sns: m.sns_id,
                sns_name: this.getChannelName(m.sns_id),
                sns_cost: (z[0]) ? z[0].cost : 0
              }
              this.uids.push(item.influencer.uid + '-' + m.sns_id)
              console.log(item);
              this.fistars.push(item.influencer)
              this.channelBox[item.influencer.uid] = this.getComboBoxChannel2(item.influencer)
              this.fistarsChannel.push(data)

            }
          })
        }
      })
    }
    console.log('currentMatchingData', this.fistarsChannel, this.uids, this.channelBox)


  }
  activeEdit() {
    if (
      this.form.value.cp_name == ''
      || this.form.value.cp_description == '<html><head><title></title></head><body></body></html>'
      || this.form.value.cp_brand == ''
      || this.form.value.cp_total_free == ''
      || this.form.value.cp_total_influencer == ''
    )
      return false;
    else
      return true;

  }
}
