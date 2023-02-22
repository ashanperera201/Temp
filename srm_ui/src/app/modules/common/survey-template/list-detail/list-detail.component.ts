import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SurveyTemplateItemSearchModel } from 'app/main/Models/etendering/survey-template-item-search-model';
import { SurveyQuestionModel } from 'app/main/Models/etendering/ViewModels/survey-question-view-model';
import { SurveyTemplateService } from 'app/shared/Services/etendering/survey-template.service';
import Swal from 'sweetalert2';
import { SurveyOverlayComponent } from '../../survey-overlay/survey-overlay.component';

@Component({
    selector: 'rfx',
    templateUrl: './list-detail.component.html',
    styleUrls: ['./list-detail.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ListDetailComponent {

    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;
    displayedColumns: string[] = ['id', 'name', 'description'];

    dataId: any = "";
    surveyTemplateItemSearchModel: SurveyTemplateItemSearchModel = new SurveyTemplateItemSearchModel();

    surveyTemplateID: any;
    dataTypeList: any = [];
    actualSurveyTemplateModels: any = [];
    Message: string = "";

    quesname: string;
    quesdescription: string;
    type: string = "";
    questionMappingType: string = "questionMappingOverlay";

    constructor(
        public dialog: MatDialog,
        private surveyTemplateService: SurveyTemplateService,
        private router: Router) {
        this.surveyTemplateID = this.router.getCurrentNavigation().extras.state.Id;
        this.surveyTemplateItemSearchModel.pageSize = 10;
        this.surveyTemplateItemSearchModel.page = 1;
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.surveyTemplateItemSearchModel.pageSize = size;
        this.surveyTemplateItemSearchModel.page = page;
        this.searchData();
    }

    sortData(sort: Sort) {
        this.surveyTemplateItemSearchModel.direction = sort.direction;
        this.surveyTemplateItemSearchModel.column = sort.active;
        this.FetchBasicData();
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.surveyTemplateItemSearchModel.id = this.surveyTemplateID
        this.surveyTemplateService.GetSurveyQuestionMappingBySurveyByTempId(this.surveyTemplateItemSearchModel).subscribe(result => {
            this.surveyTemplateItemSearchModel = result.data;

            if (!this.surveyTemplateItemSearchModel.surveyQuestions) {
                this.surveyTemplateItemSearchModel.surveyQuestions = [];
            }
            for (var i = 0; i < result.data.surveyQuestions.length; i++) {
                this.actualSurveyTemplateModels.push(result.data.surveyQuestions[i]);
            }
        });
    }

    searchData() {
        if (this.quesname && this.quesname != "") {
            this.surveyTemplateItemSearchModel.name = this.quesname;
        }
        else {
            this.surveyTemplateItemSearchModel.name = null;
        }

        if (this.quesdescription && this.quesdescription != "") {
            this.surveyTemplateItemSearchModel.description = this.quesdescription;
        }
        else {
            this.surveyTemplateItemSearchModel.description = null;
        }

        if (this.type != "") {
            this.surveyTemplateItemSearchModel.isPrivate = (this.type === "private" ? true : false);
        }
        else {
            this.surveyTemplateItemSearchModel.isPrivate = null;
        }

        this.FetchBasicData();
    }

    Delete(model: SurveyQuestionModel[]) {
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

                this.actualSurveyTemplateModels = [];
                this.actualSurveyTemplateModels.push(model);

                for (var i = 0; i < this.actualSurveyTemplateModels.length; i++) {
                    this.actualSurveyTemplateModels[i].surveyTemplateId = this.surveyTemplateID;
                    this.actualSurveyTemplateModels[i].isDeleted = true;
                    this.actualSurveyTemplateModels[i].isChecked = false;
                }

                this.surveyTemplateService.DeleteSurveyQuestionMapping(this.surveyTemplateItemSearchModel.surveyQuestions).subscribe(result => {
                    Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            this.searchData();
                        }
                    })
                });
            }
        });

        // const dialogRef = this._fuseConfirmationService.open({
        //     "title": "Remove List",
        //     "message": "Are you sure you want to delete this record?",
        //     "icon": {
        //         "show": true,
        //         "name": "heroicons_outline:exclamation",
        //         "color": "warn"
        //     },
        //     "actions": {
        //         "confirm": {
        //             "show": true,
        //             "label": "Remove",
        //             "color": "warn"
        //         },
        //         "cancel": {
        //             "show": true,
        //             "label": "Cancel"
        //         }
        //     },
        //     "dismissible": true
        // });
        // dialogRef.addPanelClass('confirmation-dialog');
        // dialogRef.afterClosed().subscribe((result) => {
        //     if (result == "confirmed") {
        //         for (var kk = 0; kk < this.actualCostFactorModels.length; kk++) {
        //             if (row.id == this.actualCostFactorModels[kk].id) {
        //                 this.actualCostFactorModels[kk].isChecked = false;
        //             }
        //         }
        //         var attributeIndex = -1;
        //         for (var kk = 0; kk < this.surveyTemplateModel.surveyQuestions.length; kk++) {
        //             if (row.id == this.surveyTemplateModel.surveyQuestions[kk].id) {
        //                 attributeIndex = kk;
        //             }
        //         }
        //         this.surveyTemplateModel.surveyQuestions = this.surveyTemplateModel.surveyQuestions.filter(obj => obj.id !== row.id);
        //         row.IsChecked = false;
        //         this.Message = "Deleted";
        //         this.show("successerror");
        //         setTimeout(() => { this.dismiss("successerror") }, 3000);
        //     }
        // });
    }

    saveChanges() {
        for (var i = 0; i < this.actualSurveyTemplateModels.length; i++) {
            this.actualSurveyTemplateModels[i].surveyTemplateId = this.surveyTemplateID;
            this.actualSurveyTemplateModels[i].type = this.questionMappingType;
        }
        this.surveyTemplateService.SaveSurveyQuestionMapping(this.actualSurveyTemplateModels).subscribe(
            result => {
                Swal.fire({
                    icon: 'success', title: "Survey Question Added successfully", showConfirmButton: false, timer: 1000
                })
                //this.FetchBasicData();
                this.searchData();
            }
        );
    }

    // method for open create question popup
    createQue() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { AddedTempalte: this.surveyTemplateItemSearchModel, parent: 'temp', table: 'temp', firstscreen: 'false', "surveyTemplateModels": this.surveyTemplateItemSearchModel.surveyQuestions } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {

            if (result) {
                this.actualSurveyTemplateModels = [];
                for (var kk = 0; kk < result.length; kk++) {
                    this.actualSurveyTemplateModels.push(result[kk]);
                }
                this.saveChanges();
            }

            // let data: any = [];
            // for (var i = 0; i < this.surveyTemplateModel.surveyQuestions.length; i++) {
            //     data.push(this.surveyTemplateModel.surveyQuestions[i]);
            // }

            // for (var i = 0; i < result.length; i++) {
            //     if (result[i].isChecked == true && result[i].isDisabled == false) {
            //         data.push(result[i]);
            //     }
            // }

            // this.surveyTemplateModel.surveyQuestions = [];
            // this.surveyTemplateModel.surveyQuestions = data;
            // this.actualCostFactorModels = data;
        });
    }

    // method for open edit question popup
    editQue() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { parent: 'temp', action: 'edit' } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    goBack() {
        this.router.navigate(['/survey-template']);
    }
}

