import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';

@Injectable({
  providedIn: 'root'
})
export class CostFactorGroupService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/CF/';

  getCFGList(searchModel: CostFactorGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCFGList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getCostFactorGroupById(id: any) {
    let queryParams = id;
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCFGByID";
    return this.http.get<any>(endpointUrl, { params: queryParams });
  }

  getCostFactor(cfgid: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCFs";
    params = params.append('id', cfgid);
    return this.http.get<any>(endpointUrl, { params });
  }

  public login(userName, password): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public SaveCostFactorGroupMapping(models: any[], index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCostFactorGroupMapping", models, httpOptions);
  }

  public SaveCostFactorGroup(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCFG", models, httpOptions);
  }

  public DeleteItem(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteCostFactorGroup", models, httpOptions);
  }

  public DeleteCostFactorGroupMapping(model: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "DeleteCostFactorGroupMapping", model, httpOptions);
  }
  //
  getCFGroupSearch(searchModel: CostFactorGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderCFList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  public SaveRFQCFGroupMapping(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "SaveRFQCFGroupMapping", models, httpOptions);
  }

  getlineCFGroupSearch(searchModel: CostFactorGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQLineCFList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  GetCostfactorGroupNameList() {
    // let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCostfactorGroupNameList";
    // params = params.append('id', id);  
    return this.http.get<any>(endpointUrl);

  }
  //
}