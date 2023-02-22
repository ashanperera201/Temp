import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RFQPartLineDocumentTextModel } from 'app/main/Models/etendering/RFQPartLineDocumentTextModel';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfqPartLineDocumentTextService {
  private baseUrl: string = environment.apiUrl;
  url = environment.apiUrl + 'api/rfqPartLineDT/';
  constructor(private http: HttpClient) { }

  saveLineDocumentText(documentText: RFQPartLineDocumentTextModel): Observable<RFQPartLineDocumentTextModel> {
    return this.http.post<RFQPartLineDocumentTextModel>(`${this.baseUrl}api/rfqPartLineDT/SaveRFQPartLineDocumentText`, documentText);
  }

  updateLineDocumentText(documentText: RFQPartLineDocumentTextModel): Observable<RFQPartLineDocumentTextModel> {
    return this.http.put<RFQPartLineDocumentTextModel>(`${this.baseUrl}api/rfqPartLineDT/UpdateRFQPartLineDocumentText`, documentText);
  }

  getOutPutLines(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/documenttext/documenttext/OutputTypes`);
  }

  getRFQPartLinesDocumentTexts(rfqId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/rfqPartLineDT/GetRFQPartLineDocumentTextByRFQId/${rfqId}`);
  }

  deleteRFQPartLinesDocumentTexts(id: string): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    var arrobj=[];

var obj={"id":id};
arrobj.push(obj);
    return this.http.post<any>(this.url + "DeleteRFQPartLineDocumentTextById", arrobj, httpOptions);

  }

  getRFQPartLinesDocumentTextByRFQPartId(rfqId: string, rfqPartLineID: any): Observable<any> {
    let params = new HttpParams();
    var endpointUrl = environment.apiUrl;
    endpointUrl = endpointUrl + "api/rfqPartLineDT/GetRFQPartLineDocumentTextByRFQPartId";
    params = params.append('rfqId', rfqId);
    params = params.append('rfqPartLineID', rfqPartLineID);
    return this.http.get<any>(endpointUrl, { params });
  }

}
