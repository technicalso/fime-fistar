import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';

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
export class CampaignService {
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
    this.url = this.env.host_fistar;
  }

  getDataImage(id){
    return this.http.get(this.env.host_fistar + '/api/admin/campaigns-att/'+id);
  }
  /** GET heroes from the server */
  getCampaign(id) {
    return this.http.get(this.env.host_fistar + '/api/admin/campaigns/'+id);
  }

  getAdminReview(id) {
    return this.http.get(this.env.host_fistar + '/api/admin/campaign-admin-review/'+id);
  }
  getBrand() {
    return this.http.get(this.env.host_fistar + '/api/v1/get-brand');
  }

  createAdminReview(data){
    return this.http.post(this.env.host_fistar+'/api/admin/campaign-admin-review', data)
  }

  UpdateAdminReview(data, id){
    return this.http.put(this.env.host_fistar+'/api/admin/campaign-admin-review/'+id, data)
  }
   getReviewStatus(id){
    return this.http.get(this.env.host_fistar+'/api/admin/campaign-admin-review/rv-status/'+id);
   }
   statusToModify(id){
    return this.http.get(this.env.host_fistar+'/api/admin/campaign-admin-review/modify-status/'+id)
   }

   statusToCheck(id){
    return this.http.get(this.env.host_fistar+'/api/admin/campaign-admin-review/check-status/'+id)
   }
  
   approveReview(id,rv_status){
    return this.http.get(this.env.host_fistar+'/api/admin/campaign-admin-review/admin-approve-review/'+id+'/'+rv_status);
  }
}


