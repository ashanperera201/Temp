import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RFXSearchModel } from 'app/main/Models/etendering/rfx-search-model';
import { RFXViewModel } from 'app/main/Models/etendering/ViewModels/rfx-view-model';
import { Sort } from '@angular/material/sort';
import { RFXService } from 'app/shared/Services/etendering/rfx.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { Router } from '@angular/router';
import { Terms1Component } from 'app/modules/common/terms1/terms1.component';
import Swal from 'sweetalert2';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ReassignOwnerDialogComponent } from 'app/modules/common/rfq/reassign-owner-dialog/reassign-owner-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'rfx',
  templateUrl: './rfx.component.html',
  styleUrls: ['./rfx.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RfxComponent {
  displayedColumns: string[] = ['id', 'number', 'revision', 'type', 'name', 'created', 'startDate', 'endDate', 'status'];
  dataSource: RFXSearchModel = null;
  rfxType: string = "RFQ";
  Message: string;
  selected: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //RFXNo: string = "";
  revision: string = "";
  type: string = "";
  panelOpenState = false;
  resultsLength: any;
  pageEvent: PageEvent;
  dataId: any = "";
  issuccess = false;
  iserror = false;
  rfx: RFXViewModel[];
  searchrfxNo: string = "";

  rfxSearchModel: RFXSearchModel = new RFXSearchModel();
  numberingSequenceService: any;

  rfxlist :any = [];

  /**
   * Constructor
   */
  constructor(public dialog: MatDialog, public datepipe: DatePipe,
    private rfxService: RFXService, private router: Router,private rfqService: RfqService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService) {
    this.rfxSearchModel.pageSize = 10;
    this.rfxSearchModel.page = 1;
  }

  OpenNextStepURL(url) {
    this.router.navigateByUrl(url, { state: { name: null, description: null, type: null, negotiation: null, biding: null, currency: null } });
  }

  OpenURL(url, row) {
    localStorage.setItem('selectedTabIndexRFQ', "0");
    this.router.navigateByUrl(url + "/" + row.id, { state: { Id: row.id } });
  }

  copyRFQ(row) {    
    Swal.fire({
        title: 'Do you want to Duplicate?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Duplicate",
        denyButtonText: 'Cancel',
    }).then((result) => {
        this.rfqService.copyRFQ(row.id).subscribe(result => {           
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "Duplicated successfully",
                showConfirmButton: false,
                timer: 1000
            });
            this.FetchBasicData(); 
        });
    });
  }
   
  search(){
    // debugger;
    console.log("---------",this.rfxSearchModel.startDate);
    let dataList = this.rfxlist;
    console.log("---------datalist",dataList);
    // if(this.searchrfxNo && this.searchrfxNo !=""){
    //   dataList = dataList.filter(x => {
    //     return x.rfxNo.toLowerCase().includes(this.searchrfxNo.toLowerCase());
    //   })
    // }  

    this.rfxSearchModel = dataList;
  }

  SearchData(fielsName, fieldData) {
    //debugger;

    if (fielsName == "rfxNo") {
      this.rfxSearchModel.rfxNo = fieldData.value;
    }
    else if (fielsName == "revision") {
      this.rfxSearchModel.Revision = fieldData.value;
    }
    else if (fielsName == "rfxType") {
      this.rfxSearchModel.rFxType = fieldData.value;
    }
    else if (fielsName == "rfxName") {
      this.rfxSearchModel.rfxName = fieldData.value;
    }
    // else if(fielsName=="created")
    // {
    //   this.rfxSearchModel.RFXNumber=fieldData.value;
    // }
    // else if(fielsName=="startDate")
    // {
    //   this.rfxSearchModel.RFXNumber=fieldData.value;
    // }
    // else if(fielsName=="endDate")
    // {
    //   this.rfxSearchModel.RFXNumber=fieldData.value;
    // }
    else if (fielsName == "status") {
      this.rfxSearchModel.statusName = fieldData.value;
    }

    this.FetchBasicData();
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfxSearchModel.pageSize = event.pageSize;
    this.rfxSearchModel.page = page;
    this.fetchRFXData("RFQ", "type");
  }

  sortData(sort: Sort) {
    this.rfxSearchModel.direction = sort.direction;
    this.rfxSearchModel.column = sort.active;
    this.FetchBasicData();
  }

  FetchBasicData() {   

    this.rfxService.getRFQList(this.rfxSearchModel).subscribe(result => {
      this.rfxSearchModel = result;
      this.rfxlist = result;   

    })
  }

  fetchRFXData(type: string, parameterType: any) {
    if (parameterType == 'type') {
      this.rfxSearchModel.rFxType = type;
      this.rfxSearchModel.statusName = "";
    }
    else if (parameterType == 'status') {
      this.rfxSearchModel.statusName = type;
      this.rfxSearchModel.rFxType = "";
    }
    this.FetchBasicData();
  }

  openTerms(): void {
    const dialogRef = this.dialog.open(Terms1Component, {
      width: '100%',
      height: 'auto',
      data: {
        parent: 'rfx'
      }
    });
  }

  ngOnInit() {
    this.fetchRFXData(this.rfxType, 'type');
  }

  rfxChange($event) {

    if ($event.index === 0) {
      this.fetchRFXData("RFQ", "type");
    }
    if ($event.index === 1) {
      this.fetchRFXData("RFI", "type");
    }
    if ($event.index === 2) {
      this.fetchRFXData("RFAQ", "type");
    }
    if ($event.index === 3) {
      this.fetchRFXData("Draft", "status");
    }
    if ($event.index === 4) {
      this.fetchRFXData("Published", "status");
    }
    if ($event.index === 5) {
      this.fetchRFXData("Awarded", "status");
    }
    if ($event.index === 6) {
      this.fetchRFXData("Revised", "status");
    }
  }

  DeleteRFX(model: RFXViewModel[]) {

    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove contact",
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

        this.rfxService.DeleteItem([model]).subscribe(result => {
          this.Message = "Deleted";
          this.fetchRFXData(this.rfxType, 'type');
          this.show("successerror");

        });
      }
    });

  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  changeSelected(e) {
    this.selected = e.value;
  }

  openUserList(rfq)
  {
    const dialogRef = this.dialog.open(ReassignOwnerDialogComponent, { data: { "rfqId": rfq.id,"rfqModel":rfq } });
    dialogRef.disableClose=true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
    
  }
  getStatusName(statusName)
  {
    if(statusName=="Send for Approval")
    {
return "Sent for Approval";
    }else if(statusName=="Award Send for Approval")
    {
      return "Award Sent for Approval";
    }
    else 
    {
      return statusName;
    }
  }
}

