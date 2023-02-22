import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterModel } from "app/main/Models/etendering/registermodel";
import { Tenant } from "app/main/Models/etendering/tenant";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class TenantService {

    private baseUrl: string = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getTenant(id: number): Observable<Tenant>{
    return this.http.get<Tenant>(`${this.baseUrl}api/tenant/get/${id}`);
  }

  saveTenant(tenant: RegisterModel): Observable<Tenant>{
    return this.http.post<Tenant>(`${this.baseUrl}api/tenant/save`,tenant );
  }

  updateTenant(tenant: Tenant): Observable<Tenant>{
    return this.http.put<Tenant>(`${this.baseUrl}api/tenant/update`,tenant );
  }
}