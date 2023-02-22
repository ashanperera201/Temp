import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProcessConfiguratorService } from 'app/shared/Services/process-configurator.service';
import { ToastService } from 'app/shared/Services/toast.service';
import { TYPE } from '../../supplier-registration-form/supplier-registration-form.component';
import { FormConfigurationService } from 'app/shared/Services/form-configuration.service';

@Component({
    selector: 'app-process-configurator-create',
    templateUrl: './process-configurator-create.component.html',
    styleUrls: ['./process-configurator-create.component.scss']
})

export class ProcessConfiguratorCreateComponent implements OnInit, OnDestroy {

    title: string = 'Create New Process';
    destroy$ = new Subject<boolean>();
    processConfiguratorForm: FormGroup;
    existingRecord: any;

    formConfigs: any;
    supplierInitiationList: any[];
    initialRequests: any[];
    supplierQuestionnairs: any[];


    constructor(
        public matDialogRef: MatDialogRef<ProcessConfiguratorCreateComponent>,
        private formBuilder: FormBuilder,
        private processConfiguratorService: ProcessConfiguratorService,
        private toastService: ToastService,
        private formConfigurationService: FormConfigurationService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.matDialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.initiateProcessForm();
        this.fetchAllConfigurations();
    }

    fetchAllConfigurations = (): void => {
        this.formConfigurationService.getAllConfigurationForms().pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                if (response && response.length > 0) {
                    this.formConfigs = response;
                    this.patchForm();
                }
            }
        });
    };

    initiateProcessForm = (): void => {
        this.processConfiguratorForm = this.formBuilder.group({
            processName: new FormControl('', Validators.required),
            processDescription: new FormControl(''),
            phaseOne: new FormControl('', Validators.required),
            phaseTwo: new FormControl('', Validators.required),
            phaseTwoSelectedForm: new FormControl('', Validators.required),
            phaseThree: new FormControl(''),
            phaseThreeSelectedForm: new FormControl(''),
        });

        this.onFormControlChanges();
    };

    onFormControlChanges = (): void => {
        this.processConfiguratorForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
            next: (formElements) => {
                if (formElements?.phaseTwo) {
                    this.initialRequests = this.formConfigs.filter(x => x.processStep === formElements?.phaseTwo);
                }

                if (formElements?.phaseThree) {
                    this.supplierQuestionnairs = this.formConfigs.filter(x => x.processStep === formElements?.phaseThree);
                }
            }
        });
    }

    patchForm = (): void => {
        if (this.data) {
            const { data } = this.data;
            if (data) {
                this.title = `Update Process ${data.processName}`
                this.existingRecord = data;

                const phaseTwoRef = JSON.parse(this.existingRecord.phaseTwo) ?? '';
                const phaseThreeRef = JSON.parse(this.existingRecord.phaseThree) ?? '';

                const formVals = {
                    'processName': this.existingRecord?.processName ?? '',
                    'processDescription': this.existingRecord?.processDescription ?? '',
                    'phaseOne': this.existingRecord?.phaseOne ?? '',
                    'phaseTwo': phaseTwoRef?.phaseTwo ?? '',
                    'phaseTwoSelectedForm': phaseTwoRef?.phaseTwoSelectedForm ?? '',
                    'phaseThree': phaseThreeRef?.phaseThree ?? '',
                    'phaseThreeSelectedForm': phaseThreeRef?.phaseThreeSelectedForm ?? '',
                };
                this.processConfiguratorForm.patchValue(formVals);
            }
        }
    };

    isNumeric = (evt: any): boolean => {
        evt = (evt) ? evt : window.event;
        const charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    closeDialog = (): void => {
        this.matDialogRef.close();
    };

    onSaveConfig = (): void => {

        Object.keys(this.processConfiguratorForm.controls).forEach(e => {
            const control = this.processConfiguratorForm.get(e);
            control?.markAllAsTouched();
            control?.updateValueAndValidity({ onlySelf: true });
        })

        if (this.processConfiguratorForm.valid) {
            const payload = {
                'processName': this.processConfiguratorForm.get('processName')?.value ?? '',
                'processDescription': this.processConfiguratorForm.get('processDescription')?.value ?? '',
                'phaseOne': this.processConfiguratorForm.get('phaseOne')?.value ?? '',
                'phaseTwo': JSON.stringify({
                    phaseTwo: this.processConfiguratorForm.get('phaseTwo')?.value ??
                        '', phaseTwoSelectedForm: this.processConfiguratorForm.get('phaseTwoSelectedForm')?.value ?? ''
                }),
                'phaseThree': JSON.stringify({
                    phaseThree: this.processConfiguratorForm.get('phaseThree')?.value ??
                        '', phaseThreeSelectedForm: this.processConfiguratorForm.get('phaseThreeSelectedForm')?.value ?? ''
                }),
                'isActive': true,
                'createdBy': 'Admin',
                'createdOn': new Date()
            };

            if (this.existingRecord) {
                this.processConfiguratorService.updateProcessConfigurator(payload, this.existingRecord.id).subscribe((serviceRes) => {
                    if (serviceRes) {
                        this.processConfiguratorService.afterSave.emit();
                        this.closeDialog();
                        this.toastService.showToast(TYPE.SUCCESS, true, 'Updated successfully.');
                    }
                });
            } else {
                this.processConfiguratorService.saveProcessConfigurator(payload).subscribe((serviceRes) => {
                    if (serviceRes) {
                        this.processConfiguratorService.afterSave.emit();
                        this.closeDialog();
                        this.toastService.showToast(TYPE.SUCCESS, true, 'Saved successfully.');
                    }
                });
            }
        }
    };

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.processConfiguratorForm.reset({});
    }

}
