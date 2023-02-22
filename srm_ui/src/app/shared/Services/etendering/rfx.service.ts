import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RFXSearchModel } from 'app/main/Models/etendering/rfx-search-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RFXService {
  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/RFQ/';

  getRFQList(searchModel: RFXSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<RFXSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  public login(userName, password): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public createEditTeam(rfxSearchModel: RFXSearchModel, index?: any): Observable<RFXSearchModel> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<RFXSearchModel>(this.url + "SaveCT", rfxSearchModel, httpOptions);
  }

  public DeleteItem(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQ", models, httpOptions);
  }

  getRFXList(searchModel: RFXSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFXList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<RFXSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  public SaveRFQTemplate(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQTemplate", models, httpOptions);
  }

}

