import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SurveyTemplateSearchModel } from 'app/main/Models/etendering/survey-template-search-model';
import { SurveyQuestionSearchModel } from 'app/main/Models/etendering/survey-form-search-model';
import { SurveyTemplateItemSearchModel } from 'app/main/Models/etendering/survey-template-item-search-model';

@Injectable({
  providedIn: 'root'
})
export class SurveyTemplateService {

  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/surtemp/';

  GetSurveyQuestionByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getSurveyTemplateByID(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyTemplateByID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getSurveyTemplateList(searchModel: SurveyTemplateSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyTemplateList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SurveyTemplateSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  getSurveyQuestionList(searchModel: SurveyQuestionSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionList";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SurveyQuestionSearchModel>(endpointUrl, searchModel, httpOptions);
  }

  GetSurveyQuestionMappingBySurveyByTempID(id: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionMappingBySurveyByTempID";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveSurveyQuestionMapping(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveSurveyQuestionMapping", models, httpOptions);
  }

  public SaveSurveyQuestion(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveSurveyQuestion", models, httpOptions);
  }

  public SaveSurveyTemplate(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveSurveyTemplate", models, httpOptions);
  }

  public DeleteSurveyTemplate(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteSurveyTemplate", models, httpOptions);
  }

  public DeleteSurveyQuestion(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteSurveyQuestion", models, httpOptions);
  }

  public DeleteSurveyQuestionMapping(models: any[], index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "DeleteSurveyQuestionMapping", models, httpOptions);
  }

  GetSurveyQuestionMappingBySurveyByTempId(searchModel: SurveyTemplateItemSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionMappingBySurveyByTempID";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<any>(endpointUrl, searchModel, httpOptions);
  }

  GetSurveyQuestionNameList() {
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionNameList";
    return this.http.get<any>(endpointUrl);
  }

}