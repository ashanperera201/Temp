import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { RFQHeaderTermsConditionSearchModel } from 'app/main/Models/etendering/ViewModels/rfq-header-terms-condition-search-model';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderTCService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/rfqtc/';

  GetRFQHeaderTermsConditionList(searchModel: RFQHeaderTermsConditionSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderTermsConditionList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<RFQHeaderTermsConditionSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  getRFQHeaderTermsConditionByRFQId(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderTermsConditionByRFQId";
    params = params.append('RFQId', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetRFQHeaderTermsConditionByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderTermsConditionByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQHeaderTermsCondition(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHeaderTermsCondition", models, httpOptions);
  }

  public DeleteRFQHeaderTermsCondition(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHeaderTermsCondition", models, httpOptions);
  }

}