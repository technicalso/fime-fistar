import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { Observable,throwError } from 'rxjs';
import { catchError,retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');

@Injectable()
export class FistarService {
  bannerUrl = '/api/admin/fistars';  // URL to web api
  private url: string;
  public env: any = environment;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar+this.bannerUrl;
  }

  getScrap(uid){
    return this.http.get(this.url+"/campaigns/scrap/"+uid);
  }

  deleteScrap (ids,uid){
    return this.http.post(this.url+"/campaigns/scrap/"+uid,{cp_id:ids});
  }
  /** GET heroes from the server */
  getFistars (page?, state=0){
    if (page === undefined) page = 0;
    page++;
    let paramState
    if(state !== 0){
      paramState = 'state='+state+'&';
    }
    const url = this.url + `?${paramState}page=${page}`;
    return this.http.get(url);
  }

  getFistar (id){
    return this.http.get(this.url+'/'+id);
  }

  

  fistarSimilar (id){
    return this.http.get(this.env.host_fistar+'/api/admin/fistars/similar/'+id);
  }

  updateFistar(data){
    return this.http.post(this.url+'/' + data.uid,data,{headers:headers});
  }

  updateInfoFistar(data, uid){
    return this.http.post(this.url+'/' + uid,data,{headers:headers});
  }

  addFistar(data){
    return this.http.post(this.env.host_fistar+'/api/admin/fistars',data,{headers:headers});
  }
  sendMessageToFistar(data){
    return this.http.post(this.env.host_fistar+'/api/admin/notices',data,httpOptions);
  }

  search(data){
    let params = new HttpParams(); 
    console.log(data.cp_status);
    // params = params.append('pc_tob', data.pc_tob); 
    params = params.append('gender', data.gender); 
    params = params.append('age_range', data.age_range);
    params = params.append('follower_range', data.follower_range);
    params = params.append('channel', data.channel);
    params = params.append('location', data.location);
    params = params.append('paginate', '500');

    if (data.fistarUserField) {
      params = params.append(data.fistarUserField, data.fistarUserValue);
    }

    data.cp_status.forEach((item)=>{
      params = params.append('cp_status[]', item);
    })

    params = params.append('state[]', '2');
    params = params.append('page', data.page);
    // params = params.append('paginate', '2');
    // params = params.append('catalog', data.catalog);
    console.log(params)
    return this.http.get(this.env.host_fistar+'/api/admin/fistars',{ params: params });
  }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  disable(ids){
    let data = {
      uid: ids,
      active: 0
    };
    return this.http.put(this.env.host_fistar+'/api/admin/fistars/update/update-many',data,httpOptions);
  }

  enable(ids){
    let data = {
      uid: ids,
      active: 1
    };
    return this.http.put(this.env.host_fistar+'/api/admin/fistars/update/update-many',data,httpOptions);
  }

  delete(ids){
    let data = {
      uids: ids
    };
    return this.http.post(this.env.host_fistar+'/api/admin/fistars/delete-many/partner', data, httpOptions);
  }

  getListImage(uId){
    return this.http.get(this.env.host_fistar+'/api/admin/recommendeds/fistar/detail/'+uId);
  }
  getListRecommend(uId){
    return this.http.get(this.env.host_fistar+'/api/admin/recommended/fistars/'+uId);
  }
  changeStatus(id){
    return this.http.put(this.env.host_fistar+'/api/admin/recommended/status/'+id,'');
  }

  getImageRecentAnalysis(uid){
    return this.http.get(this.env.host_fistar+'/api/admin/image-ai-keyword/get-list-recent?uid='+uid);
  }

  getRecommendCampaigns(uid){
    return this.http.get(this.env.host_fistar+'/api/admin/image-ai-keyword/campaign_recommend?uid='+uid);
  }
}


