import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineCostFactorService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/RFQLineCostFactor/';

  getLineCostFactorGroupByRFQId(rfqId: any, RFQPartLineID: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQLineCostFactorGroupByRFQId";
    params = params.append('rfqId', rfqId);
    params = params.append('rfqPartLineID', RFQPartLineID);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQPartCostFactorByGroupId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartCostFactorByGroupId";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQPartCostFactorById(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartCostFactorById";
    params = params.append('id', Id);
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

  getCostFactorGroupSearch(searchModel: CostFactorGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCostFactorGroupSearch";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CostFactorGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  public SaveRFQPartLine(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPartLine", models, httpOptions);
  }

  public DeleteRFQLineCostFactor(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHPartRequest", models, httpOptions);
  }
}
