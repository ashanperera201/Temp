import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TermsConditionSearchModel } from 'app/main/Models/etendering/ViewModels/terms-condition-search-model';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  
  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/tc/';
  GetTermsConditionList(searchModel: TermsConditionSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetTermsConditionList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<TermsConditionSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  GetTermsConditionByID(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetTermsConditionByID";
    params = params.append('id', id);  
    return this.http.get<any>(endpointUrl, {params});

  }

  GetTermsConditionNameList() {
    // let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetTermsConditionNameList";
    // params = params.append('id', id);  
    return this.http.get<any>(endpointUrl);

  }


  public login(userName, password): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  
  public SaveTermsCondition(models: any[], index?: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };

    return this.http.post<any[]>(this.url + "SaveTermsCondition", models, httpOptions);

  }
  
  public DeleteTermsCondition(models: any[], index?: any): Observable<any> {

    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

    return this.http.post<any>(this.url + "DeleteTermsCondition", models, httpOptions);

  }

  public uploadFile = (formData) => {
    
    return this.http.post(this.url + 'Upload', formData, { reportProgress: true, observe: 'events' })

  }

  public DownloadMedia = (etmedia) => {
    let params = new HttpParams();
    params = params.append('mediaid', etmedia.id);  
     
    
    return this.http.get(this.url + 'DownloadFile', { params,responseType: 'blob' })

  }

  public DeleteFile = (etmedia) => {
    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: etmedia};
    return this.http.delete<any>(this.url + 'DeleteTCFile',  httpOptions);
  

  }


}
