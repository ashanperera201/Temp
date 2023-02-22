import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineDeliverableService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/RFQPartLineDeliverable/';

  GetPartLineDeliverableById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineDeliverableById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetPartLineByPartLineRFXId(RFXId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineByPartLineRFXId";
    params = params.append('id', RFXId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQPDeliverable(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPDeliverable", models, httpOptions);
  }

  public DeleteDeliverables(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteDeliverables", models, httpOptions);
  }

  public getPartLineDeliverableByRFQPartLineId(RFXId: any, partLineId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineDeliverableByRFQPartLineId";
    params = params.append('RFXId', RFXId);
    params = params.append('partLineId', partLineId);
    return this.http.get<any>(endpointUrl, { params });
  }
}
