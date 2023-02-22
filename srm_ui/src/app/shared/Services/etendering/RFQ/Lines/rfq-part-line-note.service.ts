import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineNoteService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/rfqPartLineNote/';

  getRFQPartLineNoteByRFQId(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineNoteByRFQId";
    params = params.append('rfqid', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQPartLineNoteById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineNoteById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQPartLineNote(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPartLineNote", models, httpOptions);
  }

  public DeleteRFQPartLineNote(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQPartLineNote", models, httpOptions);
  }

  getRFQPartLineNoteByRFQPartId(rfqid: any, rfqPartLineId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartLineNoteByRFQPartId";
    params = params.append('rfqId', rfqid);
    params = params.append('rfqPartLineId', rfqPartLineId);
    return this.http.get<any>(endpointUrl, { params });
  }
}
