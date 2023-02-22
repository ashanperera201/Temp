import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SurveyOverlayComponent } from '../survey-overlay/survey-overlay.component';
import { SurveyTemplateService } from 'app/shared/Services/etendering/survey-template.service';
import { SurveyQuestionSearchModel } from 'app/main/Models/etendering/survey-form-search-model';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
    selector: 'survey-question',
    templateUrl: './survey-question.component.html',
    styleUrls: ['./survey-question.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SurveyQuestionComponent {

    displayedColumns: string[] = ['id', 'template', 'name', 'description', 'type'];

    pageEvent: PageEvent;
    surveyQuestionSearchModel: any = new SurveyQuestionSearchModel();

    actualSurveyQuestionModels: any = [];
    message: string = "";
    name: string;
    type: string = "";

    constructor(public dialog: MatDialog,
        private surveyTemplateService: SurveyTemplateService) {
        this.surveyQuestionSearchModel.pageSize = 10;
        this.surveyQuestionSearchModel.page = 1;
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.surveyQuestionSearchModel.pageSize = size;
        this.surveyQuestionSearchModel.page = page;
        this.FetchBasicData();
        this.searchData();
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.surveyTemplateService.getSurveyQuestionList(this.surveyQuestionSearchModel).subscribe(result => {
            this.surveyQuestionSearchModel = result;

            for (var i = 0; i < this.surveyQuestionSearchModel.surveyQuestionModels.length; i++) {
                this.surveyQuestionSearchModel.surveyQuestionModels[i].associatedTemplate = "";
                for (var t = 0; t < this.surveyQuestionSearchModel.surveyQuestionModels[i].surveyTemplateModels.length; t++) {
                    this.surveyQuestionSearchModel.surveyQuestionModels[i].associatedTemplate = this.surveyQuestionSearchModel.surveyQuestionModels[i].associatedTemplate + this.surveyQuestionSearchModel.surveyQuestionModels[i].surveyTemplateModels[t].name;
                    if (t + 1 < this.surveyQuestionSearchModel.surveyQuestionModels[i].surveyTemplateModels.length) {
                        this.surveyQuestionSearchModel.surveyQuestionModels[i].associatedTemplate = this.surveyQuestionSearchModel.surveyQuestionModels[i].associatedTemplate + ", ";
                    }
                }
            }
            for (var i = 0; i < result.surveyQuestionModels.length; i++) {
                this.actualSurveyQuestionModels.push(result.surveyQuestionModels[i])
            }
        });
    }

    DeleteSurveyQuestion(model: SurveyQuestionModel[]) {
        Swal.fire({
            title: 'Remove Survey Question',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.surveyTemplateService.DeleteSurveyQuestion([model]).subscribe(result => {
                    Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            this.FetchBasicData();
                        }
                    })
                });
            }
        });
    }

    searchData() {
        if (this.name && this.name != "") {
            this.surveyQuestionSearchModel.surveyQuestionSearchName = this.name;
        }
        else {
            this.surveyQuestionSearchModel.surveyQuestionSearchName = null;
        }

        if (this.type != "") {
            this.surveyQuestionSearchModel.isPrivate = (this.type === "private" ? true : false);
        }
        else {
            this.surveyQuestionSearchModel.isPrivate = null;
        }

        this.FetchBasicData();
    }

    // method for open create question popup
    createQue() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", parent: 'ques', action: 'addassociate', table: 'ques', "context": this, type: 'questionOverlay', "surveyQuestionModels": this.surveyQuestionSearchModel.surveyQuestionModels } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // method for open edit question popup
    editQue(row: any) {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { "id": row.id, parent: 'ques', action: 'edit', "context": this, "surveyQuestionModels": this.surveyQuestionSearchModel.surveyQuestionModels } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}