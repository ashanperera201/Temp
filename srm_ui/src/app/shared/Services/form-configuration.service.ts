import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { NgxSurveyService } from 'app/modules/pages/form-builder/ngx-survey/ngx-survey.service';

@Injectable({
    providedIn: 'root'
})
export class FormConfigurationService {

    private baseUrl: string = environment.nodeurl;
    private tabConfiguration: any;

    constructor(private httpClient: HttpClient, private ngxSurveyService: NgxSurveyService) { }

    saveFormConfiguration = (payload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/form-confugration`;
        return this.httpClient.post(url, payload);
    }

    getAllConfigurationForms = (): Observable<any> => {
        const url: string = `${this.baseUrl}/api/form-confugration`;
        return this.httpClient.get(url);
    }

    getConfigurationByFilterKey = (filterKey: string): Observable<any> => {
        const url: string = `${this.baseUrl}/api/form-confugration/filter-by/${filterKey}`;
        return this.httpClient.get(url);
    }

    updateFormConfiguration = (formConfigId: number, payload: any): Observable<any> => {
        const url: string = `${this.baseUrl}/api/form-confugration/${formConfigId}`;
        return this.httpClient.put(url, payload);
    }

    updateFormData = (configuration: any[]): void => {
        configuration.forEach(e => {
            e.selectedReviewForm['form'] = JSON.parse(e?.selectedReviewForm?.form);
            e.selectedReviewForm['headerData'] = this.configureFormData(e.selectedReviewForm);
        });

        this.tabConfiguration = configuration;
        return this.tabConfiguration;
    }

    configureFormData = (data: any): any => {
        let formData: any = {};
        let logoFileName: string;
        let bannerFileName: string;

        formData.formTitle = data.title;
        formData.formSubTitle = data.title;

        formData.formTitle = data.title;
        formData.formSubTitle = data.subtitle;
        formData.logoUrl = this.ngxSurveyService.defaultLogo;
        formData.bannerUrl = this.ngxSurveyService.defaultBanner;
        logoFileName = data?.logo;
        bannerFileName = data?.banner;
        formData.logoUrl = logoFileName
            ? this.ngxSurveyService.fileDownloadUrl + '?fileName=' + data.id + '_logo_' + logoFileName
            : this.ngxSurveyService.defaultLogo;
        formData.bannerUrl = bannerFileName
            ? this.ngxSurveyService.fileDownloadUrl + '?fileName=' + data.id + '_banner_' + bannerFileName
            : this.ngxSurveyService.defaultBanner;

        let reviewerDetails = [
            { title: 'Reviewer Name', value: data.conductedUser },
            { title: 'Supplier Name', value: data.supplierName },
            { title: 'Review Period', value: data.presetPeriod },
            { title: 'Review Year', value: data.reviewYear },
            { title: 'Requested By', value: data.createdUser },
            { title: 'Assigned Date', value: data.createdDate },
        ];
        formData.ReviewerDetails = reviewerDetails;
        return formData;
    }

}
