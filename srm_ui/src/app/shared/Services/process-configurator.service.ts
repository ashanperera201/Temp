import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { environment } from 'environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ProcessConfiguratorService {

    private baseUrl: string = environment.nodeurl;
    public afterSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private httpClient: HttpClient) { }

    saveProcessConfigurator = (payload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/process-configurator`;
        return this.httpClient.post(url, payload);
    }

    getProcessConfiguratorDetails = (paginationModel: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/process-configurator?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`;
        return this.httpClient.get(url);
    }

    getProcessConfigurator = (id: string): Observable<any> => {
        const url: string = `${this.baseUrl}/ /${id}`;
        return this.httpClient.get(url);
    }

    updateProcessConfigurator = (payload: any, id: string): Observable<any> => {
        const url: string = `${this.baseUrl}/api/process-configurator/${id}`;
        return this.httpClient.put(url, payload);
    }

    getProcessByPhaseOne = (phaseOne: string): Observable<any> => {
        const url: string = `${this.baseUrl}/api/process-configurator/filter-by-phase/${phaseOne}`;
        return this.httpClient.get(url);
    }
}
