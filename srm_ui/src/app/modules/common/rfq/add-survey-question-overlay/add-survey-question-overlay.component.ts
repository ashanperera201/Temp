import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SurveyFormsComponent } from '../header-component/survey-forms/survey-forms.component';
import { RfqHeaderSurveyFormService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-survey-form.service';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { SurveyQuestionSearchModel } from 'app/main/Models/etendering/survey-form-search-model';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-survey-question-overlay',
    templateUrl: './add-survey-question-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddSurveyQuestionOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'description'];
    displayedColumns2: string[] = ['id', 'name2'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    parentComponent: SurveyFormsComponent;
    rfqId: string;
    surveyQuestionId: string;
    rfqHeadersurveyQuestions: any = [];
    surveyQuestionmodel: SurveyQuestionModel[];

    name: any;
    description: any;

    isEditOperation: boolean = false;
    detailsDisplayMap = new Map();

    issuccess = false;
    iserror = false;
    surveyQuestionseacrchModel: SurveyQuestionSearchModel = new SurveyQuestionSearchModel();
    selectedSurvey: any[] = [];
    isSaved:boolean = false;
    notDisabledMap = new Map();

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddSurveyQuestionOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderSurveyFormService: RfqHeaderSurveyFormService, private fb: FormBuilder
    ) {
        this.parentComponent = data.SurveyFormsComponent;
        this.surveyQuestionId = data.surveyQuestionId;
        this.rfqId = data.rfqId;
        this.isEditOperation = data.editOperation;
    }

    ngOnInit(): void {
        this.fetchRFQSurveyQuestionData(this.rfqId);
    }

    fetchRFQSurveyQuestionData(rfqId: string) {
        this.surveyQuestionseacrchModel.rfqId = rfqId;
        this.rfqHeaderSurveyFormService.GetSurveyQuestionSearchByRFQId(this.surveyQuestionseacrchModel).subscribe(result => {
            this.surveyQuestionmodel = result.data;
            this.surveyQuestionmodel = result.data.surveyQuestionModels;

            for (let k = 0; k < this.surveyQuestionmodel.length; k++) {
                if (this.surveyQuestionmodel[k].isChecked === true) {
                    this.selectedSurvey.push(this.surveyQuestionmodel[k].name);
                }
            }
        });
    }

    searchGroup() {
        this.surveyQuestionseacrchModel.surveyQuestionSearchName = this.name;
        this.surveyQuestionseacrchModel.surveyQuestionSearchDescription = this.description;
        this.fetchRFQSurveyQuestionData(this.rfqId);
    }

    toggleDisplay(id: string) {
        var existingVal = this.detailsDisplayMap.get(id);

        if (existingVal) {
            this.detailsDisplayMap.set(id, !existingVal)
        } else {
            this.detailsDisplayMap.set(id, true)
        }
    }

    getactiveDetailsTab(id: string): boolean {
        return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }

    saveTemplate() {
        this.isSaved = true;
        let rfqsurveyTemplates: RFQQuestionModel[] = [];
        for (var k = 0; k < this.surveyQuestionmodel.length; k++) {
            if (this.surveyQuestionmodel[k].isChecked == true) {
                if (this.surveyQuestionmodel[k].surveyTemplateModels != null && this.surveyQuestionmodel[k].surveyTemplateModels.length > 0) {
                    let checkedgroup = this.surveyQuestionmodel[k].surveyTemplateModels.filter(i => i.isChecked == true)
                    if (checkedgroup.length > 0) {
                        for (var m = 0; m < this.surveyQuestionmodel[k].surveyTemplateModels.length; m++) {
                            if (this.surveyQuestionmodel[k].surveyTemplateModels[m].isChecked == true) {

                                let rfqsurveyTemplate: RFQQuestionModel = new RFQQuestionModel();
                                rfqsurveyTemplate.surveyQuestionId = this.surveyQuestionmodel[k].id;
                                rfqsurveyTemplate.surveyTemplateId = this.surveyQuestionmodel[k].surveyTemplateModels[m].id;
                                rfqsurveyTemplate.rFXId = this.rfqId;
                                rfqsurveyTemplates.push(rfqsurveyTemplate);                                
                            }
                        }
                    }
                    else {
                        let rfqHeaderCostFactor: RFQQuestionModel = new RFQQuestionModel();
                        rfqHeaderCostFactor.surveyQuestionId = this.surveyQuestionmodel[k].id;
                        rfqHeaderCostFactor.rFXId = this.rfqId;
                        rfqsurveyTemplates.push(rfqHeaderCostFactor);
                    }
                }
                else {
                    let rfqHeaderCostFactor: RFQQuestionModel = new RFQQuestionModel();
                    rfqHeaderCostFactor.surveyQuestionId = this.surveyQuestionmodel[k].id;
                    rfqHeaderCostFactor.rFXId = this.rfqId;
                    rfqsurveyTemplates.push(rfqHeaderCostFactor);
                }
            }
        }
        if (rfqsurveyTemplates.length > 0) {
            this.rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(rfqsurveyTemplates).subscribe(result => {
                this.isSaved = false;
                this.dialogRef.close();
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: "Survey Question Added successfully",
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
                this.parentComponent.fetchRfqHeaderSurveyForms(this.rfqId);
                this.notDisabledMap = new Map();
            });
        }
    }

    setParentIsChecked(cf, event, id, isChecked) {
        cf.isChecked = event.checked;
        this.onCheckBoxSelect(id, isChecked);
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
