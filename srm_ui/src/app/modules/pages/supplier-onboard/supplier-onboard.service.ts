import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierOnboardService {

  constructor(private httpClient: HttpClient) { }

  fetchReviewForm = (formId: number): Observable<any> => {
    const url = environment.nodeurl;
    return this.httpClient.get(`${url}/api/supplier/reviewForm?formId=${formId}`);
  }
}
