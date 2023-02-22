import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditOverlayComponent } from '../add-edit-overlay/add-edit-overlay.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { CollaborationTeamService } from 'app/shared/Services/etendering/collaboration-team.service';
import { CollaborationTeamTextViewModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-view-model';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseAlertService } from '@fuse/components/alert';
import { AddTeamOverlayComponent } from '../add-team-overlay-basicdata/add-team-overlay.component';


@Component({
    selector     : 'col-list-detail',
    templateUrl  : './list-detail.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ListDetailComponent
{
    
  
  Message: string;
  pageEvent:PageEvent;
  
  constructor(public dialog: MatDialog,  private _fuseAlertService: FuseAlertService
    , private _fuseConfirmationService: FuseConfirmationService) { 
    
      // this.rfqCollaborationTeamAccessModel.pageSize=10;
      // this.rfqCollaborationTeamAccessModel.page=1;
  }

  
  ngOnInit(): void {
    this.getRFQCollaborationTeamAccessByRFQID();
    this.dismiss("successerror");
  }

  getRFQCollaborationTeamAccessByRFQID(){
   /*  //debugger;
    this.rfqCollaborationTeamAccessSearchModel.rfqid=this.RFQID;
    this.rfqCollaborationService.getRFQCollaborationTeamAccessByRFQID(this.rfqCollaborationTeamAccessSearchModel).subscribe(result => {
      this.rfqCollaborationTeamAccessSearchModel = result.data;
     console.log(this.rfqCollaborationTeamAccessSearchModel );
      this.rfqCollaborationTeamAccessSearchModel.rfqCollaborationTeamAccessModel.forEach(x=>{
        if(x.isView && x.isEdit){
          x.isFull = true;
        }
        if(x.substituteUserId=="00000000-0000-0000-0000-000000000000"){
          x.substituteUsername="";
        }
        else{
          x.substituteUsername=x.substituteUserModel.employeeName;
        }
      }
      );
      
    });    */
  }



 /*  deleteTeamMember(ctaModel: any){
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
          this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 3000);
          this.rfqCollaborationTeamAccessDelete = [];
        });
      }
    });    
} */


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
  editTeamMember(ctaModel: any){
   /*  const dialogRef = this.dialog.open(AddTeamOverlayComponent,{data:{"rfqId":this.RFQID, "colTeamAccessModel": ctaModel,"overlayTxt":"Edit Collaboration Team Member"}});
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getRFQCollaborationTeamAccessByRFQID();
      this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000);
    }); */
  }

  addTeamMember() {
   /*  const dialogRef = this.dialog.open(AddTeamOverlayComponent,{data:{"rfqId":this.RFQID,"overlayTxt":"Add Collaboration Team Member"}});
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.getRFQCollaborationTeamAccessByRFQID();
      this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000);
    }); */
  }


  /* OnPaginateChange(event:PageEvent)
  {    
      let page=event.pageIndex;
      let size=event.pageSize;
      page=page+1;   
      this.rfqCollaborationTeamAccessSearchModel.pageSize=event.pageSize;
      this.rfqCollaborationTeamAccessSearchModel.page=page;
      this.getRFQCollaborationTeamAccessByRFQID();
      
  } */
}
/** Builds and returns a new createNewRow. */


