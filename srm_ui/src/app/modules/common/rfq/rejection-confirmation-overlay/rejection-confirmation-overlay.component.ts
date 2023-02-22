import { Component, Inject, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';

export interface RowData {
    id: string;
    group: string;
    objKey: string;
    visibility: string;
}

@Component({
    selector: 'rejection-confirmation-overlay',
    templateUrl: './rejection-confirmation-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class RejectionConfirmationOverlayComponent {
   
    headerDataSource: any = [];
    lineDataSource: any = [];
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
    rfqApprovalViewModel: RFQApprovalViewModel []=[];
    rfqId : any;
    approvalType:any;
    
    constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<RejectionConfirmationOverlayComponent>,
        public dialog: MatDialog,private router: Router,private rfqService:RfqService) {
            this.allData = this.data;
            this.testdata = this.data.approver;
            this.rfqId = this.data.rfqId;
            this.approver = this.data.approver;
            this.isApprover = true;  
            this.approvalType=data.approvalType;
    }

    rfqApprovalModel:RFQApprovalViewModel=new RFQApprovalViewModel();

    ngOnInit() {
        this.rfqService.getRFQApprovalStatusByRFQId(this.rfqId,this.approvalType).subscribe(result => { 
            this.rfqApprovalModel=result.data;   
        });
        this.firstScreen = true;
        this.activity = this.data.activity;
    }

    doAction() {
        this.dialogRef.close( { event: 'Cancel'});
    }
    isRejectionInProgress!:boolean;
    submit() {
        this.isRejectionInProgress=true;
        let rfqApprovalViewModel = new RFQApprovalViewModel();
        rfqApprovalViewModel.rFQId = this.rfqId;
        rfqApprovalViewModel.id = this.rfqApprovalModel.id;
        
        // if(this.approvalType=="ROA")
        // {
        //     rfqApprovalViewModel.statusName = "Award Rejected";
        // }
        // else{
            rfqApprovalViewModel.statusName = "Rejected";
        // }
        rfqApprovalViewModel.approvalType=this.approvalType;
        rfqApprovalViewModel.reason=this.rfqApprovalModel.reason;

        this.rfqService.updateRFQApprovalStatus(rfqApprovalViewModel).subscribe(result => { 
            this.firstScreen = false;
            this.isRejectionInProgress=false;
        this.loading =true;
            if (result.data.isSuccess == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: result.data.responseMessage,
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                }).then((result1) => {
                    debugger;
                    /* Read more about isConfirmed, isDenied below */
                    if (result1.isConfirmed) {
                        this.dialogRef.close( { event: 'Success',issuccess:result.data.isSuccess});
                    } 
                  });


            }
            else {
                
                  this.dialogRef.close( { event: 'Success',issuccess:result.data.isSuccess});
            }
        });

        
       
      
    }

    Continue() {
        this.dialogRef.close( { event: 'Cancel'});  
    }
   
}