import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterModel } from "app/main/Models/etendering/registermodel";
import { UserProfile } from "app/main/Models/etendering/userprofile";
import { ActivateViewModel } from "app/main/Models/etendering/ViewModels/ActivateViewModel";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class UserSignService {
    private baseUrl: string = environment.apiUrl;
  
    constructor(private http: HttpClient) { }
  
    saveUser(entity: RegisterModel): Observable<UserProfile>{
      return this.http.post<UserProfile>(`${this.baseUrl}api/user`, entity);
    }
  
    activateUser(model: ActivateViewModel): Observable<UserProfile>{
      return this.http.post<UserProfile>(`${this.baseUrl}api/user/activateUser`,model );
    }

    getUserToActivate(userId: string): Observable<UserProfile> {
      return this.http.get<UserProfile>(`${this.baseUrl}api/user/getusertoactivate/${userId}`);
   }

   generateCode(email: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}api/user/codegeneration/${email}`);
   }

   resetPassword(model: ActivateViewModel): Observable<UserProfile>{
    return this.http.post<UserProfile>(`${this.baseUrl}api/user/passwordreset`,model );
   }
  }