import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

import { NgxSurveyService } from '../form-builder/ngx-survey/ngx-survey.service';
import { FormConfigurationService } from 'app/shared/Services/form-configuration.service';
import { NgxSurveyComponent } from '../form-builder/ngx-survey/ngx-survey.component';
import { ToastService } from 'app/shared/Services/toast.service';
import { TYPE } from '../supplier-registration-form/supplier-registration-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-supplier-onboard',
  templateUrl: './supplier-onboard.component.html',
  styleUrls: ['./supplier-onboard.component.scss']
})

export class SupplierOnboardComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<boolean>();
  tabConfiguration: any;
  serviceResponse: any;

  @ViewChild('survey', { static: false }) public survey: NgxSurveyComponent;

  constructor(
    private formConfigurationService: FormConfigurationService,
    public ngxSurveyService: NgxSurveyService,
    private toastService: ToastService,
    private fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit(): void {
    this.fetchFormConfigurations();
  }

  fetchFormConfigurations = (): void => {
    this.formConfigurationService.getConfigurationByFilterKey('supplier-onboard').pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response && response.configuration) {
          this.serviceResponse = response;
          const configuration = JSON.parse(response.configuration);
          this.tabConfiguration = this.formConfigurationService.updateFormData(configuration)
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }



  submitForm = (event: any[], id: number): void => {
    if (event) {
      const isError = event.some(x => x.invalid);

      if (isError) {
        const data: [] = [];
        data['title'] = 'Error';
        data['message'] = 'Please check the onboarding form again!';
        data['dismissible'] = true;
        data['color'] = 'warn';
        data['icon'] = 'heroicons_outline:exclamation';
        this.showPopup(data);
      } else {
        const payload = JSON.parse(JSON.stringify(this.serviceResponse))
        const templateConfig = this.serviceResponse.configuration;
        const originalTemplateData: any[] = JSON.parse(templateConfig);
        const index = originalTemplateData.findIndex(x => x.selectedReviewForm.id === id);

        if (index !== -1) {
          originalTemplateData[index]!.selectedReviewForm!.form = JSON.stringify(event);
          payload.configuration = JSON.stringify(originalTemplateData);
          this.formConfigurationService.updateFormConfiguration(payload?.id, payload).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response: any) => {
              if (response) {
                this.toastService.showToast(TYPE.SUCCESS, true, 'Successfully published.');
              } else {
                this.toastService.showToast(TYPE.ERROR, true, 'Failed to publish the form.');
              }
            }
          })
        } else {
          this.toastService.showToast(TYPE.ERROR, true, 'Failed to publish the form.');
        }

      }
    }
  }

  showPopup = (data): void => {
    this.fuseConfirmationService.open({
      title: data.title,
      message: data.message,
      icon: { show: true, name: data.icon, color: data.color, },
      actions: {
        confirm: { show: true, label: 'Ok', color: data.color, },
        cancel: { show: false, label: 'No', },
      },
      dismissible: data.dismissible,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
