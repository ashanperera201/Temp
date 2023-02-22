import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderNoteService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/rfqHNote/';

  getRFQHeaderNoteByRFQId(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderNoteByRFQId";
    params = params.append('rfqid', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }

  getRFQHeaderNoteById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderNoteById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQHeaderNote(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHeaderNote", models, httpOptions);
  }

  public DeleteRFQHeaderNote(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQHeaderNote", models, httpOptions);
  }

  public GetRFQHeaderNoteByRFQ(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "GetRFQHeaderNoteByRFQ", models, httpOptions);
  }

}
