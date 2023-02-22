import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RfaqService {

    constructor(private http: HttpClient) { }

    url = environment.apiUrl + 'api/RFQshInformation/';
    url1 = environment.apiUrl + 'api/RFQ/';
    url2 = environment.apiUrl + 'api/rfqshtc/';

    getRFQSupplierHeaderInformationById(rfqId: any, supplierId: any) {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "GetRFQSupplierHeaderInformationByID";
        params = params.append('rfqid', rfqId);
        params = params.append('supplierid', supplierId);
       

        return this.http.get<any>(endpointUrl, { params });
    }

    public saveRFQSupplierHeaderInformation(models: any, index?: any): Observable<any[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url + "SaveRFQSupplierHeaderInformation", models, httpOptions);
    }
    public SentQuoteSubmitted(models: any, index?: any): Observable<any[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url + "SentQuoteSubmitted", models, httpOptions);
    }

    getCountry() {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "GetCountry";
        return this.http.get<any>(endpointUrl, { params });
    }

    getIFSIncoTerm() {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "GetIFSIncoTerm";
        return this.http.get<any>(endpointUrl, { params });
    }

    public saveRFQSupplierHeaderCountryOrigin(models: any, index?: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url + "SaveRFQSupplierHeaderCountryOrigin", models, httpOptions);
    }

    deleteRFQSupplierHeaderCountryOrigin(id: any) {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "DeleteRFQSupplierHeaderCountryOrigin";
        params = params.append('id', id);
        return this.http.delete<any>(endpointUrl, { params });
    }

    public UpdateSupplierStatus(models: any, index?: any): Observable<any[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url + "UpdateSupplierStatus", models, httpOptions);
    }
    public deleteSupplierPartLineSubstituteById(id: any) {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "DeleteSupplierPartLineSubstituteById";
        params = params.append('id', id);
        return this.http.delete<any>(endpointUrl, { params });
    }

    public saveRFQSupplierPartLineCountryOrigin(models: any, index?: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url + "SaveRFQSupplierPartLineCountryOrigin", models, httpOptions);
    }

    deleteRFQSupplierPartLineCountryOrigin(id: any) {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "DeleteRFQSupplierPartLineCountryOrigin";
        params = params.append('id', id);
        return this.http.delete<any>(endpointUrl, { params });
    }

    public saveCopyToLineFromHeaderInformation(models: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        console.log("123cfv", models)
        return this.http.post<any[]>(this.url1 + "SaveCopyToLineFromHeaderInformation", models, httpOptions);
    }

    getRFQSupplierHeaderTermsConditionByID(rfqId: any, supplierId:any, isLoad: boolean) {

        let params = new HttpParams();
        var endpointUrl = this.url2;
        endpointUrl = endpointUrl + "GetRFQSupplierHeaderTermsConditionByID";
        params = params.append('rfqId', rfqId);  
        params = params.append('supplierId', supplierId);  
        params = params.append('isLoad', isLoad);
        return this.http.get<any>(endpointUrl, {params});
      }

      public SaveRFQSupplierHeaderTermsCondition(models: any, index?: any): Observable<any[]> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any[]>(this.url2 + "SaveRFQSupplierHeaderTermsCondition", models, httpOptions);
    }
}