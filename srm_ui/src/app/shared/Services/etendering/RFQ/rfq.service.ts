import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDTextModel } from 'app/main/Models/etendering/ViewModels/idTextModel';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {PODetails} from 'app/modules/pages/po-info/data'

@Injectable({
  providedIn: 'root'
})

export class RfqService {

  private baseUrl: string = environment.apiUrl;
  url2 = environment.apiUrl + 'api/RFQApproval/';
  url = environment.apiUrl + 'api/RFQ/';
  url3 = environment.apiUrl + 'api/RFXHistory/';
  url4 = environment.apiUrl + 'api/evaluation/';
  url5 = environment.apiUrl + 'api/agreement/';
  url6 = environment.apiUrl + 'api/RFQshInformation/';

  constructor(private http: HttpClient) { }

  getRFQbyId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/RFQ/GetRFQByID/${id}`);
  }

  getRFQById(id: any, isrevision: boolean, isTemplateSelectionPage: boolean) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl;
    params = params.append('id', id);
    params = params.append('isTemplateSelectionPage', isTemplateSelectionPage);
    params = params.append('isRevision', isrevision);
    endpointUrl = endpointUrl + "GetRFQByID";
    return this.http.get<RFQViewModel>(endpointUrl, { params });
  }

  GetRFQCurrencyByRFQId(id: any) {
    let params = new HttpParams();
    params = params.append('id', id);
    var endpointUrl = environment.apiUrl + 'api/rfqcur/';
    endpointUrl = endpointUrl;
    endpointUrl = endpointUrl + "GetRFQCurrencyByRFQId";
    return this.http.get<RFQViewModel>(endpointUrl, { params });
  }

  public SaveRFQ(model: any, index?: any): Observable<any> {
    model.publishDate = model.publishDate ? new Date(model.publishDate).toISOString() : null;
    model.bidOpeningDate = model.bidOpeningDate ? new Date(model.bidOpeningDate).toISOString() : null;
    model.bidClosingDate = model.bidClosingDate ? new Date(model.bidClosingDate).toISOString() : null;
    model.awardDate = model.awardDate ? new Date(model.awardDate).toISOString() : null;
    model.previewDate = model.previewDate ? new Date(model.previewDate).toISOString() : null;
    model.eventOnAwardDate = model.eventOnAwardDate ? new Date(model.eventOnAwardDate).toISOString() : null;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "SaveRFQ";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  public DeleteRFQCurrency(model: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/rfqcur/';
    endpointUrl = endpointUrl + "DeleteRFQCurrency";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  getCities(countryId: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = environment.apiUrl + 'api/util/';
    endpointUrl = endpointUrl;
    params = params.append('countryId', countryId);
    endpointUrl = endpointUrl + "GetCityByID";
    return this.http.get<IDTextModel[]>(endpointUrl, { params });
  }

  getPorts(cityId: any) {
    let params = new HttpParams();
    params = params.append('tabIndex', 2);
    var endpointUrl = environment.apiUrl + 'api/util/';
    endpointUrl = endpointUrl;
    params = params.append('cityId', cityId);
    endpointUrl = endpointUrl + "GetPortbyCityID";
    return this.http.get<IDTextModel[]>(endpointUrl, { params });
  }

  // Pause RFX button on 'More' drop-down - Shohan
  pauseRFX(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "PauseRFx";
    params = params.append('id', Id);
    return this.http.get<any>(endpointUrl, { params });
  }

  // Revise RFX button on 'More' drop-down - Shohan
  reviseRFX(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "ReviseRFx";
    params = params.append('id', Id);
    return this.http.get<any>(endpointUrl, { params });
  }

  // Cancel RFX button on 'More' drop-down - Shohan
  cancelledRFX(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "CancelledRFx";
    params = params.append('id', Id);
    return this.http.get<any>(endpointUrl, { params });
  }

  evaluationInitiationRFX(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "evaluationInitiationRFX";
    params = params.append('rfqId', Id);
    return this.http.get<any>(endpointUrl, { params });
  }
  // public cancelledRFX(model: any, index?: any): Observable<any> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
  //   return this.http.post<any>(this.url + "CancelledRFx", model, httpOptions);
  // }

  //Create FollowOn button on 'More' drop-down - Gangez
  CreateFollowOnEvent(Id: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "CreateFollowOnEvent";
    params = params.append('id', Id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveScoring(model: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl + "SaveScorings";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  copyRFQ(rfqId: any) {
    let formData = new FormData();
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl + "CopyRFQ";
    formData.append('rfqId', rfqId);
    return this.http.post<any>(endpointUrl, formData);
  }

  public SendForApproval = (model: any, index?: any): Observable<any> => {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url2 + "SendForApproval", model, httpOptions);
  }

  GetRFXHistoryByRFXID(RFXId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url3;
    endpointUrl = endpointUrl + "GetRFQHistoryDataForExport";
    params = params.append('Id', RFXId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public updateRFQApprovalStatus(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url2 + "UpdateRFQApprovalStatus", model, httpOptions);
  }

  getRFQApprovalStatusByRFQId(rfqid: any, approvaltype: any) {
    let params = new HttpParams();
    var endpointUrl = this.url2;
    endpointUrl = endpointUrl + "GetRFQApprovalStatusByRFQId";
    params = params.append('rfqId', rfqid);
    params = params.append('approvalType', approvaltype);
    return this.http.get<any>(endpointUrl, { params });
  }

  uploadAssetList(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileListForm', file);
    return this.http.post<File>(this.url + "uploaddocument", formData);
  }

  public getBeedEvaluation(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "GetBeedEvaluation", models, httpOptions);
  }

  public saveBeedEvaluation(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "SaveBeedEvaluation", model, httpOptions);
  }

  //Publish RFX 
  public PublishRFX(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "PublishRFX";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  public getCBA(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "GetCBA", models, httpOptions);
  }

  public getROA(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "GetROA", models, httpOptions);
  }

  public saveROA(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "SaveROA", models, httpOptions);
  }

  public publishROA(rfqid: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "PublishROA", rfqid, httpOptions);
  }

  GetAgreementInformationByRFQId(rfqid: any,supplierId:any) {
    let params = new HttpParams();
    var endpointUrl = this.url5;
    endpointUrl = endpointUrl + "GetAgreementInformationByRFQId";
    params = params.append('rfqId', rfqid);
    params = params.append('supplierId', supplierId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public SaveAgreementInformation(models: any, index?: any): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any[]>(this.url5 + "SaveAgreementInformation", models, httpOptions);
  }

  public UpdateIsTemplate(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "UpdateIsTemplate";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  public getSummary(models: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(this.url4 + "GetSummary", models, httpOptions);
  }

  public ReassignOwner(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "ReassignOwner";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  public getRFQDataForExport(id: any): Observable<any> {
    let params = new HttpParams();
    var endpointUrl = environment.apiUrl + 'api/RFQ/GetRFQDataForExport'
    params = params.append('Id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  getApproveRejectWidgetData(rfqid: any) {
    let params = new HttpParams();
    var endpointUrl = this.url2;
    endpointUrl = endpointUrl + "GetApproveRejectWidgetData";
    params = params.append('rfqId', rfqid);
    return this.http.get<any>(endpointUrl, { params });
  }

  public validateRFQ(model: any[], index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "ValidateRFQ";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }


  public getEvaluators(RFQID: any, category: any): Observable<any> {
    let params = new HttpParams();
    var endpointUrl = this.url4;
    endpointUrl = endpointUrl + "GetEvaluators";
    params = params.append('RFQID', RFQID);
    params = params.append('Category', category);
    return this.http.get<any>(endpointUrl, { params });
  }

  public downloadMedia = (etmedia) => {
    let params = new HttpParams();
    params = params.append('mediaid', etmedia.id);
    return this.http.get(this.url6 + 'DownloadFile', { params, responseType: 'blob' })
  }

  getCurrency(id: any) {
    let params = new HttpParams();
    params = params.append('id', id);
    var endpointUrl = environment.apiUrl + 'api/rfqcur/';
    endpointUrl = endpointUrl + "GetRFQCurrency";
    return this.http.get<any>(endpointUrl, { params });
  }
  getPOTransferData(RFXId: any) {
    let params = new HttpParams();
    var endpointUrl = this.url;
    endpointUrl = endpointUrl + "GetPOTransferData";
    params = params.append('Id', RFXId);
    return this.http.get<any>(endpointUrl, { params });
  }

  public UpdateRFQStatus(model: any, index?: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "UpdateRFQStatus";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }

  getCurrencyListWithDefaults(rfxType: any) {
    let params = new HttpParams();
    // params = params.append('tabIndex', 2);
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl;
    params = params.append('rfxType', rfxType);
 
    endpointUrl = endpointUrl + "GetCurrencyListWithDefaults";
    return this.http.get<any>(endpointUrl, { params });
  }

  
  createRFQFromTemplate(rfqId: any) {
    let formData = new FormData();
    var endpointUrl = environment.apiUrl + 'api/rfq/';
    endpointUrl = endpointUrl + "CreateRFQFromTemplate";
    formData.append('rfqId', rfqId);
    return this.http.post<any>(endpointUrl, formData);
  }
  
  public getRFQEvaluationDataForExportPDF(id: any): Observable<any> {
    let params = new HttpParams();
    var endpointUrl = environment.apiUrl + 'api/RFQ/GetRFQEvaluationDataForExportPDF'
    params = params.append('Id', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public getTBECBEGraphForReports(id: any): Observable<any> {
    let params = new HttpParams();
    var endpointUrl = this.url4 + 'GetTBECBEGraphForReports'
    params = params.append('RFQID', id);
    return this.http.get<any>(endpointUrl, { params });
  }

  public UpdateBidClosingDate(model: any, index?: any): Observable<any> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var endpointUrl = environment.apiUrl + 'api/RFQ/';
    endpointUrl = endpointUrl + "UpdateBidClosingDate";
    return this.http.post<any>(endpointUrl, model, httpOptions);
  }
}