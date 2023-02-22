import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { FormItem } from '../form-item';


export class FormItemTermsAndCondition extends FormItem {
    termsAndConditionAttachment: string;
    isTermsAccepted: boolean;
}

@Component({
    selector: 'app-form-item-terms-and-condition',
    templateUrl: './form-item-terms-and-condition.component.html',
    styleUrls: ['./form-item-terms-and-condition.component.scss']
})
export class FormItemTermsAndConditionComponent implements OnInit {

    @Input() item: FormItemTermsAndCondition;
    @Input() editable: boolean = true;
    @Input() view: boolean = false;
    @Output() changes = new EventEmitter<FormItemTermsAndCondition>();
    matcher = new SurveyErrorStateMatcher();

    linkSource: string;
    termsAndConditionAccepctance: boolean = false;
    attachmentRef: any;

    constructor() { }

    ngOnInit(): void {
        if (this.item) {
            this.attachmentRef = JSON.parse(this.item.termsAndConditionAttachment);
            this.linkSource = this.attachmentRef?.base64;
            this.termsAndConditionAccepctance = this.attachmentRef?.isTermsAccepted;
        }
    }

    onChange = (event: any): void => {
        this.attachmentRef['isTermsAccepted'] = this.termsAndConditionAccepctance;
        this.item.termsAndConditionAttachment = JSON.stringify(this.attachmentRef);
        this.item.value = "Added";
        this.changes.emit(this.item);
    }

    onDownload = (): void => {
        const downloadLink = document.createElement("a");
        downloadLink.href = this.linkSource;
        downloadLink.download = this.attachmentRef?.fileName;
        downloadLink.click();
    }

}
