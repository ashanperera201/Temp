import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { SupplierHistory } from 'app/shared/Models/SupplierHistory';
import { EmergencyApprovedItems } from 'app/shared/Models/EmergencyApprovedItems';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // ping$(): Observable<any> {
  //   console.log(config.apiUri);
  //   return this.http.get(`${config.apiUri}/api/external`);
  // }

  saveHistory(historydata:SupplierHistory) {
    this.http.post<any>(environment.nodeurl+'/api/supplier/saveSupplierHistory', historydata).subscribe(data2 => {
      return true;
    });
  }

  IsSupplierExists(value:string) {
    this.http.get(environment.nodeurl + '/api/supplier/isRegistered?searchValue=' + value)
    .subscribe(data => {
      return data;
    });
  }

  IsUrlValid(value:string) {
    this.http.get(environment.nodeurl + '/api/template/IsValidUri?uri=' + value)
    .subscribe(data => {
      return data;
    });
  }

  saveEmergHistory(historydata:EmergencyApprovedItems) {
    this.http.post<any>(environment.nodeurl+'/api/supplier/emergencyapproved', historydata).subscribe(data2 => {
      return true;
    });
  }
}
