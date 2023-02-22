import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineAttributeService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/rfqPartAttribute/';

  getRFQPartLineAttributeByRFQId(rfqid: any, rfqPartLineId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQLineAttributeByRFQId";
    params = params.append('rfqid', rfqid);
    params = params.append('rfqPartLineId', rfqPartLineId);

    return this.http.get<any>(endpointUrl, { params });
  }

  public savePartLineAttribute(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQLineAttribute", models, httpOptions);
  }

  public deleteRFQPartLineAttribute(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQLineAttributes", models, httpOptions);
  }

  public deleteRFQPartLineAttributeGroup(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQLineAttributeGroup", models, httpOptions);
  }

  // deleteRFQPartLineAttributeGroup(id: any) {
  //   let params = new HttpParams();
  //   var endpointUrl = this.url;
  //   endpointUrl = endpointUrl + "DeleteRFQLineAttributeGroup";
  //   params = params.append('id', id);
  //   return this.http.delete<any>(endpointUrl, { params });
  // }

  getPartLineReusableAttributeList(searchModel: AttributeGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineAttributeGroupSearch";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  getPartLineAttributeItemByRFQId(searchModel: AttributeSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineAttributeSearchByRFQId";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  getLineAttributeCategoryType() {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetLineAttributeCategoryType";
    return this.http.get<any>(endpointUrl, { params });
  }

  getLineAttributeDataType() {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetLineAttributeDataType";
    return this.http.get<any>(endpointUrl, { params });
  }

  public UpdateRFQPartAttribute(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "UpdateRFQPartAttribute", models, httpOptions);
  }
}
