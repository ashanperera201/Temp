import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { RFQHeaderAttachmentSearchModel } from 'app/main/Models/etendering/rfq-header-attachment-search-model';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderAttachmentsService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/rfqheadatt/';

  getRFQHeaderAttachmentByRFQId(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderAttachmentByRFQId";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQHeaderAttachmentById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderAttachmentById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQHeaderAttachment(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHeaderAttachment", models, httpOptions);
  }

  public DeleteRFQHeaderAttachment(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHeaderAttachment", models, httpOptions);
  }

  public GetRFQHeaderAttachmentByRFQ(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "GetRFQHeaderAttachmentByRFQ", models, httpOptions);
  }
}
