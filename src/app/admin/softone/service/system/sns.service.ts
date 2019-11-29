import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class SnsService {
  public env: any = environment;
  public url : string;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar;
  }
  getSNS(url)
  {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }
  getOneSNS(id)
  {
    return this.http.get(`${this.env.host_fistar}/api/admin/sns-permissions?sns_id=${id}`);
  }
  detailtSns(id)
  {
    return this.http.get(`${this.env.host_fistar}/api/admin/sns/${id}`);
  }
  createSNS(body)
  {
    return this.http.post(`${this.env.host_fistar}/api/admin/sns`,body,httpOptions);
  }
  createSnsPermission(body)
  {
    return this.http.post(`${this.env.host_fistar}/api/admin/sns-permissions`,body,httpOptions);
  }
  updateSNS(body,id)
  {
    return this.http.put(`${this.env.host_fistar}/api/admin/sns/${id}`,body);
  }
  deleteSNS(body)
  {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/sns`,body,httpOptions);
  }
}
