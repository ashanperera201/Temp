
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { IFSEmployeeService } from 'app/shared/Services/etendering/ifs-employee-service';
import { IFSEmployeeSearchModel } from 'app/main/Models/etendering/ifs-employee-search-model';
import { IFSEmployeeModel } from 'app/main/Models/etendering/ViewModels/ifs-employee-model';
import Swal from 'sweetalert2';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';




@Component({
  selector: 'app-reassign-owner-dialog',
  templateUrl: './reassign-owner-dialog.component.html',
  styleUrls: ['./reassign-owner-dialog.component.scss']
})
export class ReassignOwnerDialogComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumn: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;
    rfqModel:RFQViewModel;
    ifsEmployeeSearchModel : IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
    selectedElement:IFSEmployeeModel;
    rfqId: string;
   

    constructor(public dialogRef: MatDialogRef<ReassignOwnerDialogComponent>,
                public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
                private ifsEmployeeService: IFSEmployeeService,private rfqService: RfqService) {
        this.rfqId = data.rfqId;
        this.rfqModel = data.rfqModel;
       

    }
    ngOnInit(): void {
        this.getIFSEmployeeDetails(false, false, false);
      }

      

      getIFSEmployeeDetails(isSearchUser: boolean, isSearchPrimUser: boolean, isSearchSecUser: boolean){
       
        this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
          this.ifsEmployeeSearchModel=result.data;

        });
      }
     
    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;

    }

    reassignOwner()
    {
      if(!this.selectedElement)
      {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: "Owner not selected",
          customClass: {
              container: 'display-list'
          },
          target: '#error-alert'
      });
      return;
      }
      if(this.selectedElement.id==this.rfqModel.buyerID)
      {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: "Owner cannot be same as current owner",
          customClass: {
              container: 'display-list'
          },
          target: '#error-alert'
      });
      }
this.rfqModel.buyerID=this.selectedElement.id;
      this.rfqService.ReassignOwner(this.rfqModel).subscribe(
        (response) => {
         if(response.model.success==true)
          {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              html: "Owner changed successfully"
          });
          this.dialogRef.close();
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: this.GetErrorOrderedList(response.model.errors)
          });
          this.dialogRef.close();
          }
          
      },
      (response) => {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              html: "Something Went Wrong With Saving RFQ"
          });
          this.dialogRef.close();
      }
    );

    }

    OnPaginateChange(event: PageEvent) {
      let page = event.pageIndex;
      let size = event.pageSize;
      page = page + 1;
      this.ifsEmployeeSearchModel.pageSize = event.pageSize;
      this.ifsEmployeeSearchModel.page = page;
      this.getIFSEmployeeDetails(false, false, false);
  }
  GetErrorOrderedList(errors: any[]) {
    var elem = document.createElement('div');

    var errorLis = "";
    for (var i = 0; i < errors.length; i++) {
        errorLis = errorLis + "<li> <span class='material-icons style='font-size:10px; display:flex; item-align: center'>fiber_manual_record</span>" + errors[i].description + "</li>";
    }
    errorLis = '<ul style="text-align: left !important" id="error-alert">' + errorLis + "</ul>";
    elem.innerHTML = errorLis;

    return elem;
}
}

