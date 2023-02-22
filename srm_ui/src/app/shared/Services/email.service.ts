import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    private baseUrl: string = environment.nodeurl;

    constructor(private httpClient: HttpClient) { }

    sendEmail = (payload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/v2/email`;
        return this.httpClient.post(url, payload);
    }
}
