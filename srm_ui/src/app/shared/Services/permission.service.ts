import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    baseUrl: string = `${environment.srmServer}/`;

    constructor(private httpClient: HttpClient) { }

    getAllPermission = (permissionAssignedUserId: string): Observable<any> => {
        const url: string = `${this.baseUrl}api/permission/get-all/${permissionAssignedUserId}`;
        return this.httpClient.get(url);
    }

    savePermission = (permissionPayload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/permission/save`;
        return this.httpClient.post(url, permissionPayload);
    }

    updatePermission = (permissionPayload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/permission/update`;
        return this.httpClient.put(url, permissionPayload);
    }

    deletePermission = (permissionId: string): Observable<any> => {
        const url: string = `${this.baseUrl}/api/permission/delete/${permissionId}`;
        return this.httpClient.delete(url)
    }
}