import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderCostFactorService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/RFQHeaderCostFactor/';

  GetRFQHeaderCostFactorGroupByRFQId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderCostFactorGroupByRFQId";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getCostFactorSearchByRFQId(searchModel: CostFactorSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCostFactorSearchByRFQId";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getRFQHeaderCostFactorById(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderCostFactorById";
    params = params.append('id', Id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQHeaderCostFactorByGroupId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderCostFactorByGroupId";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getCostFactorGroupSearch(searchModel: CostFactorGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCostFactorGroupSearch";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  public SaveRFQHeader(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHeader", models, httpOptions);
  }

  public DeleteRFQHeaderCostFactor(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHeaderCostFactor", models, httpOptions);
  }
//

}
