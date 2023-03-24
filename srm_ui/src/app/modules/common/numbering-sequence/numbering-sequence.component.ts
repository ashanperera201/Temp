import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AddEditOverlayComponent} from './add-edit-overlay/add-edit-overlay.component';

import { NumberingSequenceService } from 'app/shared/Services/etendering/numbering-sequence.service';
import { NumberingSequenceSearchModel } from 'app/main/Models/etendering/numbering-sequence-search-model';
import { NumberingSequenceViewModel } from 'app/main/Models/etendering/ViewModels/numbering-sequence-view-model';
import Swal from 'sweetalert2';

@Component({
    selector     : 'numbering-sequence',
    templateUrl  : './numbering-sequence.component.html',
    styleUrls:['./numbering-sequence.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NumberingSequenceComponent
{
    displayedColumns: string[] = ['id', 'startNumber', 'exists' ,'startofseq','startDate', 'endDate','active'];
    numberingSequenceSearchModel: NumberingSequenceSearchModel = new NumberingSequenceSearchModel();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;
    panelOpenState = false;
    rfxType:string="RFQ";
    Message:string="";
    /**
     * Constructor
     */
     constructor(public dialog: MatDialog, private numberingSequenceService: NumberingSequenceService)
     {
        this.numberingSequenceSearchModel.pageSize = 10;
        this.numberingSequenceSearchModel.page = 1;
     }
 
     numberingSequenceChange($event){
        console.log($event);
        if($event.index === 0){
            this.fetchNumberingSequenceData("RFQ");
        }
        if($event.index === 1){
            this.fetchNumberingSequenceData("RFI");
        }
        if($event.index === 2){
            this.fetchNumberingSequenceData("RFAQ");
        }
    }

    fetchNumberingSequenceData(type: string) {
        this.rfxType=type;
        this.numberingSequenceSearchModel.rFxType = type;
        this.numberingSequenceService.getNumberingSequenceList(this.numberingSequenceSearchModel).subscribe(result => {
          console.log(result);
          this.numberingSequenceSearchModel = result;
           console.log(this.numberingSequenceSearchModel);
        });
    }

    ngOnInit() {
        this.fetchNumberingSequenceData(this.rfxType);
    }
   
    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":"00000000-0000-0000-0000-000000000000","RFXType":this.rfxType}});
        dialogRef.disableClose=true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.Message="Added";
            this.fetchNumberingSequenceData(this.rfxType);
        });  
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.numberingSequenceSearchModel.pageSize = event.pageSize;
        this.numberingSequenceSearchModel.page = page;
        this.fetchNumberingSequenceData(this.rfxType);
    }

    editNumberingSequenceData(row :any) {   
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":row.id,"RFXType":this.rfxType}});
        dialogRef.disableClose=true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.Message="Updated";
           this.fetchNumberingSequenceData(this.rfxType);
        });      
    }

    deleteNumberingSequenceData(model: NumberingSequenceViewModel[]) {
       
        Swal.fire({
            title: 'Remove Numbering Sequence',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.numberingSequenceService.deleteNumberingSequence([model]).subscribe(result => {
                   
                      Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            this.fetchNumberingSequenceData(this.rfxType);
                        }
                      });
          
                });
     
            }
        })

    }
  
}