import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class RequestPartnerService {
  partnerUrl = '/api/admin/partners';  // URL to web api
  private url: string;
  public env: any = environment;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar+this.partnerUrl;
  }

  /** 
   * GET heroes from the server 
   * @param page: count from 0
   **/
  getRequestPartners (page, state=[1,3]){
    let params = new HttpParams();
    if (page !== undefined) {
      page ++;
    }else{
      page = 1;
    }
    params = params.append('page', page);
    
    state.forEach((s)=>{
      params = params.append('pc_state[]', s.toString());
    })
      
    console.log(params);
    const url = this.url;// + `?${paramState}page=${page}`;
    return this.http.get(url, { params: params });
  }

  searchRequestPartners (data){
    let params = new HttpParams();
    if(data.period_from != undefined){
      let from = parseInt(data.period_from._i.month)+1;
      let period_from = data.period_from._i.year+'-'+from+'-'+data.period_from._i.date;
      params = params.append('from_date', period_from);
    }
    if(data.period_to != undefined){
      let to = parseInt(data.period_to._i.month)+1;
      let period_to = data.period_to._i.year+'-'+to+'-'+data.period_to._i.date;
      params = params.append('to_date', period_to);
    }
    // Begin assigning parameters
    if(data.keyword != undefined)
      params = params.append('keyword', data.keyword);
      if(data.state != undefined){
        if(typeof data.state == 'object'){
          data.state.forEach(s=>{
            params = params.append('pc_state[]', data.state);
          })
        }else{
          params = params.append('pc_state[]', data.state);
        }
        
      }
    // let urlSearch=this.url+'?keyword='+data.user_no+'&state='+data.state+'&from_date='+period_from+'&to_date='+period_to;
    console.log(params);
    return this.http.get(this.url,{ params: params });

    // let params = [];
    // if(data.period_from != undefined){
    //     params.push('from_date='+data.period_from)
    // }
    // if(data.period_to != undefined){
    //     params.push('to_date='+data.period_to)
    // }
    //   // // Begin assigning parameters
    // if(data.keyword != undefined)
    //     params.push('keyword='+data.keyword)
    // if(data.state != undefined)
    //     params.push('state='+data.state)

    // console.log(params.join('&'));
    // return this.http.get(this.url + '?'+ params.join('&'));
  }

  updateRequest(data){
    return this.http.put(this.url+'/update/update-many',data,httpOptions);
  }

  getKeywords(){
    // console.log(this.env.host_fistar+'/v1/code?type=keyword');
    return this.http.get(this.env.host_fistar+'/api/v1/code?type=keyword');
  }

  getDetail(id){
    // console.log(this.env.host_fistar+'/v1/code?type=keyword');
    return this.http.get(this.env.host_fistar+'/api/admin/partners/'+id);
  }


  
}


