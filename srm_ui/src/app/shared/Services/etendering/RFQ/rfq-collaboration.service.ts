;
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqCollaborationService {

  url = environment.apiUrl + 'api/RfqCT/';
  url1 = environment.apiUrl + 'api/RfqCTA/';
  constructor(private http: HttpClient) { }
  // getRFQCollaborationTeamByRFQID(id: any) {
  //   let params = new HttpParams();
  //   params = params.append('id', id);
  //   var endpointUrl = environment.apiUrl + 'api/rfqcur/';
  //   endpointUrl = endpointUrl;
  //   endpointUrl = endpointUrl + "GetRFQCollaborationTeamByRFQID";
  //   return this.http.get<any>(endpointUrl, { params });
  // }
  getRFQCollaborationTeamByRFQID(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQCollaborationTeamByRFQID";
    params = params.append('rfqId', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }
  getRFQCollaborationTeamAccessByRFQID(rFQHeaderAttachmentSearchModel: any) {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };

    return this.http.post<any>(this.url1 + "GetRFQCollaborationTeamAccessByRFQID", rFQHeaderAttachmentSearchModel, httpOptions);
  }
  GetRFQCollaborationTeamAccessByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url1;
    endpointUrl = endpointUrl + "GetRFQCollaborationTeamAccessByID";
    params = params.append('Id', id);
    return this.http.get<any>(endpointUrl, { params });
  }
  public saveRFQCollaborationTeamAcess(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url1 + "SaveRFQCollaborationTeamAcess", models, httpOptions);
  }
 
  public deleteRFQCollaborationTeamAccessByID(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url1 + "DeleteRFQCollaborationTeamAccessByID", models, httpOptions);
  }
  public SaveRFQCollaborationTeam(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQCollaborationTeam", models, httpOptions);
  }
  public RFQSaveCollaborationTeamAcess(searchModel: any): Observable<any> {
   
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "RFQSaveCollaborationTeamAcess";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }
}
