/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SurveyFormsComponent } from '../header-component/survey-forms/survey-forms.component';
import { RfqHeaderSurveyFormService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-survey-form.service';
import { SurveyTemplateModel } from 'app/main/Models/etendering/survey-template-model';
import { SurveyTemplateSearchModel } from 'app/main/Models/etendering/survey-template-search-model';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-survey-overlay',
    templateUrl: './add-survey-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddSurveyOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'description'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    parentComponent: SurveyFormsComponent;
    rfqId: string;
    surveyTemplateId: string;
    description: any;
    name: any;

    frmSurveyGroup: FormGroup;
    isEditOperation: boolean = false;
    SurveyTempplateModel: SurveyTemplateModel[];
    SurveyQuestion: SurveyTemplateSearchModel = new SurveyTemplateSearchModel();

    issuccess = false;
    iserror = false;

    selectedSurvey: any[] = [];
    notDisabledMap = new Map();

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddSurveyOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderSurveyFormService: RfqHeaderSurveyFormService,
        private fb: FormBuilder
    ) {
        this.parentComponent = data.SurveyFormsComponent;
        this.rfqId = data.rfqId;
        this.isEditOperation = data.editOperation;
        this.surveyTemplateId = data.surveyTemplateId;

        // Assign the data to the data source for the table to render
        this.frmSurveyGroup = this.fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'rfqId': "00000000-0000-0000-0000-000000000000",
        });
    }

    fetchTemplategroup() {
        this.SurveyQuestion.rfqId = this.rfqId;
        this.rfqHeaderSurveyFormService.GetSurveyTemplateSearch(this.SurveyQuestion).subscribe(result => {
            this.SurveyTempplateModel = result.data;

            for (let k = 0; k < this.SurveyTempplateModel.length; k++) {
                if (this.SurveyTempplateModel[k].isChecked === true) {
                    this.selectedSurvey.push(this.SurveyTempplateModel[k].name);
                }
            }
        });
    }

    ngOnInit() {
        this.fetchTemplategroup();
    }

    searchGroup() {
        this.SurveyQuestion.name = this.name;
        this.SurveyQuestion.description = this.description;
        this.fetchTemplategroup();
    }

    saveTemplate() {
        let rfqSurveyQuestions: RFQQuestionModel[] = [];
        for (var k = 0; k < this.SurveyTempplateModel.length; k++) {
            if (this.SurveyTempplateModel[k].isChecked == true) {
                for (var m = 0; m < this.SurveyTempplateModel[k].surveyQuestions.length; m++) {
                    let rfqSurveyQuestion: RFQQuestionModel = new RFQQuestionModel();
                    rfqSurveyQuestion.surveyQuestionId = this.SurveyTempplateModel[k].surveyQuestions[m].id;
                    rfqSurveyQuestion.surveyTemplateId = this.SurveyTempplateModel[k].id;
                    rfqSurveyQuestion.rFXId = this.rfqId;
                    rfqSurveyQuestions.push(rfqSurveyQuestion);
                }
            }
        }

        this.rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(rfqSurveyQuestions).subscribe(result => {
            this.dialogRef.close();
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: "Survey Template Added successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            this.parentComponent.fetchRfqHeaderSurveyForms(this.rfqId);
            this.notDisabledMap = new Map();
        });
    }

    doAction() {
        this.dialogRef.close();
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedSurvey.push(row.name);
        } else {
            this.selectedSurvey.splice(this.selectedSurvey.indexOf(row.name), 1);
        }
        this.onCheckBoxSelect(row.id, row.isChecked);
    }

    onCheckBoxSelect(id, isChecked) : void {
        this.notDisabledMap.set(id, isChecked);
    }

}
