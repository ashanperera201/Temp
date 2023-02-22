import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginModel } from "app/main/Models/etendering/InputModel";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class UserLoginService {

    private baseUrl: string = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  loginUser(model: LoginModel, userId: string): Observable<LoginModel>{
    return this.http.post<LoginModel>(`${this.baseUrl}api/userlogin/login/${userId}`,model );
  }
}