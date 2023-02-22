import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RFXSearchModel } from 'app/main/Models/etendering/rfx-search-model';
import { RFXViewModel } from 'app/main/Models/etendering/ViewModels/rfx-view-model';
import { Sort } from '@angular/material/sort';
import { RFXService } from 'app/shared/Services/etendering/rfx.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { RFQTemplateViewModel } from 'app/main/Models/etendering/ViewModels/rfq-template-view-model';

@Component({
  selector: 'rfx-templates',
  templateUrl: './rfx-templates.component.html',
  styleUrls: ['./rfx-templates.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RfxTemplatesComponent {
  displayedColumns: string[] = ['id', 'number', 'name', 'type', 'created', 'startDate'];

  rfxType: string = "RFQ";
  Message: string;
  selected: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  revision: string = "";
  type: string = "";
  pageEvent: PageEvent;
  rfx: RFXViewModel[];
  searchrfxNo: string = "";

  rfxSearchModel: RFXSearchModel = new RFXSearchModel();
  rfqTemplateModel: RFQTemplateViewModel[];
  rfxlist: any = [];

  /**
   * Constructor
   */
  constructor(public dialog: MatDialog,
    private rfxService: RFXService,
    private router: Router,
    private rfqService: RfqService) {
    this.rfxSearchModel.pageSize = 10;
    this.rfxSearchModel.page = 1;
  }

  OpenNextStepURL(url) {
    this.router.navigateByUrl(url, { state: { name: null, description: null, type: null, negotiation: null, biding: null, currency: null } });
  }

  OpenURL(url, row) {
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
        this.fetchBasicData();
      });
    });
  }

  search() {
    let dataList = this.rfxlist;

    if (this.searchrfxNo && this.searchrfxNo != "") {
      dataList = dataList.filter(x => {
        return x.rfxNo.toLowerCase().includes(this.searchrfxNo.toLowerCase());
      })
    }

    this.rfxlist = dataList;
  }

  SearchData(fielsName, fieldData) {
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
    else if (fielsName == "status") {
      this.rfxSearchModel.statusName = fieldData.value;
    }

    this.fetchBasicData();
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfxSearchModel.pageSize = size;
    this.rfxSearchModel.page = page;
    this.fetchRFXData("RFQ", "type");
  }

  sortData(sort: Sort) {
    this.rfxSearchModel.direction = sort.direction;
    this.rfxSearchModel.column = sort.active;
    this.fetchBasicData();
  }

  fetchBasicData() {
    this.rfxService.getRFXList(this.rfxSearchModel).subscribe(result => {
      this.rfxSearchModel = result;
      this.rfxlist = result;
      this.search();
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
    this.fetchBasicData();
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

  deleteRFX(model: RFXViewModel[]) {
    Swal.fire({
      title: 'Remove Rfx Template',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rfxService.DeleteItem([model]).subscribe(result => {
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          ).then((result) => {
            if (result.isConfirmed) {
              this.fetchRFXData(this.rfxType, 'type');
            }
          })
        });
      }
    });
  }

  changeSelected(e) {
    this.selected = e.value;
  }

}

