import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'password-policy',
    styleUrls: ['password-policy.component.scss'],
    templateUrl: 'password-policy.component.html',
    providers: [DatePipe],
})
export class PasswordPolicyComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    passwordPolicyForm: FormGroup;
    constructor(
        private datePipe: DatePipe,
        private http: HttpClient,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.passwordPolicyForm = this.fb.group({
            upperCase: [Boolean(false)],
            lowerCase: [Boolean(false)],
            numericValue: [Boolean(false)],
            specialCharacter: [Boolean(false)],
            maxLength: [null],
            minLength: [null],
            maxTries: [null],
            lockHour: [null],
            lockMinute: [null],
            validityPeriod: [null],
            expiryHour: [null],
            expiryMinute: [null],
            pwvalidation: [null],
        });
    }

    ngAfterViewInit() {}

    submitForm(): void {
        console.log(this.passwordPolicyForm.value);
    }
}
