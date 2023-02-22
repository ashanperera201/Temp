import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import { RFQHeaderServeyQuestionModel } from 'app/main/Models/etendering/rfq-header-survey-question-model';
import { RfqHeaderSurveyFormService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-survey-form.service';
import { AddSurveyOverlayComponent } from '../../add-survey-overlay/add-survey-overlay.component';
import { AddSurveyQuestionOverlayComponent } from '../../add-survey-question-overlay/add-survey-question-overlay.component';
import { CreateSurveyQuestionOverlayComponent } from '../../create-survey-question-overlay/create-survey-question-overlay.component';
import { RFQHeaderSurveyFormsSearchModel } from 'app/main/Models/etendering/rfq-header-survey-forms-search-model';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
  selector: 'app-survey-forms',
  templateUrl: './survey-forms.component.html',
  styleUrls: ['./survey-forms.component.scss']
})
export class SurveyFormsComponent implements OnInit {

  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;

  pageEvent: PageEvent;
  rfqHeaderSurveyQuestion: RFQHeaderServeyQuestionModel[];
  attributeCategoryTypes: any[];
  Message: string;

  detailsDisplayMap = new Map();
  isEditOperation: boolean = false;
  surveyQuestionModelTemp: any;
  isTemplateOperation: boolean = false;

  rfqsearchmodel: RFQHeaderSurveyFormsSearchModel = new RFQHeaderSurveyFormsSearchModel();

  constructor(public dialog: MatDialog,
    private _rfqHeaderSurveyFormService: RfqHeaderSurveyFormService) {
    this.rfqsearchmodel.pageSize = 10;
    this.rfqsearchmodel.page = 1;
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfqsearchmodel.pageSize = size;
    this.rfqsearchmodel.page = page;
    this.fetchRfqHeaderSurveyForms(this.RFQID);
    this.fetchSurveyData(this.RFQID);
  }

  addSurveyTemplate() {
    const dialogRef = this.dialog.open(AddSurveyOverlayComponent, { data: { "rfqId": this.RFQID, "SurveyFormsComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.fetchSurveyData(this.RFQID);
    });
  }

  addSurveyQuestion() {
    const dialogRef = this.dialog.open(AddSurveyQuestionOverlayComponent, { data: { "rfqId": this.RFQID, "SurveyFormsComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.fetchSurveyData(this.RFQID);
    });
  }

  createSurveyQuestion() {
    const dialogRef = this.dialog.open(CreateSurveyQuestionOverlayComponent, { data: { "rfqId": this.RFQID, "SurveyFormsComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editSurveyFormListDetails(model: any) {
    this.isEditOperation = true;
    this.isTemplateOperation = true;
    this.surveyQuestionModelTemp = model;
    this.editSurveyFormList();
    this.isEditOperation = false;
    this.isTemplateOperation = false;
  }

  editSurveyFormList() {
    const dialogRef = this.dialog.open(CreateSurveyQuestionOverlayComponent, { data: { "rfqId": this.RFQID, "surveyTemplateId": this, "rfqsurveyQuestionId": this.surveyQuestionModelTemp.id, "isTemplateOperation": this.isTemplateOperation, "editOperation": this.isEditOperation, "SurveyFormsComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.fetchSurveyData(this.RFQID);
    });
  }

  editSurveyFormItemDetails(model: any) {
    this.isEditOperation = true;
    this.isTemplateOperation = false;
    this.surveyQuestionModelTemp = model;
    this.editSurveyFormList();
    this.isEditOperation = false;
  }

  getactiveDetailsTab(id: string): boolean {
    return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
  }

  ngOnInit(): void {
    this.fetchRfqHeaderSurveyForms(this.RFQID);
    this.fetchSurveyData(this.RFQID);
  }


  fetchRfqHeaderSurveyForms(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
   
    this._rfqHeaderSurveyFormService.GetRFQSurveyQuestionByRFQId(this.RFQID).subscribe(result => {
      refference.close();
      this.rfqHeaderSurveyQuestion = result.data;

      if (this.rfqHeaderSurveyQuestion.length > 0) {
        this.attributeCategoryTypes = this.rfqHeaderSurveyQuestion[0].attributeCategories;
      }
    });
  }

  DeleteSurveyTemplate(model: RFQQuestionModel[]) {
    Swal.fire({
      title: 'Remove Survey Template',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this._rfqHeaderSurveyFormService.DeleteRFQSurveyTemplate(model).subscribe(result => {
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.fetchRfqHeaderSurveyForms(this.RFQID);
              this.fetchSurveyData(this.RFQID);
            }
          })
        });
      }
    });
  }

  DeleteSurveyQuestion(model: RFQHeaderServeyQuestionModel[]) {
    Swal.fire({
      title: 'Remove Survey Template',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this._rfqHeaderSurveyFormService.DeleteSurveyQuestions([model]).subscribe(result => {
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.fetchRfqHeaderSurveyForms(this.RFQID);
              this.fetchSurveyData(this.RFQID);
            }
          })
        });
      }
    });
  }

  SaveSurveyQuestion(model: any, update: string) {
    if (update == 'RE') {
      model.isCategorySave = true;
    } else if (update == 'DT') {
      model.isSupplierSave = true;
    }
    model.rfxId = this.RFQID;
    let rfqHeaderAttributes: RFQHeaderServeyQuestionModel[] = [];
    rfqHeaderAttributes.push(model);
    this._rfqHeaderSurveyFormService.SaveRFQSurveyQuestionTemplate(rfqHeaderAttributes).subscribe(result => {
      if (result) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "RFQ Survey Question Updated successfully",
          showConfirmButton: false,
          timer: 1000
        })
      }
      this.fetchRfqHeaderSurveyForms(this.RFQID);
    });

  }

  toggleDisplay(id: string) {
    var existingVal = this.detailsDisplayMap.get(id);
    if (existingVal) {
      this.detailsDisplayMap.set(id, !existingVal)
    } else {
      this.detailsDisplayMap.set(id, true)
    }
  }

  fetchSurveyData(rfqId: string) {
    this.RFQID = rfqId;
    this.rfqsearchmodel.RFQId = this.RFQID;
    this._rfqHeaderSurveyFormService.GetRFQHeaderSurveyByRFQ(this.rfqsearchmodel).subscribe(result => {
      this.rfqsearchmodel = result.data;
    });
  }

}
