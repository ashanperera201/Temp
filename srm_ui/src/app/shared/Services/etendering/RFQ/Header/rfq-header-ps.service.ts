import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class RfqHeaderPSService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/PaymentSchedule/';

  GetPaymentScheduleByRFQId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPaymentScheduleByRFQId";
    params = params.append('RFQId', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  getPaymentSchedule(rfqId: any): Observable<any> {
    return this.http.get<any>(`${this.url}/GetPaymentScheduleByRFQId/${rfqId}`);
  }

  GetPaymentScheduleByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPaymentScheduleByID";
    params = params.append('RFQId', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SavePaymentSchedule(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SavePaymentSchedule", models, httpOptions);
  }

  public DeletePaymentSchedule(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeletePaymentSchedule", models, httpOptions);
  }

}

