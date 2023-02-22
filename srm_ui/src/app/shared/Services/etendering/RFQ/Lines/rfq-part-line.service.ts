import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/rfqPartLine/';

  getPartLineById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineById";
    params = params.append('id', id);  
    return this.http.get<any>(endpointUrl, {params});

  }

  getPartLineByPartLineRFQId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineByPartLineRFQId";
    params = params.append('id', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQPartLine(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPartLine", models, httpOptions);
  }
}
