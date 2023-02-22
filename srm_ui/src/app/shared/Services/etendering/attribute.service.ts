import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { Observable, ReplaySubject } from 'rxjs';
import { AttributeCategory } from 'app/main/Models/etendering/AttributeCategory';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/attribute/';
  getAttributeList(searchModel: AttributeSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<AttributeSearchModel>(endpointUrl, searchModel, httpOptions);

  }

  getAttributeListData(): Observable<AttributeCategory[]> {
    return this.http.get<AttributeCategory[]>(`${this.url}getattributecategory`);
  }
  getAttributeById(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }
  GetAttributeFormatValueByDataTypeID(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeFormatValueByDataTypeID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }
  GetIFSTable() {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetIFSTables";
    //params = params.append();  
    return this.http.get<any>(endpointUrl, { params });

  }
  GetIFSValue(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetIFSValue";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }

  GetTableData(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetTableData";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }

  ValidateSql(id: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "ValidateSql";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });

  }


  public login(userName, password): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }
  public SaveAttribute(models: any, index?: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "SaveAttribute", models, httpOptions);
  }
  /*  public createEditTeam(attributeSearchModel: AttributeSearchModel,index?:any): Observable<AttributeSearchModel> {    
   
     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params:null };
 
      
     return this.http.post<AttributeSearchModel>(this.url +"SaveAttribute"   , attributeSearchModel, httpOptions); 
   } */
  public DeleteItem(models: any[], index?: any): Observable<any> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


    return this.http.post<any>(this.url + "DeleteAttributes", models, httpOptions);
  }

  GetAttributeNameList() {
    // let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetAttributeNameList";
    // params = params.append('id', id);  
    return this.http.get<any>(endpointUrl);

  }
}
