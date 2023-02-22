import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';


@Component({
    selector: 'add-new-line-costfactor-overlay',
    templateUrl: './add-new-line-costfactor-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddNewLineCostfactorOverlayComponent {

    costFactors: FormGroup;

    constructor(public dialogRef: MatDialogRef<AddNewLineCostfactorOverlayComponent>,
        public dialog: MatDialog,private fb: FormBuilder ) {}

    ngOnInit() {
        this.costFactors = this.fb.group({
            costFactorList: [null],
            costFactorType: [null],
            value: [null],
            description: [null],   
        });
        
    }

    submitForm(): void {
        console.log(this.costFactors.value);
        const data = {
            list: this.costFactors.value.costFactorList,
            type: this.costFactors.value.costFactorType,
            description: this.costFactors.value.description,
            value: this.costFactors.value.value,
            
        };
        this.dialogRef.close(data);
    }

    doAction(): void {
        this.dialogRef.close();
    }

 
}
