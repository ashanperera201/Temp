/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormItem, SurveyErrorStateMatcher, FormItemWidget } from '../index';

export class FormItemString extends FormItem {
    hint: string;
}

@Component({
    selector: 'ammo-form-item-string',
    templateUrl: './form-item-string.component.html',
    styleUrls: ['./form-item-string.component.scss']
})
export class FormItemStringComponent implements FormItemWidget, OnInit, OnChanges {

    @Input() item: FormItemString;
    @Input() editable: boolean = true;
    @Input() view: boolean;
    @Output() changes = new EventEmitter<FormItemString>();
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
