import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItemSelect } from '../form-item-select/form-item-select.component';

@Component({
    selector: 'ammo-form-item-supplier-contact',
    templateUrl: './form-item-supplier-contact.component.html',
    styleUrls: ['./form-item-supplier-contact.component.scss']
})
export class FormItemSupplierContactComponent implements OnInit, OnDestroy {

    @Input() item: FormItemSelect;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemSelect>();

    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;

    matcher = new SurveyErrorStateMatcher();

    destroy$ = new Subject<boolean>();

    phone: FormControl;

    constructor() { }

    ngOnInit(): void {
        this.controlInit();
        this.patchExistingData();
        this.listenPhoneControlChange();
    }

    controlInit = (): void => {
        this.phone = new FormControl(null);
    }

    listenPhoneControlChange = (): void => {
        this.phone.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(response => {
                if (response) {
                    console.log(this.phone);

                    this.item.value = JSON.stringify(response);
                    this.changes.emit(this.item);
                }
            });
    }

    patchExistingData = (): void => {
        if (this.item && this.item.value) {
            this.phone.patchValue(JSON.parse(this.item.value));
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
