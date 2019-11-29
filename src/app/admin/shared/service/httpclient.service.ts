import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
    })
};

@Injectable()
export class HttpClientAdminService {
    private url: string;
    public env: any = environment;
    constructor(
        private http: HttpClient) {
    }

    getData(path) {
        return this.http.get(`${environment.host_fistar}/${path}`);
    }

    postData(path, body) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'my-auth-token');
        return this.http.post(`${environment.host_fistar}/${path}`, body, { headers: headers});
    }

    deleteData(path) {
        return this.http.delete(`${this.url}/${path}`, httpOptions);
    }

    putData(path, body) {
        return this.http.put(`${environment.host_fistar}/${path}`, body, httpOptions);

    }

    adminAddReview(data){
      return  this.http.post(environment.host_fistar+'/api/admin/campaign-admin-review',data,httpOptions);
    }

    getReviewAdminStatusId(id){
        return  this.http.get(environment.host_fistar+'/api/admin/campaign-admin-review/status/'+id);
      }
}


