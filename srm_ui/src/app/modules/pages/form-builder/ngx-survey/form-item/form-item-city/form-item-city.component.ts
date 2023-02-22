import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs'
import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItemSelect } from '../form-item-select/form-item-select.component';
import { MasterDataService } from '../../../../../../shared/Services/master-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-form-item-city',
    templateUrl: './form-item-city.component.html',
    styleUrls: ['./form-item-city.component.scss']
})
export class FormItemCityComponent implements OnInit, OnDestroy {

    @Input() item: FormItemSelect;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemSelect>();
    matcher = new SurveyErrorStateMatcher();

    destroy$ = new Subject<boolean>();
    cityList: any[] = [];

    constructor(private masterDataService: MasterDataService) { }

    ngOnInit() {
        this.fetchAllCities();
    }

    fetchAllCities = (): void => {
        this.masterDataService.getTemplateMasterData().pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                if (response) {
                    debugger
                    this.cityList = response?.cityList;
                }
            }
        });
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
