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
export class PartnerService {
  partnerUrl = '/api/admin/partners';  // URL to web api
  private url: string;
  public env: any = environment;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar+this.partnerUrl;
  }

  /** GET heroes from the server */
  getPartners(page, state:any=false){
    if (page === undefined) page = 0;
    page++;
    let paramState = '';
    console.log(state)
    if(state){
      paramState = 'pc_state[]='+state+'&';
    }
    const url = this.url + `?${paramState}page=${page}`;
    // return this.http.get(url);
    return this.http.get(url);
  }
  getBrand() {
    return this.http.get(this.env.host_fistar + '/api/v1/get-brand');
  }

  getPartner(id){
    return this.http.get(this.url+'/'+id);
  }
  addPartner(data){
      return this.http.post(this.env.host_fistar+'/api/admin/partners/',data,{headers:headers});
  }
  getRecommend(pId){
    return this.http.get(this.env.host_fistar+'/api/admin/recommended/partners/'+pId+'?paginate=500');
  }
  getCampaign(cp_id){
    return this.http.get(this.env.host_fistar+'/api/admin/partners/statitics/campaign/history/'+cp_id);
  }
  getPartnerUpdate(id){
    return this.http.get(this.env.host_fistar+'/api/admin/campaigns/history/partner/'+id+'?paginate=500');
    
  }
  updatePartner(id,data){
    return this.http.post(this.url+'/'+id,data,{headers:headers});
  }
  
  getTotalCampaign(id){
    return this.http.get(this.env.host_fistar+'/api/admin/partners/statitics/campaign/'+id)
  }

  searchCampaign(id,cp_status){
    return this.http.get(this.env.host_fistar+'/api/admin/campaigns/history/partner/'+id+'?cp_status='+cp_status+"&paginate=500");
  //   return this.http.get(this.env.host_fistar+'/api/admin/partners/statitics/campaign/'+id+'?cp_status='+cp_status)
  }

  deleteCampaign(ids:any){
    let idlist = new FormData();
    ids.forEach(i=>{
      idlist.append('cp_ids[]', i);
    })
    return this.http.post(this.env.host_fistar+'/api/admin/delete-many/campaign',{idlist});
  //   return this.http.get(this.env.host_fistar+'/api/admin/partners/statitics/campaign/'+id+'?cp_status='+cp_status)
  }
  search(data){
    let params = new HttpParams(); 
    console.log(data);
    //if(!data.download){
      params = params.append('pc_tob', data.pc_tob); 
      data.cp_status.forEach(id => {
        params = params.append('cp_status[]', id);
      });
      params = params.append('filter', data.filter);
      params = params.append('page', data.page);
      // params = params.append('pc_state', data.pc_state);
      params = params.append('filter_value', data.filter_value);
      if(!data.filter) params = params.append('keyword', data.filter_value);
    //}
    //else{
      if(data.download) params = params.append('paginate', '999999999999999');
    //}
    
    params = params.append('pc_state[]', '2');
    console.log(params)
    return this.http.get(this.env.host_fistar+'/api/admin/partners',{ params: params });
  }

  getTob(){
    return this.http.get(this.env.host_fistar+'/api/v1/code?type=partner_type');
  }

  disable(ids){
    let data = {
      pid: ids,
      active: 0
    };
    return this.http.put(this.url+'/update/update-many',data,httpOptions);
  }

  enable(ids){
    let data = {
      pid: ids,
      active: 1
    };
    return this.http.put(this.url+'/update/update-many',data,httpOptions);
  }

  delete(ids){
    let data = {
      pids: ids
    };
    return this.http.post(this.env.host_fistar+'/api/admin/delete-many/partner', data, httpOptions);
  }

  sendMessage(data){
    return this.http.post(this.env.host_fistar+'/api/admin/notices',data,httpOptions);
  }
  getKeywords(){
    // console.log(this.env.host_fistar+'/v1/code?type=keyword');
    return this.http.get(this.env.host_fistar+'/api/v1/code?type=keyword');
  }
  changeStatus(arrIdOneRecommend){
    let ids = arrIdOneRecommend;
    return this.http.put(this.env.host_fistar+'/api/admin/recommended/fistar/all/',{ids: ids},httpOptions);
  }

  deleteRecommend(arrId){
    return this.http.post(this.env.host_fistar+'/api/admin/delete-many/recommended',{ids: arrId},httpOptions);
  }

  getFistarRecommend(id){
    return this.http.get(this.env.host_fistar+'/api/admin/image-ai-keyword/fistar_recommend?pid='+id)
  }
}


