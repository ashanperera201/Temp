import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineAttachmentService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/rfqPartLineAtt/';

  getRFQPartLineAttachmentByRFQId(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineAttachmentByRFQId";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQPartLineAttachmentById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineAttachmentById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQPartLineAttachment(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPartLineAttachment", models, httpOptions);
  }

  public DeleteRFQPartLineAttachment(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQPartLineAttachment", models, httpOptions);
  }

  getRFQPartLineAttachmentByRFQPartId(rfqId: any, rfqPartLineId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineAttachmentByRFQPartId";
    params = params.append('rfqId', rfqId);
    params = params.append('rfqPartLineId', rfqPartLineId);
    return this.http.get<any>(endpointUrl, { params });
  }
}
