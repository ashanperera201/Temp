/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
    MatTableDataSource
} from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemOptionStateMatcher, SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItem, FormItemOptionItem, FormItemWidget, FormItemValidation, FormItemValidationRules } from '../form-item';
import { CommonService } from '../../../../../../shared/Services/common.service';

export class FormItemOptionsEditor extends FormItem {
    value: FormItemOptionItem[];
    hasOptions: boolean = true;
    useCustomOptionValues: boolean = false;
    allowCustomOptionValues: boolean = true;
    allowCustomAnswers: boolean = true;
    multiple: boolean = false;
    defaultValue: string | string[];
    existOptions: any;
    fieldValidations: FormItemValidation = {
        rules: <FormItemValidationRules[]>[
            {
                "optionKeyValues": true
            }
        ]
    };
}

@Component({
    selector: 'ammo-form-item-options-editor',
    templateUrl: './form-item-options-editor.component.html',
    styleUrls: ['./form-item-options-editor.component.scss']
})
export class FormItemOptionsEditorComponent implements FormItemWidget, OnInit {

    @Input() item: FormItemOptionsEditor;
    @Input() existOptions: any;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemOptionsEditor>();
    matcher = new SurveyErrorStateMatcher();
    dataSource = new MatTableDataSource<FormItemOptionItem>([]);
    public columns: string[];
    public dialogOption: any;

    //public useCustomValues: boolean = false;
    public allowCustomValues: boolean = false;
    public allowCustomAnswers: boolean = true;

    constructor(private commonService: CommonService) { }

    ngOnInit() {
        const optionsValues = this.commonService.getDialogOption();
        if (optionsValues && optionsValues.length > 0) {
            this.dialogOption = [...new Map(optionsValues.map((m) => [m.label, m])).values()];
        }

        if (!this.item.value) {
            this.item.value = [];
        }
        this.dataSource.data = this.item.value;
        //this.useCustomValues = this.item.useCustomOptionValues;
        this.allowCustomValues = false;
        this.allowCustomAnswers = this.item.allowCustomAnswers;
        this.setColumns();
        this.item.value.forEach(option => {
            option.selected = this.isOptionSelected(option);
        });
        console.log(this.item);
        this.matcher.item = this.item;
    }

    setColumns(): void {
        this.columns = ['selectedByDefault', 'label', 'actions'];
    }

    /* onUseCustomValuesChange(ev) {
        this.useCustomValues = ev.checked;
        this.item.useCustomOptionValues = this.useCustomValues;
        this.setColumns();
    } */

    onValueChange(value): void {
        this.item.value = value;
        //console.log(this.item);
        // if (this.useCustomValues) {
        (this.item.value || []).forEach((field) => {
            field.optionValue = field.label;
        });
        // }
        this.changes.emit(this.item);
    }

    isOptionSelected(option) {
        //console.log(option);
        const item = this.item;
        return item.multiple ? (item.defaultValue || []).indexOf(option.optionValue) >= 0 : item.defaultValue === option.optionValue;
    }

    setDefaultValue(option, checked): void {
        const item = this.item;
        if (item.multiple) {
            let value = [...item.defaultValue];
            const selectedIndex = value.indexOf(option.optionValue);
            if (selectedIndex >= 0) {
                checked ? value.push(option.optionValue) : value = value.filter((str, index) => index !== selectedIndex);
            }
            else if (checked) {
                value.push(option.optionValue);
            }
            item.defaultValue = value;
        }
        else {
            item.defaultValue = checked ? option.optionValue : '';
        }
        (this.item.value || []).forEach(option => {
            option.selected = this.isOptionSelected(option);
        });
        this.changes.emit(this.item);
    }

    onOptionLabelChange(value, option) {
        // if (!this.useCustomValues) {
        option.optionValue = value;
        // }
    }

    addOption() {
        const obj = <FormItemOptionItem>{
            label: '',
            optionValue: '',
            explanationLabel: '',
            selected: false,
            showExplanation: false
        };
        if (!this.item.value) {
            this.item.value = [];
        }

        this.item.value.push(obj);
        this.dataSource.data = this.item.value;
    }

    addPreviousOptions = (event: any) => {
        const filteredArr = this.dialogOption.filter(x => event.value.includes(x.optionValue));

        this.item.value = [];
        this.item.value = [...filteredArr];
        this.dataSource.data = this.item.value;
    }

    removeOption(option) {
        this.item.value = this.item.value.filter((op, index) => index !== this.item.value.indexOf(option));
        this.dataSource.data = this.item.value;
    }

    onListDropped(event: CdkDragDrop<FormItemOptionItem[]>) {
        const previousIndex = this.dataSource.data.findIndex(row => row === event.item.data);
        moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
        this.dataSource.data = this.dataSource.data.slice();
        //console.log('dropped', JSON.stringify(this.dataSource.data), JSON.stringify(this.item.value));
    }

    toggleExplanationField(option) {
        option.showExplanation = !option.showExplanation;
    }
}
