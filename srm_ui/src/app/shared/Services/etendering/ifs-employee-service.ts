import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IFSEmployeeSearchModel } from 'app/main/Models/etendering/ifs-employee-search-model';

@Injectable({
    providedIn: 'root'  
  })

  export class IFSEmployeeService {

    constructor(private http: HttpClient) { }  
    url = environment.apiUrl + 'api/ifsmp/';
  
  
    getIFSEmployeeSearch(searchModel : IFSEmployeeSearchModel){  
      let params = new HttpParams();        
      params = params.append('tabIndex', 2);    
      var endpointUrl = this.url;  
      endpointUrl = endpointUrl + "/GetIFSEmployeeSearch";  
      const httpOptions = { headers: new HttpHeaders(),params:params };  
      return this.http.post<IFSEmployeeSearchModel>(endpointUrl, searchModel,httpOptions);  
    }   

    GetCollTeamAcessByTeamId(id: any) {
      let params = new HttpParams();
      var endpointUrl = this.url;
      endpointUrl = endpointUrl + "GetCollTeamAcessByTeamId";
      params = params.append('CBTeamId', id);
      return this.http.get<any>(endpointUrl, { params });
    }
}

