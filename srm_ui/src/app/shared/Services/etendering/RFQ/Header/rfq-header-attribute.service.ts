import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderAttributeService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/rfqAtt/';

  getRFQHeaderAttributeByRFQId(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderAttributeByRFQId";
    params = params.append('rfqid', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }

  public deleteRFQHeaderAttribute(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQAttributes", models, httpOptions);
  }

  public deleteRFQHeaderAttributeGroup(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQAttributeGroup", models, httpOptions);
  }

  // deleteRFQHeaderAttributeGroup(id: any) {
  //   let params = new HttpParams();
  //   var endpointUrl = this.url;
  //   endpointUrl = endpointUrl + "DeleteRFQAttributeGroup";
  //   params = params.append('id', id);
  //   return this.http.delete<any>(endpointUrl, { params });
  // }

  getReusableAttributeList(searchModel: AttributeGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupSearch";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  getAttributeItemByRFQId(searchModel: AttributeSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeSearchByRFQId";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  public saveHeaderAttribute(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQAttribute", models, httpOptions);
  }

  getHeaderAttributeCategoryType() {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetHeaderAttributeCategoryType";
    return this.http.get<any>(endpointUrl, { params });
  }

  getHeaderAttributeDataType() {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetHeaderAttributeDataType";
    return this.http.get<any>(endpointUrl, { params });
  }

  public UpdateRFQAttribute(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "UpdateRFQAttribute", models, httpOptions);
  }
}