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
export class AccountService {
  public env: any = environment;
  public url: string;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar;
  }
  getAccount(url) {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }

  getAccountById(id) {
    return this.http.get(`${this.env.host_fistar}/api/admin/user-admin-fime/${id}`);
  }

  createAccount(user_no, body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/users/access-control/${user_no}`, body, httpOptions);
  }

  searchAccount(filter, keyword, page) {
    return this.http.get(`${this.env.host_fistar}/api/admin/user-admin-fime?filter=${filter}&keyword=${keyword}&page=${page}`);
  }

  updateAccess(USER_NO, body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/users/access-control/${USER_NO}`, body, httpOptions);
  }

  saveUser(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/users/popup/access-control`, body, httpOptions);
  }
  updateStatus(USER_NO) {
    return this.http.post(`${this.env.host_fistar}/api/admin/users/change-status/${USER_NO}`, httpOptions);
  }
  deleteAccount(USER_NO) {
    return this.http.delete(`${this.env.host_fistar}/api/admin/user-admin-fime/${USER_NO}`, httpOptions);
  }

  addAccountAdmin(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/user-admin-fime`, body, httpOptions);
  }

  editAccountAdmin(id, body) {
    return this.http.put(`${this.env.host_fistar}/api/admin/user-admin-fime/${id}`, body, httpOptions);
  }
}
