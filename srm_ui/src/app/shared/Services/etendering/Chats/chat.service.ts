import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable,throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';  


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl: string = environment.apiUrl;
  
  url = environment.apiUrl + 'api/RFQ/';
  
  constructor(private http: HttpClient) { }

  getRFQCount(id: any): Observable<any>{
    

    let params = new HttpParams(); 
    var endpointUrl =environment.apiUrl + 'api/notification/GetCountOfETenderingMessageByRFQId'
    
    params = params.append('RFQId', id ); 
    params = params.append('userType', 0 );   
    return this.http.get<any>(endpointUrl, { params});

  }

  
  getRFQMessages(id: any,supplierid): Observable<any>{
    

    let params = new HttpParams(); 
    var endpointUrl =environment.apiUrl + 'api/notification/GetETenderingMessageByRFQId'
    
    params = params.append('RFQId', id );  
    params = params.append('supplierid', supplierid );  
    params = params.append('userType', 0 );  
    return this.http.get<any>(endpointUrl, { params});

  }

  
  public sendMessage(model: any, index?: any): Observable<any> {
    var endpointUrl =environment.apiUrl + 'api/notification/SaveETenderingMessage'
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(endpointUrl, model, httpOptions);
  } 
  public readMessage(model: any, index?: any): Observable<any> {
    var endpointUrl =environment.apiUrl + 'api/notification/ReadETenderingMessage'
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: null };
    return this.http.post<any>(endpointUrl, model, httpOptions);
  } 

  
  private handleError(err) {  
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);  
    return throwError(errorMessage);  
  }  


  
  public deleteMessage(id: any, index?: any): Observable<any> {
    var endpointUrl =environment.apiUrl + 'api/notification/DeleteETenderingMessage'
        let params = new HttpParams();    
    
    params = params.append('id', id );  
    
    return this.http.delete<any>(endpointUrl, { params});
  } 
  
 
}
