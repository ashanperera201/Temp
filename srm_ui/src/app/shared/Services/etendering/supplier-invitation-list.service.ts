import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { Observable, ReplaySubject } from 'rxjs';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';

@Injectable({
  providedIn: 'root'
})
export class SupplierInvitationListService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/supp/';

  getSGList(searchModel: SupplierGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSupplierGroupList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SupplierGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getSupplierGroupMappingList(searchModel: SupplierGroupSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSupplierGroupMappingList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SupplierGroupSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getSList(searchModel: SupplierSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSupplierList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SupplierSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  GetSupplierGroupByID(id: any) {

    //  //debugger;

    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSupplierGroupByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }

  public DeleteItem(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteSupplierGroup", models, httpOptions);
  }

  public DeleteSupplierGroupMapping(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteSupplierGroupMapping", models, httpOptions);
  }

  public SaveSupplierGroupMapping(models: any[], index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };

    return this.http.post<any[]>(this.url + "SaveSupplierGroupMapping", models, httpOptions);

  }


  public SaveSupplierGroup(models: any[], index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "SaveSupplierGroup", models, httpOptions);
  }

  public login(userName, password): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public createEditTeam(supplierGroupSearchModel: SupplierGroupSearchModel, index?: any): Observable<SupplierGroupSearchModel> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<SupplierGroupSearchModel>(this.url + "SaveSIL", supplierGroupSearchModel, httpOptions);
  }
}
