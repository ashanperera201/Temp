import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RfqHeaderDeliverablesService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/RFQHeaderDeliverable/';

  GetRFQHeaderDeliverablesById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderDeliverablesById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetHeaderDeliverablesByRFXId(RFXId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPartLineByPartLineRFXId";
    params = params.append('id', RFXId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQHDeliverable(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQHDeliverable", models, httpOptions);
  }

  public DeleteDeliverables(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteDeliverables", models, httpOptions);
  }

}
