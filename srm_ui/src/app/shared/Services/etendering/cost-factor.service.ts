import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostFactorService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/CF/';

  getCFList(searchModel: CostFactorSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCFList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getCFById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCFByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveCF(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCF", models, httpOptions);
  }

  public DeleteItem(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteCostFactor", models, httpOptions);
  }

  public updateCFList(models: any[], index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "UpdateCurrencies", models, httpOptions);
  }
  //
  public SaveCostFactor(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "SaveCostFactor", models, httpOptions);
  }

  GetCostfactorNameList() {
    // let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCostfactorNameList";
    // params = params.append('id', id);  
    return this.http.get<any>(endpointUrl);

  }
  //
}
