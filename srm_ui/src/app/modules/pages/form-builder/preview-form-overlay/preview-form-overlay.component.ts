// import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
// import {FormControl, FormGroup} from '@angular/forms';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatTable } from '@angular/material/table';
// import {DatePipe} from '@angular/common';
// import {MatCheckboxChange} from '@angular/material/checkbox';

// @Component({
//     selector: 'preview-form-overlay',
//     templateUrl: './preview-form-overlay.component.html',
//     encapsulation: ViewEncapsulation.None
// })
// export class PreviewFormOverlayComponent {
//     @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

//     templateData: any = [];
//     useremail: string = '';

//     selectedId: any = [];
//     errormessage = 'Something went wrong, please try again.';
//     successmessage = 'Successfully added the template';
//     issuccess = false;
//     iserror = false;
//     addTeam = new FormGroup({
//         teamName: new FormControl('Team Name One'),
//         teamDescription: new FormControl('Team Description One'),
//     });
//     panelOpenState = false;
//     qualityQuestionAnswer= '02';
//     saudiArabiaSelected= true;

//     constructor(public dialogRef: MatDialogRef<PreviewFormOverlayComponent>,
//                 public dialog: MatDialog, private datePipe: DatePipe
//     ) {
//     }

//     onQualityItemChange(item){
//         this.qualityQuestionAnswer=item;
//     }
//     onSaudiArabiaSelected(ob: MatCheckboxChange){
//         this.saudiArabiaSelected=ob.checked;
//     }
//     getDate() {
//         let d = new Date();
//         d.setDate(d.getDate());
//         return this.datePipe.transform(d, 'yyyy-MM-dd');
//     }
//     doAction() {
//         this.dialogRef.close();
//         window.location.reload() ;
//     }

// }
