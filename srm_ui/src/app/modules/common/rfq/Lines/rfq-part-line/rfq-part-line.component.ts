import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTermsOverlayComponent } from 'app/modules/common/rfq/add-terms-overlay/add-terms-overlay.component';
import { AddSurveyOverlayComponent } from 'app/modules/common/rfq/add-survey-overlay/add-survey-overlay.component';
import { AddSurveyQuestionOverlayComponent } from 'app/modules/common/rfq/add-survey-question-overlay/add-survey-question-overlay.component';
import { CreateSurveyQuestionOverlayComponent } from 'app/modules/common/rfq/create-survey-question-overlay/create-survey-question-overlay.component';
import { AddSupplierOverlayComponent } from 'app/modules/common/rfq/add-supplier-overlay/add-supplier-overlay.component';
import { AddTeamOverlayComponent } from 'app/modules/common/rfq/add-team-overlay/add-team-overlay.component';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { EditRfqPartLineOverlayComponent } from 'app/modules/common/rfq/Lines/rfq-part-line/edit-rfq-part-line-overlay/edit-rfq-part-line-overlay.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { AddNewLineOverlayComponent } from '../../add-new-line-overlay/add-new-line-overlay.component';

@Component({
  selector: 'app-rfq-part-line',
  templateUrl: './rfq-part-line.component.html',
  styleUrls: ['./rfq-part-line.component.scss']
})
export class RfqPartLineComponent implements OnInit {

  @Input() RFQID: any;
  RFQPartLineID: any;
  @Input() RFQModel: RFQViewModel;

  constructor(public dialog: MatDialog, private rfqPartLineService: RfqPartLineService) { }

  toggleDisplay(id: string, obj) {
    var existingVal = this.detailsDisplayMap.get(id);
    if (existingVal) {
      this.detailsDisplayMap.set(id, !existingVal)
    } else {
      this.detailsDisplayMap.set(id, true)
    }
    obj.isShow = !obj.isShow;
  }

  detailsDisplayMap = new Map();

  getActiveDetailsTab(id: string): boolean {
    return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
  }

  rfqPartLines: any[] = [];
  subProjects: any[] = [];
  activities: any[] = [];

  selectedTabIndexLines: any = 0;

  ngOnInit(): void {
    this.FetchBasicData();
  }

  FetchBasicData() {
    if (this.RFQID) {
      const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

      this.rfqPartLineService.getPartLineByPartLineRFQId(this.RFQID).subscribe((result: any) => {
        refference.close();
        this.rfqPartLines = result.data;
        if (this.rfqPartLines.length > 0) {
          this.subProjects = this.rfqPartLines[0].subProjects;
          this.activities = this.rfqPartLines[0].activities;
        }
      });
    }
  }

  updateRFQPartline(model: any) {
    this.rfqPartLineService.SaveRFQPartLine(model).subscribe(result => {
      //this.Message = "Updated";
      //this.show("successerror");
    });
  }

  EditLine(partLine: any) {
    if (this.RFQModel.isManual) {
      const dialogRef = this.dialog.open(AddNewLineOverlayComponent, { data: { "id": partLine.id } });
      dialogRef.addPanelClass('inline-md-overlay');
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {        
        if (result.event == 'Save') {        
          result.data.rfqId = this.RFQID;
          this.rfqPartLineService.SaveRFQPartLine(result.data).subscribe(result => {
            this.FetchBasicData();
          });
        }        
      });
    } else {
      const dialogRef = this.dialog.open(EditRfqPartLineOverlayComponent, { data: { "id": partLine.id, "rfqId": this.RFQID } });
      dialogRef.addPanelClass('inline-md-overlay');
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        if (dialogRef.componentInstance.isAdded) {
          this.FetchBasicData();
        }
      });
    }
  }

  isShow2 = true;
  toggleDisplay2() {
    this.isShow2 = !this.isShow2;
  }

  addTerms() {
    const dialogRef = this.dialog.open(AddTermsOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addSurveyTemplate() {
    const dialogRef = this.dialog.open(AddSurveyOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addSurveyQuestion() {
    const dialogRef = this.dialog.open(AddSurveyQuestionOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  createSurveyQuestion() {
    const dialogRef = this.dialog.open(CreateSurveyQuestionOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addSupplier() {
    const dialogRef = this.dialog.open(AddSupplierOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addTeamMember() {
    const dialogRef = this.dialog.open(AddTeamOverlayComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addNewLine() {
    const dialogRef = this.dialog.open(AddNewLineOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Save') {
        result.data.rfqId = this.RFQID;
        result.data.lineNumber = this.rfqPartLines.length + 1;
        this.rfqPartLineService.SaveRFQPartLine(result.data).subscribe(result => {
          this.FetchBasicData();
        });
      }      
    });
  }

  getSubProject(subProjectId: string) {
    let name = subProjectId;
    this.subProjects.forEach(element => {
      if (element.id == subProjectId) {
        name = element.name;
      }
    });
    return name;
  }

  getActivity(activityId: string) {
    let activity = activityId;
    this.activities.forEach(element => {
      if (element.id == activityId) {
        activity = element.text;
      }
    });
    return activity;
  }

  ngAfterViewInit(){
    this.selectedTabIndexLines  = localStorage.getItem('selectedTabIndexLines') || 0;
  }

  changeTab(event) {
    localStorage.setItem('selectedTabIndexLines', event.index); 
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedTabIndexLines');
}
}