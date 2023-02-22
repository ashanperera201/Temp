import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLinePSService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/PartRequestPaymentSchedule/';

  GetPartPaymentByRFQId(rfqId: any, rfqPartLineID: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartPaymentScheduleByRFQId";
    params = params.append('RFQId', rfqId);
    params = params.append('rfqPartLineID', rfqPartLineID);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetPartPaymentScheduleByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQPartPaymentScheduleByID";
    params = params.append('Id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SavePartPaymentSchedule(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQPartPaymentSchedule", models, httpOptions);
  }

  public DeletePartPaymentSchedule(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQPartPaymentSchedule", models, httpOptions);
  }
}
