import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');

@Injectable()
export class CommonService {
  partnerUrl = '/api/admin/partners';  // URL to web api
  private url: string;
  public env: any = environment;
  public IMAGE_TYPE = {
    CAMPAIGNS: 'campaigns',
    FISTARS: 'fistars',
    PARTNERS: 'partners',
    ATTACHMENTS: 'attachments',
  }

  public IMAGE_SIZE = {
    ORIGINAL: 'original',
    THUMBNAIL: 'thumbnail',
    MEDIUM: 'medium',
    MEDIUM_LARGE: 'medium_large',
    LARGE: 'large',
  }

  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar + this.partnerUrl;
  }

  /** GET heroes from the server */
  getGender() {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type=gender');
  }

  getLocation() {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type=location');
  }
  getFollowers() {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type=Follower_range');
  }
  getCategory() {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type=Catalog');
  }

  getAge() {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type=Age_range');
  }

  getCode(type) {
    return this.http.get(this.env.host_fistar + '/api/v1/code?type='+type);
  }

  getChannel(data:any = {}) {
    //console.log(data);
    let params = new HttpParams();
    Object.keys(data).forEach(key=>{
      //console.log(key, data[key])
      params = params.append(key, data[key])
    })
    //console.log(params, 'params')
    return this.http.get(this.env.host_fistar + '/api/admin/sns', { params: params });
  }

  getImageLink(imageName, folder, size = 'NONE') {
    let imageDefault = `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`
    if (!imageName) {
      return imageDefault
    }
    if (imageName.includes('http')) {
      return imageName
    }
    let urlImage
    if(size != 'NONE'){
      urlImage = this.env.host_fistar + '/storage/' + folder + '/' + size + '/' + imageName
    }
    else{
      urlImage = this.env.host_fistar + '/storage/' + folder + '/'+ imageName
    }
      
    // return checkImageExists(urlImage, function(existsImage) {
    //   if(existsImage == true) {
    return urlImage
    //   }
    //   else {
    //     return `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`;
    //   }
    // });
    // var image = new Image();
    // var urlImage = process.env.REACT_APP_BASE + '/storage/' + folder + '/' + size + '/' + imageName
    // image.src = urlImage;
    // console.log(image, 'image');
    // if (image.width == 0) {
    //   return `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`;
    // } else {
    //   return urlImage;
    // }
  }

  getImageLinkBanner(imageName) {
    let imageDefault = `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`
    if (imageName=="0") {
      return imageDefault
    }
    if (imageName.includes('http')) {
      return imageName
    }
    let urlImage = this.env.host_fistar + '/uploads/' + imageName
    // return checkImageExists(urlImage, function(existsImage) {
    //   if(existsImage == true) {
        return urlImage
    //   }
    //   else {
    //     return `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`;
    //   }
    // });
    // var image = new Image();
    // var urlImage = process.env.REACT_APP_BASE + '/storage/' + folder + '/' + size + '/' + imageName
    // image.src = urlImage;
    // console.log(image, 'image');
    // if (image.width == 0) {
    //   return `https://x.kinja-static.com/assets/images/logos/placeholders/default.png`;
    // } else {
    //   return urlImage;
    // }
  }

  parseLargeNum(num){
    if(num < 1000) return num;
    if(num>= 1000 && num < 1000000) return Math.round(num/1000) + 'K';
    if(num >= 1000000) return Math.round(num/1000000)+ 'M';
  }

  parseLargeMoney(num){
    if(num < 1000) return num;
    if(num>= 1000 && num < 1000000) return Math.round(num/1000) + 'K';
    if(num >= 1000000) {
      let x = num/1000000;
      return x.toFixed(2)+ 'M';
    }
  }

  formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;  
      const negativeSign = amount < 0 ? "-" : "";  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - parseInt(i)).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };


  // getCampaignThumb(item){
  //   if(item && item.cp_main_image_type == 1)
  //     return this.getImageLink(item.cp_main_image, 'campaigns', 'thumbnail')
  //   else{
  //     if(item.cp_video_thumb.indexOf('public') < 0)
  //       return this.getImageLink(item.cp_video_thumb, 'campaigns', 'thumbnail')
  //     else{
  //       return item.cp_video_thumb.replace('/public', this.env.host_fistar)
  //     }
  //   }
  // }

  getCampaignThumb(item:any){
    if(item && item.cp_main_image_type == 1)
      return this.getImageLink(item.cp_main_image, 'campaigns', 'thumbnail')
    else{
      if(item && item.cp_main_image_type == 2)
        return "//img.youtube.com/vi/" + this.getId(item.cp_main_image) + "/0.jpg"
      else{
        return this.env.host_fistar + '/storage/campaigns/' + item.cp_video_thumb
      }
    }
  }

  getId(url) {
    if (typeof url !== "string") {
        return null;
    }
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "error";
    }
  }

  validUrl(url, type){
    switch(type){
      case 'facebook': return /facebook\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      case '2': return /facebook\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      case 'instagram': return /instagram\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      case '4': return /instagram\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      case 'youtube': return /youtube\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      case '3': return /youtube\.com\/+[\w\.\?\=\_\/\-\&]+$/.test(url);
      default: return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(url);
    }
    
  }

  searchFistarCampaign(params){
    return this.http.get(this.env.host_fistar+'/api/v1/fistar', {params})
  }

  callAnalysisNow (){
    let data = new FormData();
    data.append('command', 'Now')
    return this.http.post(this.env.analysis_module_url+'/flavosix/configs', data, {headers:headers});
  }
  updateAnalysisSetting (){
    let data = new FormData();
    data.append('command', '');
    return this.http.post(this.env.analysis_module_url+'/flavosix/configs', data, {headers:headers});
  }
}


