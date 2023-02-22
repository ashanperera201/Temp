import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { Observable, ReplaySubject } from 'rxjs';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { AttributeItemSearchModel } from 'app/main/Models/etendering/attribute-items-search-model';

@Injectable({
  providedIn: 'root'
})
export class AttributeGroupService {

  
  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/attribute/';
  getAttributeGroupList(searchModel: AttributeGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<AttributeGroupSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  getAttributeGroupById(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupByID";
    params = params.append('id', id);  
    return this.http.get<any>(endpointUrl, {params});

  }

  getAttributes(searchModel: AttributeSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributes";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<AttributeSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  public SaveAttributeGroup(models: any[], index?: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "SaveAttributeGroup", models, httpOptions);
  }
  public SaveAttributeGroupMapping(models: any[], index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "SaveAttributeGroupMapping", models, httpOptions);
  }

  public DeleteItem(models: any[], index?: any): Observable<any> {

    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

    return this.http.post<any>(this.url + "DeleteAttributeGroup", models, httpOptions);

  }

  public DeleteAttributeGroupMapping(models: any[], index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "DeleteAttributeGroupMapping", models, httpOptions);
  }

  //
  
  getAttributeItemsGroupById(searchModel: AttributeItemSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupByID";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);

  }

  //
  getNewAttributeList(searchModel: AttributeGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderAttributeGroupList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  //
  public SaveRFQAttributeGroupMapping(models: any, index?: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any>(this.url + "SaveRFQAttributeGroupMapping", models, httpOptions);
  }
  //

  getNewAttributelineList(searchModel: AttributeGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQLineAttributeGroupList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  GetAttributGroupNameList() {
    // let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeGroupNameList";
    // params = params.append('id', id);  
    return this.http.get<any>(endpointUrl);

  }
}
