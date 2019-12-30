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
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class BannerService {
  bannerUrl = '/api/admin/banners';  // URL to web api
  private url: string;
  public env: any = environment;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar+this.bannerUrl;
  }

  /** GET heroes from the server */
  getBanners (data?){
    let params = new HttpParams();
    console.log(data)
    if(data){
      if(data.page && data.page>1)
        params = params.append('page', data.page)
      if(data.per_page)
        params = params.append('paginate', data.per_page)
    }
    return this.http.get(this.url, {params});
  }

  addBanner ($data: any){
    return this.http.post(this.url,$data,{headers:headers});
  }

  getBanner ($id){
    return this.http.get(this.url+'/'+$id+'');
  }

  updateBanner ($data:any,$id){
    return this.http.post(this.url+'/'+$id, $data, {headers:headers});
  }

  deleteBanner ($id){
    return this.http.delete(this.url+'/'+$id,httpOptions);
  }
  
  changeStatus (id){
    return this.http.put(this.env.host_fistar+'/api/admin/banners/update/status/'+id,httpOptions);
  }
 
}


