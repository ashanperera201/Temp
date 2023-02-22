import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TYPE } from 'app/shared/enums/toast.enum';
import { IDropdown } from 'app/shared/interfaces/drop-down.interface';
import { FormConfigurationService } from 'app/shared/Services/form-configuration.service';
import { ToastService } from 'app/shared/Services/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DynamicTabsComponent } from './dynamic-tabs/dynamic-tabs.component';

@Component({
    selector: 'app-review-form-configuration',
    templateUrl: './review-form-configuration.component.html',
    styleUrls: ['./review-form-configuration.component.scss']
})
export class ReviewFormConfigurationComponent implements OnInit, OnDestroy {

    @ViewChild('dynamicTabs') dynamicTabs: DynamicTabsComponent;

    reviewForm!: FormGroup;
    destroy$ = new Subject<boolean>();

    processSteps!: IDropdown[];

    constructor(
        private formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<ReviewFormConfigurationComponent>,
        private formConfigurationService: FormConfigurationService,
        private toastService: ToastService,) { }

    ngOnInit(): void {
        this.matDialogRef.disableClose = true;
        this.initializeMasterData();
        this.initializeForm();
    }

    initializeMasterData = (): void => {
        this.processSteps = [
            {
                id: '1',
                value: 'initial-request',
                label: 'Intial Request',
            },
            {
                id: '2',
                value: 'supplier-questionnaire',
                label: 'Supplier Questionnaire',
            }
        ];
    }

    initializeForm = (): void => {
        this.reviewForm = this.formBuilder.group({
            configurationCode: new FormControl(''),
            configurationName: new FormControl('', Validators.required),
            module: new FormControl(''),
            elementItem: new FormControl('', Validators.required),
            elementCount: new FormControl('', Validators.required),
            processStep: new FormControl(''),
        });
    }

    isNumeric = (evt: any): boolean => {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    closeModal = (): void => {
        this.matDialogRef.close();
    }

    onSaveConfig = (): void => {
        if (this.reviewForm.valid) {
            const reviewForms = this.dynamicTabs.reviewFormView;
            const formVals = this.reviewForm.value;

            if (reviewForms.filter(x => x.selectedReviewForm.form).length === +formVals.elementCount) {
                const payload = {
                    "configurationCode": formVals?.configurationCode ?? '',
                    "configurationName": formVals?.configurationName ?? '',
                    "module": formVals?.module ?? '',
                    "elementItem": formVals?.elementItem ?? '',
                    "elementCount": +formVals?.elementCount ?? '',
                    "processStep": formVals?.processStep ?? '',
                    "configuration": JSON.stringify(reviewForms),
                }
                this.formConfigurationService.saveFormConfiguration(payload).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (response) => {
                        if (response) {
                            this.closeModal();
                            this.toastService.showToast(TYPE.SUCCESS, true, 'Saved successfully.');
                        }
                    }
                })
            } else {
                this.toastService.showToast(TYPE.ERROR, true, 'Failed to save please check the form again.');
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
