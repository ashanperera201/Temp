import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'amend-bidclose-overlay',
    templateUrl: './amend-bidclose-overlay.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AmendBidCloseOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    rfqmodel: any;
    bidClosingDate:any;
    isSaved:boolean =false;
    newbidClosingDate:any
    bidOpeningDate:any
    errmsg:boolean=false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,private rfqService: RfqService,
        public dialogRef: MatDialogRef<AmendBidCloseOverlayComponent>,
        public dialog: MatDialog,
        router: Router,
        private route: ActivatedRoute
    ) {
        this.rfqmodel = data.rfqmodel;
        this.bidOpeningDate=this.rfqmodel.bidOpeningDate;
        this.bidClosingDate=this.rfqmodel.bidClosingDate
        this.newbidClosingDate=null;
        dialogRef.disableClose = true; 
    }

    

    ngOnInit() {
       
    }

    handleDateChange(){
        if (new Date(this.newbidClosingDate) <= new Date(this.bidOpeningDate)) {
            this.isSaved=false;
            this.errmsg=true;
           
        } 
        else{
            this.errmsg=false;
        }
    }

    submitValue() {
        this.isSaved=true;
       
        if (this.newbidClosingDate==null ) {
            this.isSaved=false;
            return;
        }
        if (this.errmsg ) {
            this.isSaved=false;
            return;
        }
        this.rfqmodel.bidClosingDate = new Date(this.newbidClosingDate).toISOString();
        this.rfqService.UpdateBidClosingDate(this.rfqmodel).subscribe(result => {
            this.isSaved=false;
            this.dialogRef.close(result);
        });
      
    }



    doAction() {
        this.dialogRef.close();
    }
}
