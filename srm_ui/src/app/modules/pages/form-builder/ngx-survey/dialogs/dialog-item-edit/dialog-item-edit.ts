/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable max-len */
import { Component, Inject, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSurveyComponent } from '../../ngx-survey.component';
import { FormItem, FormItemOptionItem, FormSection } from '../../form-item/form-item';
import { buildField, buildOption, FormItemTypes } from '../../form-item/form-item.component';
import { conditional } from '../../form-item/form-item';
import * as _ from 'lodash';
import Swal from 'sweetalert2'
import { LocalStorageService } from '../../../../../../shared/Services/local-storage.service';
import { CommonService } from '../../../../../../shared/Services/common.service';

export interface DialogItemData {
    item: FormItem;
    params: any;
    section: FormSection;
}

@Component({
    selector: 'dialog-item-edit',
    templateUrl: './dialog-item-edit.html',
    styleUrls: ['./dialog-item-edit.scss']
})
export class DialogItemEdit implements OnInit, OnDestroy {
    @Input() view: boolean;

    @ViewChild('survey', { static: false }) public survey: NgxSurveyComponent;

    public item: FormItem;

    public commonFields: FormItem[];

    public extraFields: FormItem[] = [];

    public itemEditForm: any[];

    public multiChoiseFieldsOnly: boolean;
    public customFieldNamesAllowed: boolean;
    public readOnly: boolean;

    public multiChoiseFieldTypes: string[] = ['radio', 'select', 'segments'];
    public section: FormSection;

    constructor(
        public dialogRef: MatDialogRef<DialogItemEdit>,
        @Inject(MAT_DIALOG_DATA) public data: DialogItemData,
        private commonService: CommonService
    ) {
        const item = data.item;
        if (item.fieldValidations && item.fieldValidations.rules && item.fieldValidations.rules.find(r => r.minLength && r.minLength > 0)) {
            item.required = true;
        }
        this.item = item;
        this.multiChoiseFieldsOnly = data.params.multiChoiseFieldsOnly;
        this.customFieldNamesAllowed = data.params.customFieldNamesAllowed;
        this.readOnly = data.params.readOnly;
        this.section = data.section;
        this.setFormFields();
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        const list: any = this.section.items.filter(x => x.style === "list" || x.style === "buttons" || x.style === "select");
        if (list && list.length > 0) {
            const filteredSection = list.flatMap(x => x.items);
            this.commonService.setDialogOptions(filteredSection);
        }
    }

    setFormFields(): void {
        //console.log(Object.keys(FormItemTypes).filter(key => this.multiChoiseFieldsOnly ? this.multiChoiseFieldTypes.indexOf(key) >= 0 : true));
        this.commonFields = [
            buildField('select', {
                name: 'type', label: 'Type', items: Object.keys(FormItemTypes).filter(key => this.multiChoiseFieldsOnly ? this.multiChoiseFieldTypes.indexOf(key) >= 0 : true).map(key => {
                    const item = <FormItemOptionItem>FormItemTypes[key];
                    return item.label ? buildOption(key, item.label) : null;
                }).filter(t => t), actionUpdatesSectionValue: true
            }, true),
            buildField('select', {
                name: 'style', label: 'Text Field Style', items: [
                    buildOption('text', 'Standard Text Field'),
                    buildOption('number', 'Number'),
                    buildOption('email', 'E-mail'),
                    buildOption('password', 'Password'),
                    buildOption('url', 'URL'),
                ], visibilityValuesInSection: ['string'], value: 'text'
            }, true),
            buildField('select', {
                name: 'style', label: 'Style', items: [
                    buildOption('list', 'Multi Select'),
                    buildOption('buttons', 'Radio Buttons'),
                    //  buildOption('select', 'Select'),
                ], visibilityValuesInSection: ['radio'], value: 'list'
            }, true),
            //buildField('string', { name: 'name', label: 'Name', visibilityValuesInSection: !this.customFieldNamesAllowed ? ['none'] : undefined }, false),
            buildField('string', { name: 'label', label: 'Question' }),
            buildField('string', { name: 'hint', label: 'Hint' }),
            buildField('checkbox', { name: 'required', label: 'Required', visibilityValuesInSection: [['string', 'text', 'radio', 'checkbox', 'date', 'numericRating', 'rating', 'segments', 'select', 'attachment', 'scoredLabel', 'countrySelect', 'citySelect', 'contact', 'countryCity', 'termsAndCondition']], color: 'primary' }),
            buildField('conditionalQuestion', {
                name: 'conditional', label: 'Conditional', visibilityValuesInSection: [['string', 'text', 'radio', 'checkbox', 'date', 'numericRating', 'rating', 'segments', 'select', 'attachment', 'scoredLabel']],
                conditional: this.item.conditional ? this.item.conditional : new conditional(),
                section: this.section
            }, false),
            //buildField('checkbox', { name: 'actionUpdatesSectionValue', label: 'Action Updates Section Value', visibilityValuesInSection: [this.multiChoiseFieldTypes] }),
            buildField('checkbox', { name: 'multiple', label: 'Multiple Answers', visibilityValuesInSection: ['list'] }),
            buildField('optionsEditor', {
                name: 'items', label: 'Options', visibilityValuesInSection: [['radio', 'select']],
                allowCustomAnswers: !this.multiChoiseFieldsOnly, allowCustomOptionValues: this.customFieldNamesAllowed,
                defaultValue: this.item.value, multiple: this.item.multiple, item: this.item,
            }),
            buildField('optionsEditor', {
                name: 'segments', label: 'Segments', visibilityValuesInSection: ['segments'],
                allowCustomAnswers: false, allowCustomOptionValues: this.customFieldNamesAllowed,
                defaultValue: this.item.value
            }),
            buildField('termsAndConditionAttachment', { name: 'termsAndConditionAttachment', label: 'Terms & Condition Attachment', visibilityValuesInSection: [['termsAndCondition']] })
        ];

        this.itemEditForm = [
            {
                items: [...this.commonFields]
            }
        ];
    }

    onFormChange(values: FormItem): void {
        //console.log(values, this.itemEditForm);
        const optionsEditField = this.itemEditForm[0].items.find(f => f.name === 'items');
        if (optionsEditField && optionsEditField.multiple !== values.multiple) {
            optionsEditField.multiple = values.multiple;
            if (values.multiple) {
                optionsEditField.defaultValue = [];
            }
        }
        //console.log(optionsEditField);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onFormSubmit(item): void {

        if (!item.label) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Question field cannot be empty',
            });
            return;
        }

        if (item && item.type === 'termsAndCondition' && !item.termsAndConditionAttachment) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terms & Condition Attachment should be prefilled.',
            })
            return;
        } else {
            let isDuplicate: boolean = false;

            if (item && item.items && item.items.length > 0) {
                let labels = item.items.map(x => x.label);
                isDuplicate = labels.some(function (item, idx) {
                    return labels.indexOf(item) != idx
                });
            }

            if (isDuplicate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Values are duplicated',
                })
            } else {
                if (!item.fieldValidations) {
                    item.fieldValidations = {};
                }
                if (!item.fieldValidations.rules) {
                    item.fieldValidations.rules = [];
                }
                item.name = _.camelCase(item.label);
                const minLengthRule = item.fieldValidations.rules.find(r => r.minLength > 0);
                if (item.required && !minLengthRule) {
                    item.fieldValidations.rules.push({
                        minLength: 1
                    });
                }
                else if (!item.required && minLengthRule) {
                    minLengthRule.minLength = 0;
                }
                ['segments', 'items'].forEach(key => {
                    if (item[key] && item[key].length) {
                        let defaultValArr: string[] = [];
                        let defaultValStr = '';
                        item[key].forEach(option => {
                            if (option.selected) {
                                defaultValArr.push(option.optionValue);
                                defaultValStr = option.optionValue;
                            }
                            delete option.selected;
                        });
                        item.value = item.multiple ? defaultValArr : defaultValStr;
                    }
                })
                this.item = item;
                this.dialogRef.close(this.item);
            }
        }

    }

    onOkClick(): void {
        this.survey.submitForm();
    }

    ngOnDestroy(): void {
    }

}
