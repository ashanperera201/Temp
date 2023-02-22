import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import config from '../../../auth_management_api_config.json';

@Injectable({
  providedIn: 'root'
})
export class IdentitylinkService {

  auth0BaseUrl : string = "https://dev-ay82ezuy.us.auth0.com";
  apiToken : string = localStorage.getItem("auth0token");
  
  constructor(private http: HttpClient) {

   }

   protected getRequestHeaders(): { headers: HttpHeaders } {

    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization' : this.apiToken
    });

    return { headers: headers };
  }

  getRoles(id: string): Observable<[]>{
    let endpointUrl = `${this.auth0BaseUrl}/api/v2/users/${id}/roles`;
    let options = this.getRequestHeaders();

    return this.http.get<[]>(endpointUrl,options);
  }

  getRolesCount(id : string) : Promise<Number>
  {
    return new Promise((resolve) => {
      this.getRoles(id)
        .subscribe(data => {
          resolve(data.length);
        })
    });
  }

  getUsersByEmail(emailAddress : string): Observable<[]>{
    let endpointUrl = `${this.auth0BaseUrl}/api/v2/users?q=email%3A%22${emailAddress}%22&search_engine=v3`;
    let options = this.getRequestHeaders();

    return this.http.get<[]>(endpointUrl,options);
  }

  linkUsers(primaryUserid:string, secondoryUserid: string): Observable<[]>{
    let endpointUrl = `${this.auth0BaseUrl}/api/v2/users/${primaryUserid}/identities`;
    let options = this.getRequestHeaders();

    var requestBody:any = {
      provider: 'waad',
      user_id: secondoryUserid
   }

    return this.http.post<[]>(endpointUrl,JSON.stringify(requestBody),options);
  }

}
