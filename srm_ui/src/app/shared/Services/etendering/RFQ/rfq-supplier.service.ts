import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RFQSupplierSearchModel } from 'app/main/Models/etendering/rfq-supplier-search-model';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RfqSupplierService {

  constructor(private http: HttpClient) { }

  suppURL = environment.apiUrl + 'api/supp/';
  suppContactURL = environment.apiUrl + 'api/supContact/';
  rfqURL = environment.apiUrl + 'api/RFQ/';

  getSupplierList(searchModel: SupplierSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.suppURL;
    endpointUrl = endpointUrl + "GetSupplierList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  GetSupplierContactBySupplierId(supplierid: any) {
    let params = new HttpParams();
    var endpointUrl = this.suppContactURL;
    endpointUrl = endpointUrl + "GetSupplierContactBySupplierId";
    params = params.append('supplierid', supplierid);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQSupplierByRFQId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + "GetRFQSupplier";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQSupplierList(searchModel: RFQSupplierSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    let endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + "GetRFQSupplierList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  public SaveRFQSupplier(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.rfqURL + "SaveRFQSupplier", models, httpOptions);
  }

  public DeleteRFQSupplier(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.rfqURL + "DeleteRFQSupplier", models, httpOptions);
  }

  public resendInvite(models: any, index?: any): Observable<any> {
    let endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + 'RFQSupplier/ResendInvite';
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(endpointUrl, models, httpOptions);
  }

  getRFQSupplierForChats(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + "GetRFQSupplierForChats";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQSupplierWithoutContacts(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + "GetRFQSupplierWithoutContacts";
    params = params.append('rfqId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public saveEmergencySupplier(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.suppURL + 'SaveEmergencySupplier', models, httpOptions);
  }

  
  getSubmittedResponseSupplier(rfqId: any,attributeCategory:any) {
    let params = new HttpParams();
    var endpointUrl = this.rfqURL;
    endpointUrl = endpointUrl + "GetSubmittedResponseSupplier";
    params = params.append('rfqId', rfqId);
    params = params.append('attributeCategory', attributeCategory);
    return this.http.get<any>(endpointUrl, { params });
  }
}
