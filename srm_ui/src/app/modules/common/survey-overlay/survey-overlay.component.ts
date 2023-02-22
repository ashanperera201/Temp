import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { SurveyTemplateModel } from 'app/main/Models/etendering/survey-template-model';
import { SurveyTemplateSearchModel } from 'app/main/Models/etendering/survey-template-search-model';
import { SurveyTemplateService } from 'app/shared/Services/etendering/survey-template.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { SurveyQuestionSearchModel } from 'app/main/Models/etendering/survey-form-search-model';
import { SurveyQuestionComponent } from '../survey-question/survey-question.component';
import { SurveyTemplateComponent } from '../survey-template/survey-template.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'survey-overlay',
  templateUrl: '../survey-overlay/survey-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SurveyOverlayComponent {

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  displayedColumns: string[] = ['id', 'name', 'description'];
  dataId: any = "";
  costFactorGroupViewModel: SurveyTemplateModel[];
  surveyTemplateSearchModel: any = new SurveyTemplateSearchModel();
  surveyQuestionSearchModel: any = new SurveyQuestionSearchModel();
  actualSurveyTemplateModels: any = [];
  actualSurveyQuestionModels: any = [];
  name: string;
  AddedTempalte: any = [];
  isDelete = false;
  surveyQuestion: SurveyQuestionModel[];
  costFactorTypes: any[];//Your Model
  surveyQuestionContext: SurveyQuestionComponent;
  surveyTemplateContext: SurveyTemplateComponent;

  newEditbuttonText: string = "Save";
  neweditTextTemplate: string = "Survey Template Added successfully";

  names: string;
  isSaved: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<SurveyOverlayComponent>,
    public dialog: MatDialog, private surveyTemplateService: SurveyTemplateService, private _fuseConfirmationService: FuseConfirmationService
  ) {
    this.data = data;
    this.AddedTempalte = data.AddedTempalte;
    this.dataId = data.id;
    this.surveyQuestionContext = data.context;
    this.surveyTemplateContext = data.context;
    this.questionTemplateModel.type = data.type;

    if (this.data.parent == "temp") {
      this.names = data.surveyTemplateModels.map(x => x.name.toLowerCase().trim());
    }
    if (this.data.parent == "ques") {
      this.names = data.surveyQuestionModels.map(x => x.name.toLowerCase().trim());
    }

    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.newEditbuttonText = "Update";
      this.neweditTextTemplate = "Survey Template Updated successfully";
    }
  }

  firstScreen: boolean;
  secondScreen: boolean;

  ngOnInit() {
    this.firstScreen = this.data.firstscreen === 'false' ? false : true;
    this.secondScreen = this.data.firstscreen === 'false' ? true : false;
    this.FetchQuestions();
    this.GetById();
    this.getSurveyTemplateByID();
  }

  isDuplicate = false;
  onNameInput(name: string) {
    if (this.names.includes(name.toLowerCase().trim())) {
      this.isDuplicate = true;
    } else {
      this.isDuplicate = false;
    }
  }

  GetById() {
    this.surveyTemplateService.GetSurveyQuestionByID(this.dataId).subscribe(result => {//your service call here
      this.questionTemplateModel.id = result.data.id;
      this.questionTemplateModel.name = result.data.name;
      this.questionTemplateModel.description = result.data.description;
      this.questionTemplateModel.isPrivate = result.data.isPrivate;

      this.isDelete = true;
      this.surveyQuestion = [];
      this.surveyQuestion.push(result.data);
    });
  }

  getSurveyTemplateByID() {
    this.surveyTemplateService.getSurveyTemplateByID(this.dataId).subscribe(result => {//your service call here
      this.questionTemplateModel.id = result.data.id;
      this.questionTemplateModel.name = result.data.name;
      this.questionTemplateModel.description = result.data.description;
      this.questionTemplateModel.isPrivate = result.data.isPrivate;

      this.isDelete = true;
      this.surveyQuestion = [];
      this.surveyQuestion.push(result.data);
    });
  }

  SaveOnUpdate() {
    this.surveyTemplateService.SaveSurveyQuestion(this.questionTemplateModel).subscribe(result => {

      if (result) {
        Swal.fire({
          icon: 'success',
          title: "Survey Question Updated successfully",
          showConfirmButton: false,
          timer: 1000
        })
      }

      this.surveyQuestionContext && this.surveyQuestionContext.FetchBasicData();
      this.questionTemplateModel.surveyTemplateModels = result;
      this.dialogRef.close();
    });
  }

  FetchSurveyTempList() {
    this.surveyTemplateService.getSurveyTemplateList(this.surveyTemplateSearchModel).subscribe(result => {
      this.surveyTemplateSearchModel = result;

      for (var i = 0; i < result.surveyTemplateModels.length; i++) {
        this.actualSurveyTemplateModels.push(result.surveyTemplateModels[i])
      }
    });
  }

  FetchQuestions() {
    this.surveyTemplateService.getSurveyQuestionList(this.surveyQuestionSearchModel).subscribe(result => {
      this.surveyQuestionSearchModel = result;

      for (var i = 0; i < this.surveyQuestionSearchModel.surveyQuestionModels.length; i++) {
        this.surveyQuestionSearchModel.surveyQuestionModels[i].isChecked = false;
        this.surveyQuestionSearchModel.surveyQuestionModels[i].isDisabled = false;
        for (var k = 0; k < this.AddedTempalte.surveyQuestions.length; k++) {
          if (this.surveyQuestionSearchModel.surveyQuestionModels[i].id == this.AddedTempalte.surveyQuestions[k].id) {
            this.surveyQuestionSearchModel.surveyQuestionModels[i].isChecked = true;
            this.surveyQuestionSearchModel.surveyQuestionModels[i].isDisabled = true;
          }
        }
      }
      for (var i = 0; i < result.surveyQuestionModels.length; i++) {
        this.actualSurveyQuestionModels.push(result.surveyQuestionModels[i])
      }
    });
  }

  SetIsChecked(row, event) {
    row.isChecked = event.checked;
  }

  searchData() {
    if (this.data.parent == "temp") {
      let dataList: SurveyQuestionModel[] = this.actualSurveyQuestionModels;
      if (this.name && this.name != "") {
        dataList = dataList.filter((data: SurveyQuestionModel) => {
          return data.name.indexOf(this.name) > -1;
        })
      }
      this.surveyQuestionSearchModel.surveyQuestionModels = dataList;
    }
    else
      if (this.data.parent == "ques") {
        this.surveyTemplateSearchModel.name = this.name;
        this.surveyTemplateService.getSurveyTemplateList(this.surveyTemplateSearchModel).subscribe(result => {
          this.surveyTemplateSearchModel = result;
        });
      }
  }

  questionTemplateModel: any = { id: "00000000-0000-0000-0000-000000000000", name: "", description: "", isPrivate: false, surveyQuestionMappings: [], type: "" };

  UpdatesurveyTemplateModels(row, event) {
    row.isChecked = event.checked;
  }

  SaveWithoutTemplateMap() {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove List",
      "message": "Are you sure you want to continue without tagging template?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Yes",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "No"
        }
      },
      "dismissible": true
    });
    dialogRef.addPanelClass('confirmation-dialog');
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.SaveQuestion(true);
      }
    });
  }

  SaveQuestion(isTemplateAdded) {
    if (this.data.parent == "temp") {
      //cal template api
      //this.dialogRef.close(this.surveyQuestionSearchModel.surveyQuestionModels);
      if (this.surveyQuestionSearchModel.surveyQuestionModels.length > 0) {
        let data: any = [];
        data = this.surveyQuestionSearchModel.surveyQuestionModels.filter(i => i.isChecked == true && i.isDisabled == false)
        this.dialogRef.close(data);
      }
    }
    else
      if (this.data.parent == "ques") {
        this.isSaved = true;
        //cal quest api
        let selectedtemplate: any = [];
        for (let a of this.surveyTemplateSearchModel.surveyTemplateModels) {
          if (a.isChecked == true) {
            selectedtemplate.push(a);
          }
        }
        this.questionTemplateModel.surveyQuestionMappings = selectedtemplate;

        if (isTemplateAdded == true) {
          //add selected templae t0 questionTemplateModel which are checked 
        }

        this.surveyTemplateService.SaveSurveyQuestion(this.questionTemplateModel).subscribe(result => {

          if (result) {
            Swal.fire({
              icon: 'success',
              title: "Survey Question Added successfully",
              showConfirmButton: false,
              timer: 1000
            })
          }

          this.surveyQuestionContext && this.surveyQuestionContext.FetchBasicData();
          this.questionTemplateModel.surveyTemplateModels = result;
          this.isSaved = false;
          this.dialogRef.close();

        });
      }
  }

  AddSurveyTemplate() {
    if (this.questionTemplateModel.name && this.questionTemplateModel.name !== '' && this.questionTemplateModel.description && this.questionTemplateModel.description !== '') {
      this.isSaved = true;
      this.surveyTemplateService.SaveSurveyTemplate(this.questionTemplateModel).subscribe(result => {

        if (result) {
          Swal.fire({
            icon: 'success',
            title: this.neweditTextTemplate,
            showConfirmButton: false,
            timer: 1000
          })
        }

        this.surveyTemplateContext && this.surveyTemplateContext.FetchBasicData();
        this.questionTemplateModel.surveyTemplateModels = result;
        this.isSaved = false;
        this.dialogRef.close();
      });
    }
  }

  //method for go to the second screen
  next() {
    if (this.questionTemplateModel.name && this.questionTemplateModel.name !== '' && this.questionTemplateModel.description && this.questionTemplateModel.description !== '') {
      this.firstScreen = false;
      this.secondScreen = true;
      this.FetchSurveyTempList()
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  clickMethod(name: string) {
    if (confirm("Are you sure to delete " + name)) {
    }
  }

  gotoPreviousOverlay() {
    this.firstScreen = true;
    this.secondScreen = false;
  }

}