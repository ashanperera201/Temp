import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';


@Component({
    selector: 'add-edit-shipping-overlay',
    templateUrl: './add-edit-shipping-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditShippingOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });


    constructor(public dialogRef: MatDialogRef<AddEditShippingOverlayComponent>,
                public dialog: MatDialog
    ) {
    }

    addTemplate(item, event) {
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;

    }

    saveTemplate() {
    }


}
