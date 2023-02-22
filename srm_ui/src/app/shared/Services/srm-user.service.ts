import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SrmUserService {

    public afterSaveUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

    private baseUrl: string = environment.srmServer;

    constructor(private httpClient: HttpClient) { }

    fetchAbpUsers = (): Observable<any> => { 
        return this.httpClient.get(`${this.baseUrl}/api/users/workflow-module`);
    }

    fetchUsers = (): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}/api/users/fetch-all`);
    };

    fetchUserLogs = (): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}/api/users/fetch-user-logs`);
    }

    assignUserRole = (payload: any): Observable<any> => {
        return this.httpClient.post(`${this.baseUrl}/api/users/assign-role`, payload);
    }

    saveUser = (payload: any): Observable<any> => {
        return this.httpClient.post(`${this.baseUrl}/api/users/create`, payload);
    }

    updateUser = (payload: any): Observable<any> => {
        return this.httpClient.put(`${this.baseUrl}/api/users/update`, payload);
    }

    deleteUser = (userId: string): Observable<any> => {
        return this.httpClient.delete(`${this.baseUrl}/api/users/delete/${userId}`);
    }

    getUser = (userId: string): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}/api/users/${userId}`);
    }
}