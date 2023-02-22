import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SupplierModel } from "app/main/Models/etendering/suppliermodel";
import { environment } from 'environments/environment';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SupplierService {

    private baseUrl: string = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  }