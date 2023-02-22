/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/no-output-native */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
//import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ResizedEvent } from 'angular-resize-event';
//import { Subscription } from 'rxjs';
import { NgxSurveyService } from './ngx-survey.service';
import { MatStepper } from '@angular/material/stepper';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ReviewFormService } from 'app/shared/Services/review-form.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ngx-survey',
    templateUrl: './ngx-survey.component.html',
    styleUrls: ['./ngx-survey.component.scss']
})
export class NgxSurveyComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input() form: any[];
    @Input() value: any = {};
    @Input() splitBySteps: boolean;
    @Input() validateByStepChange: boolean = true;
    @Input() submitInProgress: boolean;
    @Input() submitErrorText: string;
    @Input() editable: boolean = true;
    @Input() isPreview: boolean = false;
    @Input() enableFileUpload: boolean = false;
    @Input() view: boolean;

    @Input() headerData: any;

    @Output() valueChange = new EventEmitter<any>();
    @Output() stepChanged = new EventEmitter<any>();
    @Output() submit = new EventEmitter<any>();
    @Output() resized = new EventEmitter<ResizedEvent>();
    @Output() formSubmit = new EventEmitter<any>();

    @ViewChild('stepper', { static: false }) public stepper: MatStepper;

    public selectedIndex: number = 0;
    public isMobile: boolean;
    showError: boolean = false;
    errorMessage: any;

    logoImg: string | ArrayBuffer;
    logoBannerRef: string | ArrayBuffer;

    destroy$ = new Subject<boolean>();
    //private _bpSub: Subscription;

    constructor(
        //private bpObserver: BreakpointObserver,
        private elRef: ElementRef,
        public service: NgxSurveyService,
        private _fuseConfirmationService: FuseConfirmationService,
        private reviewFormService: ReviewFormService,
    ) {
    }

    ngOnInit() {
        this.onUploadChangeHandler();
    }

    onUploadChangeHandler = (): void => {
        this.reviewFormService.logoUploadChange.pipe(switchMap(logoRef => {
            if (logoRef) {
                this.logoImg = logoRef;
            }
            return this.reviewFormService.bannerUploadChange;
        })).pipe(takeUntil(this.destroy$)).subscribe({
            next: (bannerRef => {
                if (bannerRef) {
                    this.logoBannerRef = bannerRef;
                }
            })
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.form = this.service.initForm(this.form, this.value);
        if (this.splitBySteps) {
            this.form.forEach((section) => {
                section.isEditable = true;
            });
        }

        if (this.form) {
            this.form.forEach((section) => {
                if (section && section.items) {
                    section.items.forEach(i => {
                        this.triggerOnChanges(section, i)
                    })
                }
            });
        }
    }

    ngAfterViewInit() {
    }

    triggerOnChanges = (section, item) => {
        if ((section && section.enableScore && section.enableComment && item && item.score <= 2 && !item.comment) && this.view) {
            section['invalid'] = true;
        } else {
            section['invalid'] = false;
        }
    }

    onResized(event: ResizedEvent) {
    }

    OnSelectionChange = (event: any, section, item: any) => {
        if ((section && section.enableScore && section.enableComment && item && item.score <= 2 && !item.comment) && this.view) {
            item['invalid'] = true;
        } else {
            item['invalid'] = false;
        }
    }

    scrollToField(field) {
        const el = this.elRef.nativeElement.querySelector('#form_item_' + field.name);
        if (el) {
            el.scrollIntoView();
        }
    };

    isStepEnabled(section) {
        const prevSection = this.form[this.form.indexOf(section) - 1];
        return !this.validateByStepChange || !prevSection || (prevSection && prevSection.submited && !prevSection.hasError);
    }

    onItemChanges(item): void {
        if (!this.editable) {
            return;
        }
        item.errors = this.service.getErrors(item);
        const { value } = this.service.getValue(this.form, false);
        this.valueChange.emit(value);
    }

    selectionChanged(event: any): void {
        this.selectedIndex = event.selectedIndex;
    }

    setMobileStepper(isMobile: boolean): void {

        this.isMobile = isMobile;
        setTimeout(() => {
            if (this.stepper) {
                this.stepper.selectedIndex = this.selectedIndex;
            }
        });
    }

    onStepChange(step): void {
        //console.log(step);
        this.stepChanged.emit(step);
        if (this.validateByStepChange && step.previouslySelectedIndex >= 0 && this.form[step.previouslySelectedIndex]) {
            this.submitStep(this.form[step.previouslySelectedIndex], false);
        }
    }

    submitForm() {
        const { valid, value, firstError }: any = this.service.getValue(this.form, true, this.isPreview);
        // this.storeOptions(value?.items);

        if (valid) {
            this.showError = false;
            this.submit.emit(value);
            this.formSubmit.emit(this.form)
        }
        else {
            this.scrollToField(firstError);
            this.showError = true;
            this.errorMessage = firstError.errors[0].message;
            return this.errorMessage;
        }
    }

    // storeOptions = (values: any) => {
    //     let options: any[] = [];
    //     const localValues = JSON.parse(localStorage.getItem('form-options'));
    //     if (localValues) { 
    //         options.concat(localValues);
    //     }

    //     localStorage.setItem('form-options', JSON.stringify(options));
    // }

    submitStep(section, goToNext) {
        if (!this.editable) {
            return;
        }
        //console.log(section);
        const { valid, firstError } = this.service.getValue([section], true);
        //console.log({valid, value, firstError});
        if (valid) {
            section.hasError = false;
            section.submited = true;
            //console.log(this.stepper);
            if (goToNext) {
                setTimeout(() => {
                    this.stepper.next();
                }, 100);
            }

        }
        else {
            //console.log(firstError);
            this.scrollToField(firstError);
            section.hasError = true;
            if (firstError && firstError.errors && firstError.errors[0]) {
                section.firstErrorText = firstError.label + ': ' + firstError.errors[0].message;
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete()
    }

}
