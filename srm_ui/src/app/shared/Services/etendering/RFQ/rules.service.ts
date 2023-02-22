import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  constructor(private http: HttpClient ) { }
  url = environment.apiUrl + 'api/RFQHeaderLineRule/'; 

  getRFQHeaderNoteById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderLineRulesByID";
    params = params.append('Id', id);  
    return this.http.get<any>(endpointUrl, {params});
  }

  getNsById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQHeaderLineRulesByStyleID";
    params = params.append('Id', id);  
    return this.http.get<any>(endpointUrl, {params});
  }
  
  public SaveRules(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "SaveRFQHeaderLineRules", models, httpOptions);
  }

}
