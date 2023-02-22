import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NumberingSequenceSearchModel } from 'app/main/Models/etendering/numbering-sequence-search-model';
import { environment } from 'environments/environment'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NumberingSequenceService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + 'api/numseq/';

  getNumberingSequenceList(searchModel : NumberingSequenceSearchModel){
    let params = new HttpParams();      
    params = params.append('tabIndex', 2);   
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "/GetNumberingSequenceList";
    const httpOptions = { headers: new HttpHeaders(),params:params };
    return this.http.post<NumberingSequenceSearchModel>(endpointUrl, searchModel,httpOptions);
  }
  
  getNumberingSequenceById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetNumberingSequenceByID";
    params = params.append('id', id);  
    return this.http.get<any>(endpointUrl, {params});
  }

  public login(userName, password): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(environment.apiUrl + "/api/auth/login", { "UserName": userName, "Password": password }, httpOptions);
  }

  public createEditNumberingSequence(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "SaveNumberingSequence", models[0], httpOptions);
  }

  public deleteNumberingSequence(models: any[], index?: any): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
    return this.http.post<any>(this.url + "DeleteNumberingSequence", models, httpOptions);
  }
}
