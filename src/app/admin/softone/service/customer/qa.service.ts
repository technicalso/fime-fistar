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
export class QaService {
  public env: any = environment;
  public url: string;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar;
  }

  addQA(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/qas`, body);
  }

  getQA(url) {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }

  updateQA(body, id) {
    return this.http.put(`${this.env.host_fistar}/api/admin/qas/${id}`, body);
  }

  getCategory() {
    return this.http.get(`${this.env.host_fistar}/api/admin/codes?cdg_id=9`);
  }

  getOneQA(id) {
    return this.http.get(`${this.env.host_fistar}/api/admin/qas/${id}`);
  }

  searchQA(title, state, type, category) {
    return this.http.get(`${this.env.host_fistar}/api/admin/qas?keyword=${title}&qa_state=${state}&qa_type=${type}&qa_category=${category}`);
  }

  deleteQA(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/qa`, body, httpOptions);
  }
}
