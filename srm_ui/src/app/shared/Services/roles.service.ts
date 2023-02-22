import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RolesService {

    public afterSaveUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
    public roleChangeSubject: Subject<any> = new Subject<any>();

    private baseUrl: string = `${environment.srmServer}/`;

    constructor(private httpClient: HttpClient) { }

    fetchRoles = (profileSubId?: string): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}api/roles/details`)
    };

    fetchRoleLogs = (): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}api/users/assign-logs`);
    }

    saveRole = (rolePayload: any): Observable<any> => {
        return this.httpClient.post(`${this.baseUrl}api/roles/create`, rolePayload);
    }

    updateRole = (rolePayload: any): Observable<any> => {
        return this.httpClient.put(`${this.baseUrl}api/roles/update`, rolePayload);
    }

    getRoleByCode = (roleCode: string): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}api/roles/filter-by-code/${roleCode}`);
    }

    deleteRole = (roleId: string): Observable<any> => {
        return this.httpClient.delete(`${this.baseUrl}api/roles/${roleId}`);
    }

    getVisibilityConfigByRole = (roleId: string): Observable<any> => {
        return this.httpClient.get(`${this.baseUrl}api/permission/get-config-by-role/${roleId}`);
    }

    saveUpdateVisibilityConfig = (visibilityPermissionConfig: any): Observable<any> => {
        return this.httpClient.post(`${this.baseUrl}api/permission/save-udpate-visibility-config`, visibilityPermissionConfig);
    }

    updatePermission = (permission: any): Observable<any> => {
        return this.httpClient.put(`${this.baseUrl}api/permission/update`, permission);
    }
}