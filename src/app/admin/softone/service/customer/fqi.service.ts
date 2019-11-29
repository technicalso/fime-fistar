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


export class FqiService {
  public env: any = environment;
  public url: string;
  constructor(
    private http: HttpClient) {
    this.url = this.env.host_fistar;
  }

  addFQI(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/faqs`, body);
    // http://api-f6-partner.softone.asia/api/admin/faqs
  }

  getFQI(url) {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }

  updateFQI(body, id) {
    return this.http.put(`${this.env.host_fistar}/api/admin/faqs/${id}`, body);
  }

  getOneFQI(id) {
    return this.http.get(`${this.env.host_fistar}/api/admin/faqs/${id}`);
  }

  deleteFQI(body) {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/faq`, body, httpOptions);
  }

  searchFQI(title, state, type, page?) {
    let param_page = page ? `&page=${page}` : '';
    if (state != 'all' && type != 'all') {
      return this.http.get(`${this.env.host_fistar}/api/admin/faqs?keyword=${title}&faq_state=${state}&faq_type=${type}` + param_page);
    }
    else if (type != 'all') {
      return this.http.get(`${this.env.host_fistar}/api/admin/faqs?keyword=${title}&faq_type=${type}` + param_page);
    }
    else if (state != 'all') {
      return this.http.get(`${this.env.host_fistar}/api/admin/faqs?keyword=${title}&faq_state=${state}` + param_page);
    }
    else {
      return this.http.get(`${this.env.host_fistar}/api/admin/faqs?keyword=${title}` + param_page);
    }
  }
}
