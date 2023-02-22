import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyQuestionSearchModel } from 'app/main/Models/etendering/survey-form-search-model';
import { SurveyTemplateModel } from 'app/main/Models/etendering/survey-template-model';
import { SurveyTemplateSearchModel } from 'app/main/Models/etendering/survey-template-search-model';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqHeaderSurveyFormService {

  constructor(private http: HttpClient) { }

  url = environment.apiUrl + "api/RFQSurveyQuestion/";
  url1 = environment.apiUrl + "api/surtemp/";

  GetRFQSurveyQuestionById(id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQSurveyQuestionById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetRFQSurveyQuestionByRFQId(rfqId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQSurveyQuestionsByRFQId";
    params = params.append('rfqid', rfqId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveRFQSurveyQuestionTemplate(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url + "SaveRFQSurveyQuestions", models, httpOptions);
  }

  public DeleteRFQSurveyTemplate(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteRFQSurveyTemplate", models, httpOptions);
  }

  public DeleteSurveyQuestions(models: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + "DeleteSurveyQuestions", models, httpOptions);
  }

  GetSurveyQuestionSearchByRFQId(searchModel: SurveyQuestionSearchModel) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyQuestionSearchByRFQId";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SurveyQuestionModel>(endpointUrl, searchModel, httpOptions);
  }

  GetSurveyTemplateSearch(searchModel: SurveyTemplateSearchModel) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetSurveyTemplateSearch";
    const httpOptions = { headers: new HttpHeaders(), params: params };
    return this.http.post<SurveyTemplateModel>(endpointUrl, searchModel, httpOptions);
  }

  GetSurveyQuestionByID(id: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQSurveyQuestionsById";
    params = params.append('id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetSurveyTemplates(id: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url1;
    endpointUrl = endpointUrl + "GetSurveyTemplates";
    params = params.append('surveyquestionid', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  GetRFQSurveyQuestionByTemplateID(id: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetRFQSurveyQuestionByTemplateId";
    params = params.append('templateId', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveSurveyQuestion(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url1 + "SaveSurveyQuestion", models, httpOptions);
  }

  public GetRFQHeaderSurveyByRFQ(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url + "GetRFQHeaderSurveyByRFQ", models, httpOptions);
  }
}
