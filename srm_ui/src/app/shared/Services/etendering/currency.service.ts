import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { Observable, ReplaySubject } from 'rxjs';
// import {CurrencySearchModel} from 'app/main/Models/etendering/currency-search-model';
import {CurrencyRateSearchModel} from 'app/main/Models/etendering/currency-rate-search-model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  
  constructor(private http: HttpClient) { }
  url = environment.apiUrl + 'api/cur/';
  url1 = environment.apiUrl + 'api/rfqcur/';

  
  getCurrencyList(searchModel : CurrencyRateSearchModel){
    let params = new HttpParams();      
    params = params.append('tabIndex', 2);   
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "/GetCurrencies";
    const httpOptions = { headers: new HttpHeaders(),params:params };
    return this.http.post<CurrencyRateSearchModel>(endpointUrl, searchModel,httpOptions);
  }
  
  getCurrencyRateList(searchRateModel : CurrencyRateSearchModel){

    let params = new HttpParams();
    //params = params.append('tabIndex', 2);   
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "/GetCurrencyRates";
    const httpOptions = { headers: new HttpHeaders(),params:params };
    return this.http.post<CurrencyRateSearchModel>(endpointUrl, searchRateModel,httpOptions);

  }
  public UpdateCurrencies(models: any[], index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url + "UpdateCurrencies", models, httpOptions);
  }
  public SaveCurrencyRates(models: CurrencyRateSearchModel, index?: any): Observable<CurrencyRateSearchModel> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<CurrencyRateSearchModel>(this.url + "SaveCurrencyRate", models, httpOptions);
  }

  public SaveRFQCurrency(models: any, index?: any): Observable<any[]> {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };


    return this.http.post<any[]>(this.url1 + "SaveRFQCurrency", models, httpOptions);
  }
  public DeleteItem(models: any[], index?: any): Observable<any> {

    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: models};


    return this.http.post<any>(this.url + "DeleteCollaborationTeam",  httpOptions);
  }
  public DeleteCurrenacyRate(models: any, index?: any): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
   return this.http.post<any>(this.url + "DeleteCurrencyRate?IsActive=false", models, httpOptions);
  }

  public ActivateCurrenacyRate(models: any, index?: any): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
   return this.http.post<any>(this.url + "DeleteCurrencyRate?IsActive=true", models, httpOptions);
  }

  public DeleteCurrency(model: any, index?: any): Observable<any> {
    const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
   return this.http.post<any>(this.url + "DeleteCurrency", model, httpOptions);
  }
}
