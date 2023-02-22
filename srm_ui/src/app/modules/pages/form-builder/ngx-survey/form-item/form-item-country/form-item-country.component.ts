import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs'
import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItemSelect } from '../form-item-select/form-item-select.component';
import { MasterDataService } from '../../../../../../shared/Services/master-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ammo-form-item-country',
    templateUrl: './form-item-country.component.html',
    styleUrls: ['./form-item-country.component.scss']
})
export class FormItemCountryComponent implements OnInit, OnDestroy {
    @Input() item: FormItemSelect;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemSelect>();
    matcher = new SurveyErrorStateMatcher();

    destroy$ = new Subject<boolean>();
    countryList: any[] = [];

    constructor(private masterDataService: MasterDataService) { }

    ngOnInit() {
        this.fetchAllCountries();
    }

    fetchAllCountries = (): void => {
        this.masterDataService.getTemplateMasterData().pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                if (response) {
                    this.countryList = response?.countryList;
                }
            }
        })
    }

    onSelectionChange(value) {
        this.item.value = value;
        this.changes.emit(this.item);
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
