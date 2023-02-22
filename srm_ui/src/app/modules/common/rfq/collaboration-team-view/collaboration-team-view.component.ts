import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQCollaborationModel } from 'app/main/Models/etendering/rfq-collaboration-model';
import { RFQCollaborationTeamAccessSearchModel } from 'app/main/Models/etendering/rfq-collaboration-team-access-search-model';
import { RFQCollaborationTeamAccessModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-access-model';
import { RFQCollaborationTeamModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-model';
import { RfqCollaborationService } from 'app/shared/Services/etendering/RFQ/rfq-collaboration.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { AddTeamOverlayComponent } from '../add-team-overlay/add-team-overlay.component';
import { RowData13 } from '../rfq.component';
import { AddCollaborationTeamOverlayComponent } from '../add-collabteam-overlay/add-collabteam-overlay.component';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-collaboration-team-view',
  templateUrl: './collaboration-team-view.component.html',
  styleUrls: ['./collaboration-team-view.component.scss']
})
export class CollaborationTeamViewComponent implements OnInit {

  @Input() dataSource13: MatTableDataSource<RowData13>;
  @Input() displayedColumn13: string[];
  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;

  rfqCollaborationModel: RFQCollaborationModel[] = [];
  rfqCollaborationTeaamModel: RFQCollaborationTeamModel[] = [];
  rfqCollaborationTeamAccessModel: RFQCollaborationTeamAccessModel[] = [];
  rfqCollaborationTeamAccessDelete: RFQCollaborationTeamAccessModel[] = [];
  // rfqCollaborationTeamAccessSearchModel:any={"rfqId":"","rfqCollaborationTeamAccessModel":[],"data":[]};
  rfqCollaborationTeamAccessSearchModel: RFQCollaborationTeamAccessSearchModel = new RFQCollaborationTeamAccessSearchModel();

  Message: string;
  pageEvent: PageEvent;

  constructor(public dialog: MatDialog, private rfqCollaborationService: RfqCollaborationService, private _fuseAlertService: FuseAlertService
    , private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {

    // this.rfqCollaborationTeamAccessModel.pageSize=10;
    // this.rfqCollaborationTeamAccessModel.page=1;
  }


  ngOnInit(): void {
    this.getRFQCollaborationTeamAccessByRFQID();
    this.dismiss("successerror");
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  getRFQCollaborationTeamAccessByRFQID() {
    //debugger;
    this.rfqCollaborationTeamAccessSearchModel.rfqid = this.RFQID;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

    this.rfqCollaborationService.getRFQCollaborationTeamAccessByRFQID(this.rfqCollaborationTeamAccessSearchModel).subscribe(result => {
      refference.close();
      this.rfqCollaborationTeamAccessSearchModel = result.data;
      // console.log(this.rfqCollaborationTeamAccessSearchModel );
      this.rfqCollaborationTeamAccessSearchModel.rfqCollaborationTeamAccessModel.forEach(x => {
        if (x.isView && x.isEdit) {
          x.isFull = true;
        }
        if (x.substituteUserId == "00000000-0000-0000-0000-000000000000") {
          x.substituteUsername = "";
        }
        else {
          x.substituteUsername = x.substituteUserModel.employeeName;
        }
      }
      );

    });
  }



  deleteTeamMember(ctaModel: any) {
    debugger;
    this.rfqCollaborationTeamAccessDelete.push(ctaModel);

    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Team Member",
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.Message = "Deleted";

        this.rfqCollaborationService.deleteRFQCollaborationTeamAccessByID(this.rfqCollaborationTeamAccessDelete).subscribe(result => {
          this.getRFQCollaborationTeamAccessByRFQID();
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 3000); */
          this.openSnackBar(this.Message);
          this.rfqCollaborationTeamAccessDelete = [];
        });
      }
    });
  }


  /**
* Dismiss the alert via the service
*
* @param name
*/
  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }
  /**
  * Show the alert via the service
  *
  * @param name
  */
  show(name: string): void {
    this._fuseAlertService.show(name);
  }
  editTeamMember(ctaModel: any) {
    const dialogRef = this.dialog.open(AddTeamOverlayComponent, { data: { "rfqId": this.RFQID, "colTeamAccessModel": ctaModel, "overlayTxt": "Edit Collaboration Team Member" } });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getRFQCollaborationTeamAccessByRFQID();
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000); */

      this.openSnackBar(this.Message);
    });
  }

  addTeamMember() {
    const dialogRef = this.dialog.open(AddTeamOverlayComponent, { data: { "rfqId": this.RFQID, "overlayTxt": "Add Collaboration Team Member" } });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getRFQCollaborationTeamAccessByRFQID();
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000); */

      this.openSnackBar(this.Message);
    });
  }

  addTeam() {
    const dialogRef = this.dialog.open(AddCollaborationTeamOverlayComponent, { data: { "rfqId": this.RFQID, "overlayTxt": "Add Re-usable Team" } });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getRFQCollaborationTeamAccessByRFQID();
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000); */

      this.openSnackBar(this.Message);
    });
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfqCollaborationTeamAccessSearchModel.pageSize = event.pageSize;
    this.rfqCollaborationTeamAccessSearchModel.page = page;
    this.getRFQCollaborationTeamAccessByRFQID();

  }
}
