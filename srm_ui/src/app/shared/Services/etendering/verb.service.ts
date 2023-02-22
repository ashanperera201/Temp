import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({providedIn: 'root'})
export class VerbService<T> {

  url = environment.apiUrl + 'Api/';
  constructor(private http: HttpClient) { 
  console.log('Verbservice initialised');

  }  
  public getData(apiUrl:string): Observable<T[]> {  
    return this.http.get<T[]>(apiUrl);  
  }  
  
  public getArrayData(tabIndex,apiUrl:string,params:HttpParams): Observable<T> {  
    params = params.append('tabIndex', tabIndex);  
    return this.http.get<T>(apiUrl,{params});  
  }  

  public postData(obj: T,apiUrl:string,index?:any): Observable<T> {  
    let params = new HttpParams();      
    params = params.append('tabIndex', index);   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}),params:params };
    
    return this.http.post<T>(apiUrl, obj, httpOptions);  
  }  
  
  }  

    