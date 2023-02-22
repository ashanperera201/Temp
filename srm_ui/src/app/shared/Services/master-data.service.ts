import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MasterDataService {

    private baseUrl: string = environment.nodeurl;

    constructor(private httpClient: HttpClient) { }

    getTemplateMasterData = (): Observable<any> => {
        const url: string = `${this.baseUrl}/api/template/masterdata`;
        return this.httpClient.get(url);
    }
}
