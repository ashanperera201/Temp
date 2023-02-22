import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NegotiationStyleSearchModel } from 'app/main/Models/etendering/negotiation-style-search-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NegotiationStyleService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'NegotiationStyle/';

  getNegotiationStyleList(searchModel: NegotiationStyleSearchModel) {
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetNegotiationStyleList";
    const httpOptions = { headers: new HttpHeaders(), params: null };
    return this.http.post<NegotiationStyleSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getNegotiationStyleById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetNSByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public createEditNegotiationStyle(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "SaveNegotiationStyle", models[0], httpOptions);
  }

  public deleteNegotiationStyle(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteNegotiationStyle", models, httpOptions);
  }

  getDefault() {
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "ValidateDefault";
    return this.http.get<any>(endpointUrl);
  }
}