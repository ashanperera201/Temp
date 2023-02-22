import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SurveyOverlayComponent } from '../survey-overlay/survey-overlay.component';
import { SurveyTemplateService } from 'app/shared/Services/etendering/survey-template.service';
import { SurveyTemplateModel } from 'app/main/Models/etendering/survey-template-model';
import { SurveyTemplateSearchModel } from 'app/main/Models/etendering/survey-template-search-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'survey-template',
    templateUrl: './survey-template.component.html',
    styleUrls: ['./survey-template.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SurveyTemplateComponent {
    displayedColumns: string[] = ['id', 'name', 'description', 'type'];
    pageEvent: PageEvent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    surveyTemplateSearchModel: any = new SurveyTemplateSearchModel();
    actualSurveyTemplateModels: any = [];
    message: string = "";
    name: string;
    description: string;
    type: string = "";

    constructor(public dialog: MatDialog,
        private surveyTemplateService: SurveyTemplateService,
        private router: Router) {
        this.surveyTemplateSearchModel.pageSize = 10;
        this.surveyTemplateSearchModel.page = 1;
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.surveyTemplateSearchModel.pageSize = size;
        this.surveyTemplateSearchModel.page = page;
        this.FetchBasicData();
    }

    sortData(sort: Sort) {
        this.surveyTemplateSearchModel.direction = sort.direction;
        this.surveyTemplateSearchModel.column = sort.active;
        this.FetchBasicData();
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.surveyTemplateService.getSurveyTemplateList(this.surveyTemplateSearchModel).subscribe(result => {
            this.surveyTemplateSearchModel = result;

            if (result.surveyTemplateModels) {
                for (var i = 0; i < result.surveyTemplateModels.length; i++) {
                    this.actualSurveyTemplateModels.push(result.surveyTemplateModels[i])
                }
            }
        });
    }

    searchData() {
        if (this.name && this.name != "") {
            this.surveyTemplateSearchModel.name = this.name;
        }
        else {
            this.surveyTemplateSearchModel.name = null;
        }

        if (this.description && this.description != "") {
            this.surveyTemplateSearchModel.description = this.description;
        }
        else {
            this.surveyTemplateSearchModel.description = null;
        }

        if (this.type != "") {
            this.surveyTemplateSearchModel.isPrivate = (this.type === "private" ? true : false);
        }
        else {
            this.surveyTemplateSearchModel.isPrivate = null;
        }

        this.FetchBasicData();
    }

    DeleteSurveyTemplate(model: SurveyTemplateModel[]) {
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
                this.surveyTemplateService.DeleteSurveyTemplate([model]).subscribe(result => {
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

    // method for open create template popup
    createTemp() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", parent: 'temp', action: 'create', "context": this, "surveyTemplateModels": this.surveyTemplateSearchModel.surveyTemplateModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    createTemps() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000" } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // method for open edit template popup
    editTemp(row: any) {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { parent: 'temp', action: 'edit', "id": row.id, "context": this, "surveyTemplateModels": this.surveyTemplateSearchModel.surveyTemplateModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // method for open create Question popup
    createQue() {
        const dialogRef = this.dialog.open(SurveyOverlayComponent, { data: { parent: 'ques', action: 'create', firstscreen: 'false' } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    OpenURL(url, row) {
        this.router.navigateByUrl(url, { state: { Id: row.id } });
    }
}