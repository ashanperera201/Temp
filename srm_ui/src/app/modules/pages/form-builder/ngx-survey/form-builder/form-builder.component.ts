/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable max-len */
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgxSurveyService } from '../ngx-survey.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { DialogSectionEdit, DialogItemEdit, DialogItemVisibility } from '../dialogs/index';
import { FormItem, FormSection, buildField, FormItemComponent } from '../form-item/index';
import { CommonService } from '../../../../../shared/Services/common.service';


@Component({
    selector: 'ngx-survey-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit, OnDestroy {

    @Output() changes = new EventEmitter<any[]>();
    @Output() onFieldAdded = new EventEmitter<FormItem>();

    @Input() set form(form: FormSection[]) {
        this._form = this.service.initForm(form, this.formValues);
        //console.log(this._form);
    };

    get form(): FormSection[] {
        return this._form;
    }

    @Input() allowMultiChoiseFieldsOnly: boolean = false;
    @Input() enableEditFieldValues: boolean = true;
    @Input() showFieldNames: boolean = true;
    @Input() readOnly: boolean = false;
    @Input() view: boolean;

    @ViewChildren('formFieldItem') formItemElements: QueryList<FormItemComponent>;

    private _form;
    formBuilderSubscription: Subscription;

    constructor(
        public service: NgxSurveyService,
        public dialog: MatDialog,
        private commonService: CommonService
    ) {
    }

    ngOnInit(): void {
        this.formBuilderSubscription = this.commonService.onFormPass.subscribe((res) => {
            debugger;
            this.form = res;
        });
    }

    public formValues: any = {};
    public sortableSectionOptions: any = {
        onUpdate: (event: any) => {
            //event;
            //console.log(event);
            this.changes.emit(this.form);
        },
        //handle: '.sortable-handle'
    };

    onSectionDropped(event: CdkDragDrop<FormItem[]>) {
        const previousIndex = this.form.findIndex(row => event.item && row === event.item.data);
        moveItemInArray(this.form, previousIndex, event.currentIndex);
        this.form = this.form.slice();
        this.changes.emit(this.form);
    }

    onItemDropped(event: CdkDragDrop<FormItem[]>, section: FormSection) {
        const previousIndex = (section.items || []).findIndex(row => event.item && row === event.item.data);
        moveItemInArray((section.items || []), previousIndex, event.currentIndex);
        section.items = (section.items || []).slice();
        this.changes.emit(this.form);
    }

    public sortableItemOptions: any = {
        onUpdate: (event: any) => {
            //event;
            //console.log(event);
            this.changes.emit(this.form);
        },
        handle: '.form-item'
    };

    openSectionDialog(section: FormSection): void {
        const dialogRef = this.dialog.open(DialogSectionEdit, {
            width: '450px',
            data: {
                params: {
                    readOnly: this.readOnly,
                },
                section: section
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
            if (result && !this.readOnly) {
                section = _.extend(section, result);
                this.changes.emit(this.form);
            }

        });
    }

    openItemDialog(item: FormItem, section?: FormSection): void {
        const dialogRef = this.dialog.open(DialogItemEdit, {
            width: '60%',
            maxWidth: '100%',
            data: {
                params: {
                    multiChoiseFieldsOnly: this.allowMultiChoiseFieldsOnly,
                    customFieldNamesAllowed: this.showFieldNames,
                    readOnly: this.readOnly,
                },
                item: _.cloneDeep(item),
                tempForm: this.form,
                section: section
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result, section);
            if (result && !this.readOnly && result?.name !== '') {
                item = _.extend(item, result);
                const itemComponent = this.formItemElements.find(el => el.item === item);
                if (section) {
                    item.name = _.camelCase((section.name || '') + ' ' + item.name);
                }
                if (item.justAdded) {
                    this.onFieldAdded.emit(item);
                }

                item.justAdded = false;
                this.changes.emit(this.form);
                if (itemComponent) {
                    itemComponent.loadComponent();
                }
            }
            else if (section && item.justAdded) {
                this.removeField(item, section);
            }
        });
    }

    getSectionValueItemsForItem(item: FormItem, section: FormSection) {
        return (section.items || []).filter(sItem => sItem.actionUpdatesSectionValue && sItem.name !== item.name);
    }

    openItemVisibilityDialog(item: FormItem, section: FormSection): void {

        const sectionValueItems = this.getSectionValueItemsForItem(item, section);

        const dialogRef = this.dialog.open(DialogItemVisibility, {
            width: '450px',
            data: {
                sectionItems: sectionValueItems,
                visibility: item.visibilityValuesInSection || [],
                readOnly: this.readOnly,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
            if (result && !this.readOnly) {
                item.visibilityValuesInSection = [];
                sectionValueItems.forEach((sItem) => {
                    if (result[sItem.name]) {
                        item.visibilityValuesInSection.push(result[sItem.name]);
                    }
                });
                console.log(item);
                this.changes.emit(this.form);
            }

            /*
            if (result){
                item=_.extend(item, result);
                this.changes.emit(this.form);
            }
            else if(section && item.justAdded) {
                this.removeField(item, section);
            }*/
        });
    }



    getDateStr(time) {
        time = time / 1000000;
        return moment.utc(time).format('MM/DD/YYYY');
    };

    getDateValue(str) {
        const dt = new Date(str);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

        return dt;
    };

    onItemChanges(item: FormItem): void {

        item.errors = this.service.getErrors(item);
        this.changes.emit(this.form);
    }

    removeField(item: FormItem, section: FormSection): void {
        section.items = (section.items || []).filter((op, index) => index !== (section.items || []).indexOf(item));
        this.changes.emit(this.form);
    }

    cloneItem(item: FormItem, section: FormSection): void {
        if (this.readOnly) {
            return;
        }
        const newItem = _.cloneDeep(item);
        let newName = newItem.name + '_clone';
        if (section.items?.find(item => item.name === newName)) {
            const index = section.items?.filter(item => item.name.indexOf(newName) >= 0).length;
            newName += '_' + index;
        }
        newItem.name = newName;
        newItem.actionUpdatesSectionValue = false;
        section.items?.splice(section.items?.indexOf(item) + 1, 0, newItem);
        this.changes.emit(this.form);
    }

    clearValue(item: FormItem, section: FormSection): void {
        item.value = '';
        this.changes.emit(this.form);
    }

    addFeild(section: FormSection): void {
        if (!section.items) {
            section.items = [];
        }
        const field = this.allowMultiChoiseFieldsOnly ? buildField('radio', { name: '', label: '', items: [], style: 'list' }, true) : buildField('string', { name: '', label: '' });
        field.justAdded = true;
        section.items.push(field);
        this.openItemDialog(field, section);
    }

    removeSection(section: FormSection): void {
        this.form = this.form.filter((op, index) => index !== this.form.indexOf(section));
        this.changes.emit(this.form);
    }

    addSection(): void {
        this.form.push(<FormSection>{});
    }

    ngOnDestroy(): void {
        if (this.formBuilderSubscription) {
            this.formBuilderSubscription.unsubscribe();
        }
    }
}
