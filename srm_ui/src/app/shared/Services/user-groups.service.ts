import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserGroupService {

    public afterSaveUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
    private baseUrl: string = environment.srmServer;

    constructor(private httpClient: HttpClient) {
    }

    fetchUserGroups = (): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}/api/user-group/details`);
    }

    saveUserGroup = (userGroupPayload: any): Observable<any> => {
        return this.httpClient.post(`${this.baseUrl}/api/user-group/save`, userGroupPayload);
    }

    updateUserGroup = (userGroupPayload: any): Observable<any> => {
        return this.httpClient.put(`${this.baseUrl}/api/user-group/update`, userGroupPayload);
    }

    fetchUserGroupById = (id: any): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}/api/user-group/${id}`);
    }

    cloneUserGroup = (userGroupName: string) => {
        return this.httpClient.post(`${this.baseUrl}/api/user-group/clone/${userGroupName}`, {});
    }

    saveUserGroupInfo = (payload: any) => {
        return this.httpClient.post(`${this.baseUrl}/api/user-group/save-detail-info`, payload);
    }

    getUserGroupInfo = () => { 
        return this.httpClient.get(`${this.baseUrl}/api/user-group/details-info`);
    }
}