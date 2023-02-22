/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormItem, SurveyErrorStateMatcher, FormItemWidget } from '../index';

export class FormItemText extends FormItem {
    hint: string;
}

@Component({
    selector: 'ammo-form-item-text',
    templateUrl: './form-item-text.component.html',
    styleUrls: ['./form-item-text.component.scss']
})
export class FormItemTextComponent implements FormItemWidget, OnInit, OnChanges {

    @Input() item: FormItemText;
    @Input() view: boolean;
    @Input() editable: boolean = true;
    @Output() changes = new EventEmitter<FormItemText>();
    matcher = new SurveyErrorStateMatcher();

    constructor() { }


    ngOnInit(): void {
        this.matcher.item = this.item;
    }

    ngOnChanges(): void {
        this.matcher.item = this.item;
    }

    checkRequired(placeholder) {
        if (placeholder === 'Required') {
            return true;
        }
    }

    onValueChanges(item): void {
        this.changes.emit(item);
    }
}
