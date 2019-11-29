import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class NotifiService {
  public env: any = environment;
  public url: string;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar;
  }
  getNoti(url) {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }
  getOneNoti(id) {
    return this.http.get(`${this.env.host_fistar}/api/admin/notices/${id}`);
  }
  deleteNoti(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/notice`, body, httpOptions);
  }

  createNoti(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/notices`, body);
  }

  updateNoti(body, notice_id) {
    return this.http.put(`${this.env.host_fistar}/api/admin/notices/${notice_id}`, body);
  }

  searchNoti(title, state, type, page) {
    console.log(`${this.env.host_fistar}/api/admin/notices?keyword=${title}&notice_state=${state}&notice_type=${type}`);

    return this.http.get(`${this.env.host_fistar}/api/admin/notices?keyword=${title}&notice_state=${state}&notice_type=${type}&page=${page}`);
  }
}
