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
export class LanguageService {

  public env: any = environment;
  public url : string;
  constructor(
    private http: HttpClient) {
        this.url = this.env.host_fistar;
  }
  
  getUICode(url)
  {
    return this.http.get(`${this.env.host_fistar}${url}`);
  }

  createCode(link,body)
  {
    return this.http.post(`${this.env.host_fistar}${link}`,body,httpOptions);
  }

  updateUiCode(body,id)
  {
    return this.http.put(`${this.env.host_fistar}/api/admin/ui-codes/${id}`,body);
  }
  deleteCode(body)
  {
    return this.http.post(`${this.env.host_fistar}/api/admin/delete-many/unitcode`,body,httpOptions);
  }
  searchLanguage(path, page)
  {
    return this.http.get(`${this.env.host_fistar}/${path}&page=${page}`);
  }

  update(unc_id,body)
  {
    return this.http.put(`${this.env.host_fistar}/api/admin/unit-code-contents/${unc_id}`,body,httpOptions);
  }
}
