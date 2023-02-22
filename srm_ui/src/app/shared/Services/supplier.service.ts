import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private baseUrl: string = environment.nodeurl;

    constructor(private httpClient: HttpClient) { }

    sendSupplierInvitation = (payload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/v2/supplier/invitation`;
        return this.httpClient.post(url, payload);
    }
}
