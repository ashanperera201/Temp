import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { RFXTemplateSearchModel } from "app/main/Models/etendering/rfx-template-search-model";
@Injectable({
  providedIn: 'root'
})
export class RFXTemplateService {

  
  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/RFXTemp/';
  getRFXTemplateList(searchModel: RFXTemplateSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFXFromTempList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<RFXTemplateSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  getAttributeGroupById(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupByID";
    params = params.append('id', id);  
    return this.http.get<any>(endpointUrl, {params});

  }


  public login(userName, password): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public SaveAttributeGroup(models: any[], index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "SaveAttributeGroup", models, httpOptions);
  }
  public DeleteItem(models: any[], index?: any): Observable<any> {

    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: models};


    return this.http.delete<any>(this.url + "DeleteCollaborationTeam",  httpOptions);
  }
  getRFXList(searchModel: RFXTemplateSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFXList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<RFXTemplateSearchModel>(endpointUrl, searchModel, httpOptions);

  }
}
