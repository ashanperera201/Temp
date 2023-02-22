import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborationTeamService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/CT/';

  getCTList(searchModel: CollaborationTeamSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCTList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<CollaborationTeamSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getCTById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetCTByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public login(userName, password): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public createEditTeam(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCT", models, httpOptions);
  }

  public DeleteItem(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: models };
    return this.http.delete<any>(this.url + "DeleteCollaborationTeam", httpOptions);
  }

  public SaveCollaborationTeamAcess(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCollaborationTeamAcess", models, httpOptions);
  }

  public SaveCollTeamAcess(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCollTeamAcess", models, httpOptions);
  }

  public saveCollaborationTeamAcess(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveCollaborationTeamAcess", models, httpOptions);
  }
  

  GetColloborationTeamNameList() {
    //let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetColloborationTeamNameList";
    //params = params.append('CBTeamId',);
    return this.http.get<any>(endpointUrl);
  }
}