import { Component, ViewChild, ViewEncapsulation,Inject } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'award-recommend-overlay',
    templateUrl: './award-recommend-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AwardRecommendOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    roaModel:any;
    supplierID:any;
    constructor(public dialogRef: MatDialogRef<AwardRecommendOverlayComponent>,
                public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data,private rfqService:RfqService
    ) {
        //debugger;
        this.roaModel= data.roaModel;
    }
recommendedSuppliers=[];

doCancel() {
    this.dialogRef.close();
    

}
    ngOnInit(): void {

        if(this.roaModel.rankRecommendation.supplierName==this.roaModel.scoreRecommendation.supplierName)
        {
            
            this.isSupplierSame=true;
            this.supplierID=this.roaModel.rankRecommendation.id;
        }
        
            this.roaModel.rankRecommendation.supplierName=this.roaModel.rankRecommendation.supplierName + " (Rank Based)";
            this.roaModel.scoreRecommendation.supplierName=this.roaModel.scoreRecommendation.supplierName + " (Price Based)";
            this.recommendedSuppliers.push({"supplierID":this.roaModel.rankRecommendation.id,"supplierName":this.roaModel.rankRecommendation.supplierName});
            this.recommendedSuppliers.push({"supplierID":this.roaModel.scoreRecommendation.id,"supplierName":this.roaModel.scoreRecommendation.supplierName});
       
       
    }

    addTemplate(item, event) {
    }
    isSupplierSame=false;
    doAction() {
        this.saveRecommendation();
        

    }

    getSelectedREcommendation(event){
        //debugger;

    }
    isAwardProcessed:any;
    saveRecommendation(){
//debugger;
this.isAwardProcessed=true;
   this.roaModel.supplierID=this.supplierID;
        this.rfqService.saveROA(this.roaModel).subscribe(result => {
            this.isAwardProcessed=!result.data.success;
            if (result.data.success == false) {
                
                Swal.fire({
                    icon: 'error',
                    position: "center-start",
                    title: 'Error',
                    html: result.data.responseMessage,
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
            }
            else {

                Swal.fire({
                    icon: 'success',
                    position: "center",
                    title: 'Success',
                    html: result.data.responseMessage
                }).then((result1) => {
                    
                    /* Read more about isConfirmed, isDenied below */
                    if (result1.isConfirmed) {
                        this.dialogRef.close({issuccess:result.data.success,data:result.data});
                    }
                });
               
            }
        
        });
    }

    saveTemplate() {
    }
}
