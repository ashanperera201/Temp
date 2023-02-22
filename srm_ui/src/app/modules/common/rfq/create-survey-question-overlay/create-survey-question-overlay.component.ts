import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { RfqHeaderSurveyFormService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-survey-form.service';
import { SurveyTemplateService } from 'app/shared/Services/etendering/survey-template.service';
import Swal from 'sweetalert2';
import { SurveyFormsComponent } from '../header-component/survey-forms/survey-forms.component';

@Component({
    selector: 'add-new-costfactor-overlay',
    templateUrl: './create-survey-question-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CreateSurveyQuestionOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';
    parentComponent: SurveyFormsComponent;
    rFXId: string;
    lblHeading: string = "Create Question";
    lbltitle: string = "Question Name";
    lbldescription: string = "Question Description";

    rfqsurveyQuestionId: string;
    title: any;
    name: any;
    surveyTemplateIdList: any = [];
    frmSurveyGroup: FormGroup;

    isEditOperation: boolean = false;
    isTemplateOperation: boolean = false;
    rfqSurveyQuestion: RFQQuestionModel = new RFQQuestionModel();
    rfqSurveyQuestionList: RFQQuestionModel[] = [];

    issuccess = false;
    iserror = false;
    names = [];
    isSaved: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<CreateSurveyQuestionOverlayComponent>,
        private rfqHeaderSurveyFormService: RfqHeaderSurveyFormService, private surveyTemplateService: SurveyTemplateService,
        private fb: FormBuilder,
        public dialog: MatDialog
    ) {
        this.parentComponent = data.SurveyFormsComponent;
        this.rFXId = data.rfqId;
        this.rfqsurveyQuestionId = data.rfqsurveyQuestionId;
        this.isTemplateOperation = data.isTemplateOperation;
        this.isEditOperation = data.editOperation;
        this.frmSurveyGroup = this.fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'rfqId': ["00000000-0000-0000-0000-000000000000"],
        });
    }

    onNameChange(name: string) {
        this.surveyTemplateService.GetSurveyQuestionNameList().subscribe(result => {
            this.names = result.data.map(x => x.toLowerCase().trim());
        });
        if (this.names.includes(name.toLowerCase().trim())) {
            this.frmSurveyGroup.get('name').setErrors({ duplicate: true });
            this.isSaved = true;
        }
        else {
            this.isSaved = false;
        }
    }

    onNameInput(name: string) {
        if (this.names.includes(name.toLowerCase())) {
            this.frmSurveyGroup.get('name').setErrors({ duplicate: true });
        }
    }

    ngOnInit() {
        if (this.isEditOperation) {
            let surveyQuestiosModel: SurveyQuestionModel = new SurveyQuestionModel();
            if (this.isTemplateOperation) {
                this.lblHeading = "Edit Template";
                this.lbltitle = "Template Name";
                this.lbldescription = "Template Description";
                this.rfqHeaderSurveyFormService.GetRFQSurveyQuestionByTemplateID(this.rfqsurveyQuestionId).subscribe(result => {
                    this.rfqSurveyQuestionList = result.data;
                    surveyQuestiosModel.name = this.rfqSurveyQuestionList[0].templateName;
                    surveyQuestiosModel.description = this.rfqSurveyQuestionList[0].templateDescription;
                    if (this.rfqSurveyQuestion != null) {
                        this.frmSurveyGroup.patchValue(surveyQuestiosModel);
                    }
                });
            } else {
                this.lblHeading = "Edit Question";
                this.rfqHeaderSurveyFormService.GetSurveyQuestionByID(this.rfqsurveyQuestionId).subscribe(result => {
                    this.rfqSurveyQuestion = result.data;
                    surveyQuestiosModel.name = result.data.quetionsName;
                    surveyQuestiosModel.description = result.data.description;
                    if (this.rfqSurveyQuestion != null) {
                        this.frmSurveyGroup.patchValue(surveyQuestiosModel);
                    }
                });
            }
        }
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        if (this.frmSurveyGroup.valid) {
            let surveyQuestiosModel: SurveyQuestionModel = new SurveyQuestionModel()
            surveyQuestiosModel = Object.assign(surveyQuestiosModel, form);
            if (this.isEditOperation) {
                if (this.isTemplateOperation) {
                    for (var l = 0; l < this.rfqSurveyQuestionList.length; l++) {
                        this.rfqSurveyQuestionList[l].templateName = surveyQuestiosModel.name;
                        this.rfqSurveyQuestionList[l].templateDescription = surveyQuestiosModel.description;
                        this.rfqSurveyQuestionList[l].isRFQTemplateSurveyDetailSave = true;
                    }
                    this.rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(this.rfqSurveyQuestionList).subscribe(result => {
                        this.dialogRef.close();

                        if (result) {
                            Swal.fire({
                                icon: 'success',
                                title: "RFQ Survey Template Updated successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                        this.parentComponent.fetchRfqHeaderSurveyForms(this.rFXId);
                    });
                } else {
                    this.rfqSurveyQuestion.quetionsName = surveyQuestiosModel.name;
                    this.rfqSurveyQuestion.description = surveyQuestiosModel.description;

                    this.rfqSurveyQuestion.isRFQQuestionSurveyDetailSave = true;
                    this.surveyTemplateIdList.push(this.rfqSurveyQuestion);
                    this.rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(this.surveyTemplateIdList).subscribe(result => {
                        this.dialogRef.close();

                        if (result) {
                            Swal.fire({
                                icon: 'success',
                                title: "RFQ Survey Question Updated successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                        this.parentComponent.fetchRfqHeaderSurveyForms(this.rFXId);
                    });
                }
            } else {
                surveyQuestiosModel.rfqId = this.rFXId;
                this.rfqHeaderSurveyFormService.SaveSurveyQuestion(surveyQuestiosModel).subscribe(result => {
                    this.SaveRFQHeader(result.data);
                    this.isSaved = false;
                });
            }
        }
    }

    doAction() {
        this.dialogRef.close();
    }

    SaveRFQHeader(sqresult) {
        let rfqHeaderSurveys: RFQQuestionModel[] = [];
        let rfqHeaderSurvey: RFQQuestionModel = new RFQQuestionModel();
        rfqHeaderSurvey.surveyQuestionId = sqresult.id;
        rfqHeaderSurvey.surveyTemplateId = sqresult.surveyTemplateId;
        rfqHeaderSurvey.rFXId = sqresult.rfqId;
        rfqHeaderSurveys.push(rfqHeaderSurvey);

        this.rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(rfqHeaderSurveys).subscribe(result => {
            this.dialogRef.close();

            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: "Survey Question Added successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            this.parentComponent.fetchRfqHeaderSurveyForms(this.rFXId);
        });
    }

    addNewSurveyQuestionButtonEnable() {
        this.isSaved = false;
    }

}