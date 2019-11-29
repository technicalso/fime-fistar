import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};


const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');
headers.append('Authorization', 'my-auth-token');

@Injectable({
  providedIn: 'root'
})
export class CodesService {
  public env: any = environment;
  public url: string;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar;
  }

  getCodes(url) {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }

  deleteCodes(data) {
    let cdg_ids:Array<string>[] = [data];

    return this.http.post(this.env.host_fistar+'/api/admin/delete-many/code_group',{'cdg_ids':cdg_ids},httpOptions);
  }

  createCodeGroup(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/code-groups`, body, httpOptions);
  }

  updateCodeGroup(id, body) {
    return this.http.put(`${this.env.host_fistar}/api/admin/code-groups/${id}`, body);
  }

  updateCode(id, body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/codes/${id}`, body, { headers: headers });
  }

  searchCode(name, state, cdg_id, page) {
    return this.http.get(`${this.env.host_fistar}/api/admin/list-code/search?keyword=${name}&cdg_id=${cdg_id}&cdg_state=${state}&page=${page}`);
  }

  createCodes(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/codes`, body, { headers: headers });
  }

  deleteCode(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/code`, body, httpOptions);
  }
}
