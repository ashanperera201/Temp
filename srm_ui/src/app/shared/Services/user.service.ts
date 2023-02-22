import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient) {
    }

    fetchUsers = () => {
        const url = `${environment.auth02}api/v2/users`
        return this.httpClient.get(url);
    }
}