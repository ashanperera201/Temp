import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor(private http: HttpClient) { }

  getScorings(rfqid: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl;
    params = params.append('rfqId', rfqid);
    endpointUrl = endpointUrl + "GetScorings";
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveScoring(model: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl + "SaveScorings";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }
  public SaveScoringsRFQ(model: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl + "SaveScoringsRFQ";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }
}
