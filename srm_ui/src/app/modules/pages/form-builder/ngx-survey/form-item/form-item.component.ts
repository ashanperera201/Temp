import { Component, OnInit, OnDestroy, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormItemDirective } from './form-item.directive';

import { FormItem, FormItemWidget, FormItemValidation, FormItemOptionItem } from './form-item';
import { FormItemString, FormItemStringComponent } from './form-item-string/form-item-string.component';
import { FormItemRating, FormItemRatingComponent } from './form-item-rating/form-item-rating.component';
import { FormItemText, FormItemTextComponent } from './form-item-text/form-item-text.component';
import { FormItemDate, FormItemDateComponent } from './form-item-date/form-item-date.component';
import { FormItemSegments, FormItemSegmentsComponent } from './form-item-segments/form-item-segments.component';
import { FormItemRadio, FormItemRadioComponent } from './form-item-radio/form-item-radio.component';
import { FormItemNumericRating, FormItemNumericRatingComponent } from './form-item-numeric-rating/form-item-numeric-rating.component';
import { FormItemSelect, FormItemSelectComponent } from './form-item-select/form-item-select.component';
import { FormItemConditonalQuestion, FormItemConditonalQuestionComponent } from './conditional-question/conditional-question.component';
import { FormItemOptionsEditor, FormItemOptionsEditorComponent } from './form-item-options-editor/form-item-options-editor.component';
import { FormItemCheckbox, FormItemCheckboxComponent } from './form-item-checkbox/form-item-checkbox.component';
import { FormItemLabel, FormItemLabelComponent } from './form-item-label/form-item-label.component';
import { Subscription } from 'rxjs';
import { FormItemAttachment, FormItemAttrachmentComponent } from './form-item-attachment/form-item-attachment.component';
import { FormItemCountryComponent } from './form-item-country/form-item-country.component';
import { FormItemCityComponent } from './form-item-city/form-item-city.component';
import { FormItemSupplierContactComponent } from './form-item-supplier-contact/form-item-supplier-contact.component';
import { FormItemCountryCityComponent } from './form-item-country-city/form-item-country-city.component';
import { FormItemTermsAndCondition, FormItemTermsAndConditionComponent } from './form-item-terms-and-condition/form-item-terms-and-condition.component';
import { TermsAndConditionAttachment, TermsAndConditionAttachmentComponent } from './terms-and-condition-attachment/terms-and-condition-attachment.component';

export const FormItemTypes = {
    'string': {
        component: FormItemStringComponent,
        model: FormItemString,
        label: 'Short text'
    },
    text: {
        component: FormItemTextComponent,
        model: FormItemText,
        label: 'Long text'
    },
    radio: {
        component: FormItemRadioComponent,
        model: FormItemRadio,
        label: 'Multi Choice'
    },
    checkbox: {
        component: FormItemCheckboxComponent,
        model: FormItemCheckbox,
        label: 'Checkbox'
    },
    date: {
        component: FormItemDateComponent,
        model: FormItemDate,
        label: 'Date'
    },
    numericRating: {
        component: FormItemNumericRatingComponent,
        model: FormItemNumericRating,
        label: 'Numeric rating'
    },
    rating: {
        component: FormItemRatingComponent,
        model: FormItemRating,
        label: 'Star rating'
    },
    segments: {
        component: FormItemSegmentsComponent,
        model: FormItemSegments,
        label: 'Segments'
    },
    select: { //Depricated
        component: FormItemSelectComponent,
        model: FormItemSelect,
        //label: 'Select'
    },
    optionsEditor: {
        component: FormItemOptionsEditorComponent,
        model: FormItemOptionsEditor
    },
    conditionalQuestion: {
        component: FormItemConditonalQuestionComponent,
        model: FormItemConditonalQuestion
    },
    attachment: {
        component: FormItemAttrachmentComponent,
        model: FormItemAttachment,
        label: 'Attachment'
    },
    label: {
        component: FormItemLabelComponent,
        model: FormItemLabel,
        label: 'Label'
    },
    scoredLabel: {
        component: FormItemLabelComponent,
        model: FormItemLabel,
        label: 'Label (scored)'
    },
    countrySelect: {
        component: FormItemCountryComponent,
        model: FormItemSelect,
        label: 'Country'
    },
    citySelect: {
        component: FormItemCityComponent,
        model: FormItemSelect,
        label: 'City'
    },
    contact: {
        component: FormItemSupplierContactComponent,
        model: FormItemString,
        label: 'Contact'
    },
    countryCity: {
        component: FormItemCountryCityComponent,
        model: FormItemSelect,
        label: 'Country & City'
    },
    termsAndConditionAttachment: {
        component: TermsAndConditionAttachmentComponent,
        model: TermsAndConditionAttachment,
    },
    termsAndCondition: {
        component: FormItemTermsAndConditionComponent,
        model: FormItemTermsAndCondition,
        label: 'Terms & Condition'
    }
};

export function buildOption(optionValue: string, label: string): FormItemOptionItem {
    return <FormItemOptionItem>{ optionValue, label };
}

export function buildField(type: string, data: any, required?: boolean): FormItem {
    const obj = Object.assign(new (FormItemTypes[type].model), data);
    obj.type = type;

    if (required) {
        (<FormItemValidation>obj.fieldValidations) = {
            rules: [
                {
                    minLength: 1
                }
            ]
        }
    }

    return obj;
}


@Component({
    selector: 'ngx-survey-form-item',
    templateUrl: './form-item.component.html',
    styleUrls: ['./form-item.component.scss']
})
export class FormItemComponent implements OnInit, OnDestroy, OnChanges {

    @Input() type: string;
    @Input() item: FormItem | FormItemString | FormItemRating | FormItemText | FormItemDate | FormItemSegments | FormItemRadio | FormItemNumericRating
        | FormItemSelect | FormItemOptionsEditor | FormItemCheckbox | FormItemConditonalQuestion;
    @Input() editable: boolean = true;
    @Input() isMobile: boolean = false;
    @Input() id: string;
    @Output() changes = new EventEmitter<any>();
    @Input() enableFileUpload: boolean = false;
    @Input() view: boolean;

    @ViewChild(FormItemDirective, { static: true }) public itemHost: FormItemDirective;

    viewItem: boolean = false;
    private subscription: Subscription;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
    ) {

    }

    ngOnInit() {
        this.loadComponent();
        this.viewItem = this.view === undefined ? false : this.view;
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes && (changes.type || changes.id)) {
            this.loadComponent();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }


    }

    loadComponent() {
        if (!FormItemTypes[this.type]) {
            return;
        }

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(FormItemTypes[this.type].component);

        let viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<FormItemWidget>componentRef.instance).item = this.item;
        (<FormItemWidget>componentRef.instance).editable = this.editable;
        (<FormItemWidget>componentRef.instance).isMobile = this.isMobile;
        (<FormItemWidget>componentRef.instance).enableFileUpload = this.enableFileUpload;
        (<FormItemWidget>componentRef.instance).view = this.view;

        this.subscription = (<FormItemWidget>componentRef.instance).changes.subscribe(item => this.changes.emit(item));
    }

}
