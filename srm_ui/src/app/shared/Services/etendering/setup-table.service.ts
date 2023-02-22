import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class SetupTableService {
  
    constructor(private http: HttpClient) { }
    url = environment.apiUrl + 'api/Setup/';
  
    
  
    LoadAllTables() {
      let params = new HttpParams();
      var endpointUrl = this.url;
      endpointUrl = endpointUrl + "LoadAllTables";
      
      return this.http.get<any>(endpointUrl);
    }
    LoadTableValue(tablename) {
        let params = new HttpParams();
        var endpointUrl = this.url;
        endpointUrl = endpointUrl + "LoadTableValue";
        params = params.append('tablename', tablename);
        return this.http.get<any>(endpointUrl, { params });
      }
      public SaveTableValue(models: any, index?: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
        return this.http.post<any>(this.url + "SaveTableValue", models, httpOptions);
      }
  }
  