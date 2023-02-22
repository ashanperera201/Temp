import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItemSelect } from '../form-item-select/form-item-select.component';
import { MasterDataService } from '../../../../../../shared/Services/master-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ammo-form-item-country-city',
    templateUrl: './form-item-country-city.component.html',
    styleUrls: ['./form-item-country-city.component.scss']
})
export class FormItemCountryCityComponent implements OnInit, OnDestroy {

    @Input() item: FormItemSelect;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemSelect>();
    matcher = new SurveyErrorStateMatcher();

    destroy$ = new Subject<boolean>();
    countryList: any[] = [];
    cityList: any[] = [];

    country: any;
    city: any;

    constructor(private masterDataService: MasterDataService) { }

    ngOnInit() {
        if (this.item && this.item.value) {
            const countryCityRefs = JSON.parse(this.item.value);
            this.country = countryCityRefs.country;
            this.city = countryCityRefs.city
        }

        this.fetchAllCountries();
    }

    fetchAllCountries = (): void => {
        this.masterDataService.getTemplateMasterData().pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                if (response) {
                    this.countryList = response?.countryList;
                    this.cityList = response?.countryList;
                }
            }
        })
    }

    onCountryChange = (event: any): void => {
        this.country = event;
        if (this.item.value) {
            const existRef = JSON.parse(this.item.value);
            existRef['country'] = event;
            this.item.value = JSON.stringify(existRef);
            this.changes.emit(this.item);
        } else {
            this.item.value = JSON.stringify({ country: event, city: '' });
            this.changes.emit(this.item);
        }
    }

    onCityChange = (event: any): void => {
        this.country = event;
        if (this.item.value) {
            const existRef = JSON.parse(this.item.value);
            existRef['city'] = event;
            this.item.value = JSON.stringify(existRef);
            this.changes.emit(this.item);
        } else {
            this.item.value = JSON.stringify({ country: '', city: event });
            this.changes.emit(this.item);
        }
    }

    isOptionSelected(option) {
        const item = this.item;
        return item.value === option.optionValue;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
