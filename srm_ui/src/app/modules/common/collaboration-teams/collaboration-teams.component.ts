import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { CollaborationTeamService } from 'app/shared/Services/etendering/collaboration-team.service';
import { CollaborationTeamTextViewModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-view-model';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseAlertService } from '@fuse/components/alert';
import { AddTeamOverlayComponent } from './add-team-overlay-basicdata/add-team-overlay.component';

@Component({
  selector: 'collaboration-teams',
  templateUrl: './collaboration-teams.component.html',
  styleUrls: ['./collaboration-teams.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CollaborationTeamsComponent {

  displayedColumns: string[] = ['id', 'teamname', 'teamdescription', 'isprivate'];
  dataSource: CollaborationTeamSearchModel = null;

  pageEvent: PageEvent;
  @ViewChild(MatSort) sort: MatSort;

  panelOpenState = false;
  resultsLength: any;
  Message: any = "";
  /**
   * Constructor
   */
  collaborationTeamSearchModel: CollaborationTeamSearchModel = new CollaborationTeamSearchModel();

  constructor(public dialog: MatDialog, private collaborationTeamService: CollaborationTeamService, private _fuseConfirmationService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService) {
    this.collaborationTeamSearchModel.pageSize = 10;
    this.collaborationTeamSearchModel.page = 1;
  }

  EditTeam(row: any) {
    const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.id, "colTeamAccessModel": row, "overlayTxt": "Edit Collaboration Team/s", "addNew": false } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.FetchBasicData();
    });
  }

  AssignUser(row: any) {
    const dialogRef = this.dialog.open(AddTeamOverlayComponent, { data: { "id": row.id } });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.collaborationTeamSearchModel.pageSize = event.pageSize;
    this.collaborationTeamSearchModel.page = page;
    this.FetchBasicData();
  }

  sortData(sort: Sort) {
    this.collaborationTeamSearchModel.direction = sort.direction;
    this.collaborationTeamSearchModel.column = sort.active;
    this.FetchBasicData();
  }

  FetchBasicData() {
    this.collaborationTeamService.getCTList(this.collaborationTeamSearchModel).subscribe(result => {
      this.collaborationTeamSearchModel = result;
    });
  }

  ngOnInit() {
    this.FetchBasicData();
  }

  DeleteCT(model: CollaborationTeamTextViewModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Team",
      "message": "Are you sure you want to delete this record?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Remove",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": true
    });
    dialogRef.addPanelClass('confirmation-dialog');

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.collaborationTeamService.DeleteItem([model]).subscribe(result => {
          this.Message = "Deleted";
          this.FetchBasicData();
          this.show("successerror");
        });
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "overlayTxt": "Add Collaboration Team/s", "addNew": true } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Message = "Added";
        this.show("successerror");
        this.FetchBasicData();
      }
      this.FetchBasicData();
    });
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }
}