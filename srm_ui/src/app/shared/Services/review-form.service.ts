import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReviewFormService {

    private baseUrl: string = environment.srmServer;

    public logoUploadChange: EventEmitter<string | ArrayBuffer> = new EventEmitter<string | ArrayBuffer>();
    public bannerUploadChange: EventEmitter<string | ArrayBuffer> = new EventEmitter<string | ArrayBuffer>();

    constructor(private httpClient: HttpClient) { }

    fetchExistsReviewForm = (formName: string): Observable<any> => {
        const url: string = `${this.baseUrl}/api/review-form/filter-by-name?formName=${formName}`
        return this.httpClient.get(url);
    }

    saveReviewForm = (reviewForm: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/supplier/SaveReviewForm`;
        return this.httpClient.post(url, reviewForm)
    }

    updateReviewForm = (reviewForm: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/review-form/update`;
        return this.httpClient.put(url, reviewForm)
    }

    fetchAllReviewForms = (): Observable<any> => { 
        const url: string = `${this.baseUrl}/api/review-form`
        return this.httpClient.get(url);
    }
}