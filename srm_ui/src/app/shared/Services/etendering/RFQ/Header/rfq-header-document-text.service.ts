import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderDocumentTextService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/DocumentText/';

  getRFQDocumentTextByRFQId(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderDocumentTextByRFQId";
    params = params.append('rfqid', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQHeaderDocumentTextById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderDocumentTextById";
    params = params.append('rFQId', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQHeaderDocumentText(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHeaderDocumentText", models, httpOptions);
  }

  public DeleteRFQHeaderDocumentText(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHeaderDocumentText", models, httpOptions);
  }
}
