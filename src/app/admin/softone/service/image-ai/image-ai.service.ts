import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class ImageAIService {
  imageAIUrl = '/api/admin/image-ai';  // URL to web api
  private url: string;
  public env: any = environment;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar + this.imageAIUrl;
  }

  /** GET heroes from the server */

  getcountData() {
    const url = this.url + '-count';
    return this.http.get(url);
  }

  search(data) {
    let params = new HttpParams();
    console.log(data);

    params = params.append('page', data.page);
    if (data.download) params = params.append('paginate', '999999999999999');
    //console.log(params)
    return this.http.get(this.env.host_fistar + '/api/admin/image-ai', { params: params });
  }
  getKeyword(data?) {
    console.log(data)
    //console.log(this.url)

    // let paramState
    // let fistar
    // let campaign
    // if (data) {
      
    //   if (data.allValue && data.allValue == "fistar") {

    //     paramState = '?search=' + data.search + '&' + (data.allValue + '=1') +
    //       (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //       (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   } else if (data.allValue && data.allValue == "campaign") {

    //     paramState = '?search=' + data.search + '&' + (data.allValue + '=2') +
    //       (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //       (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');

    //   } else {
    //     paramState = data.search === "undefined" || data.search === undefined ? '' : '?search=' + data.search +
    //       (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //       (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   }

    // }
    // //console.log(paramState)
    // if (paramState === "undefined" || paramState === undefined) {
    //   paramState = ""
    // }
    // const url = this.env.host_fistar + '/api/admin/image-ai-keyword' + `${paramState}`;
    // return this.http.get(url);


    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      params =  params.append(key, data[key])
    });

    return this.http.get(this.env.host_fistar + '/api/admin/image-ai-keyword', { params: params });

  }

  getImageAIList(data?) {
    // console.log(data, 'line85')
    // //console.log(this.url)

    // let paramState
    // if (data) {
    //   //console.log(data.startDate === undefined, '1');
    //   //console.log(data.startDate === 'undefined', '2');
    //   //console.log(data.startDate === '', '3');


    //   // if (data.allValue && data.allValue == "fistar") {

    //   //   paramState = '?search=' + data.search + '&' + (data.allValue + '=1') +
    //   //     (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //   //     (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   // } else if (data.allValue && data.allValue == "campaign") {

    //   //   paramState = '?search=' + data.search + '&' + (data.allValue + '=2') +
    //   //     (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //   //     (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');

    //   // } else {
    //   //   paramState = data.search === "undefined" || data.search === undefined ? '' : '?search=' + data.search +
    //   //     (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //   //     (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   // }

    //   // if (data.allValue) {
    //   //   paramState = '?search=' + data.search + '&' + (data.allValue == "fistar" ? data.allValue : data.allValue) + '=1' +
    //   //     (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //   //     (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   // } else {
    //   //   paramState = data.search === "undefined" || data.search === undefined ? '' : '?search=' + data.search +
    //   //     (data.startDate && data.startDate !== "undefined" && data.startDate !== undefined ? '&start_day=' + data.startDate : '') +
    //   //     (data.endDate && data.endDate != "undefined" && data.startDate !== undefined ? '&end_day=' + data.endDate : '');
    //   // }

    // }
    // //console.log(paramState)
    // // if (paramState === "undefined" || paramState === undefined) {
    // //   paramState = ""
    // // }
    // //const url = this.url + `${paramState}`;
    // // const url = this.url;
    // //console.log(url)
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      params =  params.append(key, data[key])
    });

    return this.http.get(this.env.host_fistar + '/api/admin/image-ai', { params: params });

  }





}


