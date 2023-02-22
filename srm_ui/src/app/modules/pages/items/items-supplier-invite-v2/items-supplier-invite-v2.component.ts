import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FuseConfirmationService } from '@fuse/services/confirmation';

import { ProcessConfiguratorService } from 'app/shared/Services/process-configurator.service';
import { FormConfigurationService } from 'app/shared/Services/form-configuration.service';
import { ToastService } from 'app/shared/Services/toast.service';
import { TYPE } from 'app/shared/enums/toast.enum';
import { SupplierService } from 'app/shared/Services/supplier.service';

@Component({
    selector: 'app-items-supplier-invite',
    templateUrl: './items-supplier-invite-v2.component.html',
    styleUrls: ['./items-supplier-invite-v2.component.scss']
})
export class ItemsSupplierInviteV2Component implements OnInit, OnDestroy {

    destroy$ = new Subject<boolean>();
    currentProces!: any;
    configuredForm: any;
    tabConfiguration: any;
    selectedIndex: number = 0;
    isFinalSubmission: boolean = false;
    processResponse: any;
    supplierUniqueKey!: string;

    constructor(
        private processConfiguratorService: ProcessConfiguratorService,
        private formConfigurationService: FormConfigurationService,
        private toastService: ToastService,
        private fuseConfirmationService: FuseConfirmationService,
        private activatedRoute: ActivatedRoute,
        private supplierService: SupplierService) {
        this.supplierUniqueKey = this.activatedRoute.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.fetchProcessConfigByPhaseOne();
    }

    fetchProcessConfigByPhaseOne = (): void => {
        this.processConfiguratorService.getProcessByPhaseOne('supplier-onboard')
            .pipe(switchMap(processResponse => {
                this.processResponse = processResponse;
                if (!this.supplierUniqueKey) {
                    const phaseTwoFormCode: string = JSON.parse(this.processResponse.phaseTwo)?.phaseTwoSelectedForm;
                    return this.formConfigurationService.getConfigurationByFilterKey(phaseTwoFormCode);
                } else {
                    const phaseThreeFormCode: string = JSON.parse(this.processResponse.phaseThree)?.phaseThreeSelectedForm;
                    return this.formConfigurationService.getConfigurationByFilterKey(phaseThreeFormCode);
                }
            }))
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (formResponse) => {
                    if (formResponse) {
                        this.configuredForm = formResponse;
                        const configuration = JSON.parse(this.configuredForm.configuration);
                        this.tabConfiguration = this.formConfigurationService.updateFormData(configuration);
                    }
                }
            });
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
                const payload = JSON.parse(JSON.stringify(this.configuredForm))
                const templateConfig = this.configuredForm.configuration;
                const originalTemplateData: any[] = JSON.parse(templateConfig);
                const index = originalTemplateData.findIndex(x => x.selectedReviewForm.id === id);

                if (index !== -1) {
                    originalTemplateData[index]!.selectedReviewForm!.form = JSON.stringify(event);
                    payload.configuration = JSON.stringify(originalTemplateData);
                    this.formConfigurationService.updateFormConfiguration(payload?.id, payload).pipe(takeUntil(this.destroy$)).subscribe({
                        next: (response: any) => {
                            if (response && this.isFinalSubmission) {
                                this.configuredForm = response;
                                const form = JSON.parse(originalTemplateData[0].selectedReviewForm.form)
                                const elements = form.map(x => x.items.find(y => y.style === 'email'));

                                if (elements && elements.length > 0) {
                                    const payload = {
                                        "supplierName": "",
                                        "SupplierContact": "",
                                        "SupplierFirstName": "",
                                        "SupplierLastName": "",
                                        "SupplierMiddleName": "-",
                                        "SupplierEmail": elements[0].value,
                                        "SupplierCriticality": "",
                                        "AdditionalInformations": "",
                                        "IsActive": true
                                    }
                                    this.supplierService.sendSupplierInvitation(payload).pipe(takeUntil(this.destroy$)).subscribe({
                                        next: (response) => {
                                            this.toastService.showToast(TYPE.SUCCESS, true, 'Successfully sent the email.');
                                        }
                                    });
                                }
                            }
                        },
                        error: () => {
                            this.toastService.showToast(TYPE.ERROR, true, 'Failed to publish the form.');
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

    onTabChange = (event: any): void => {
        if (event) {
            this.selectedIndex = event.index;
        }
    }

    proceed = (survey: any, isFinalSubmission: boolean): void => {
        if (survey && isFinalSubmission) {
            survey.submitForm();
            this.isFinalSubmission = isFinalSubmission;
        }
        this.selectedIndex++;
    }


    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
