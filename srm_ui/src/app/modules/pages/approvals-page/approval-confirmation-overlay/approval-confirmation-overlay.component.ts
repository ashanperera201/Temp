import { Component, Inject, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
// import { NegotiationStyleService } from 'app/services/negotiation-style.service';
// import { NegotiationStyleSearchModel } from 'app/models/negotiation-style-search-model';
// import { NegotiationStyleViewModel } from 'app/models/ViewModels/negotiation-style-view-model';

export interface RowData {
    id: string;
    group: string;
    objKey: string;
    visibility: string;
}
@Component({
    selector: 'approval-confirmation-overlay',
    templateUrl: './approval-confirmation-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ApprovalConfirmationOverlayComponent {
    // @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    // displayedColumns: string[] = ['id', 'group', 'visibility'];

    headerDataSource: any = [];
    lineDataSource: any = [];

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    isDelete = false;
    bidingStyles: any[];
    dataId: any = "";

    headerMap = new Map();
    lineMap = new Map();

    approver: string;
    activity: string;
    firstScreen: boolean = true;
    loading: boolean = false;
    lastScreen: boolean = false;
    des: string;
    testdata: any;
    isApprover: boolean = true;
    allData: any;
    // router: any;


    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<ApprovalConfirmationOverlayComponent>,
        public dialog: MatDialog,
        private router: Router
        // private fb: FormBuilder
        // private negotiationStyleService: NegotiationStyleService
    ) {
        this.allData = this.data;

        this.testdata = this.data.approver;
        this.approver = this.data.approver;
        this.isApprover = true;


        // this.negotiationList = this.fb.group({
        //     negotiationStyleModels: this.fb.array([])
        // });
       
        // this.des = this.data.des;
        
    }

    ngOnInit() {
        this.firstScreen = true;
        // this.data = {"id":"00000000-0000-0000-0000-000000000000", approver: 'udaraa', activity: '123#456'}

         
        console.log(this.data)
        
        this.activity = this.data.activity;
    }

    doAction() {
        this.dialogRef.close( { event: 'Cancel'});

    }

    submit() {
        this.firstScreen = false;
        this.loading =true;
        //debugger;

        setTimeout(() => {
            this.loading =false;
            this.lastScreen = true;
        }, 10000);
    }

    removeItem(){
        if(localStorage.getItem('dashboardregfilter')){
            if (localStorage.getItem('dashboardregfilter') == 'Approved') {
                this.router.navigate(['/approval-changes-landing/']);
            }
        }
    }


    Continue() {
        this.router.navigateByUrl('/todo-list');
        this.dialogRef.close( { event: 'Cancel'});        
    }

    
}