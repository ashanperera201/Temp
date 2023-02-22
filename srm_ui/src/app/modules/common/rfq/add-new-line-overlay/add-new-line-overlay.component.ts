import { Component,Inject,ViewEncapsulation} from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';


@Component({
    selector: 'add-new-line-overlay',
    templateUrl: './add-new-line-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewLineOverlayComponent {
    newLine: FormGroup;
    originalPartLine: any;
    constructor(public dialogRef: MatDialogRef<AddNewLineOverlayComponent>,
        public dialog: MatDialog, private fb: FormBuilder, 
        @Inject(MAT_DIALOG_DATA) public data,
        private rfqPartLineService: RfqPartLineService) {
        this.data = data;
    }

    ngOnInit() {
        this.newLine = this.fb.group({
            //pr: [null],
            pcName: [null],
            partDescirption: [null],
            // subProjectCode: [null],
            // activity: [null],
            purchaseQty: [null],
            purchaseUoMId: [null],
            wantedDate: [null],
            startPrice: [null],
            targetPrice: [null],
            showPriceToSuppliers: [null]              
        });
        if(this.data) {
            this.rfqPartLineService.getPartLineById(this.data.id).subscribe(result => {
                this.originalPartLine = result.data;
                this.newLine.patchValue(result.data);
            });
        }
    }

    submitForm(): void {
        let data = {
            //pr: this.newLine.value.pr,
            pcName: this.newLine.value.pcName,
            partDescirption: this.newLine.value.partDescirption,
            // subProjectCode: this.newLine.value.subProjectCode,
            // activity: this.newLine.value.activity,
            purchaseQty: this.newLine.value.purchaseQty,
            purchaseUoMId: this.newLine.value.purchaseUoMId,
            wantedDate: this.newLine.value.wantedDate,
            startPrice: this.newLine.value.startPrice,
            targetPrice: this.newLine.value.targetPrice,
            showPriceToSuppliers: this.newLine.value.showPriceToSuppliers,
            id: '00000000-0000-0000-0000-000000000000',
            lineNumber: 0
        };
        if (this.data) {
            data.id = this.data.id;
            data.lineNumber = this.originalPartLine.lineNumber;
            this.dialogRef.close({ event: 'Save', data: data });
        } else {
            this.dialogRef.close({ event: 'Save', data: data });
        }
    }
   
    doAction() {
       this.dialogRef.close({ event: 'Cancel'});
    }
}