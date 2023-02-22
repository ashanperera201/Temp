import { Component, ViewChild, ViewEncapsulation,Inject } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';

export interface RowData {
    supplierName: string;
    comment: string;
    supplierID:string;
    isSelected:boolean;

}
/** Constants used to fill up our data base. */
const SUPPLIERNAME: string[] = [
    'Supplier A', 'Supplier B'
];
const COMMENT: string[] = [
    'comment 1', 'comment 2','comment 3'
];

@Component({
    selector: 'award-selected-overlay',
    templateUrl: './award-selected-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AwardSelectedOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumn: string[] = ['id','supplierName', 'comment'];
    dataSource: MatTableDataSource<RowData>;
    dataSource2: MatTableDataSource<RowData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    supplierID:any;
    roaModel:any;
    constructor(public dialogRef: MatDialogRef<AwardSelectedOverlayComponent>,
                public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data,private rfqService:RfqService
    ) {
        //debugger;
        this.roaModel= data.roaModel;
        // const users = Array.from({length: 1}, (_, k) => createNewRow(k + 1));
        // const users2 = Array.from({length: 3}, (_, k) => createNewRow2(k + 1));
        if(this.roaModel.isAll==false)
        {
            let selectedsupplierlist:RowData[]= [{
                supplierName: this.roaModel.supplierName,
                comment: "",
                supplierID: this.roaModel.supplierID,
                isSelected:true
            }];
            this.dataSource = new MatTableDataSource(selectedsupplierlist);
        }
    

    let othersupplierlist:RowData[]= this.roaModel.suppliers;
        // Assign the data to the data source for the table to render
        
        this.dataSource2 = new MatTableDataSource(othersupplierlist);
        
        
    }

    ngOnInit(): void {
    if(this.roaModel.isAll==true)
        {
            for(var i = 0; i< this.dataSource.data.length; i++){
                this.dataSource.data[i].isSelected=false;

            }
        }
            
            for(var i = 0; i< this.dataSource2.data.length; i++){
                this.dataSource2.data[i].isSelected=false;

            }
        
       
        if (this.roaModel.isAll == true) {

            for (var i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].isSelected == true) {
                    this.dataSource.data[i].comment = "";

                }


            }
        }

        for(var i = 0; i< this.dataSource2.data.length; i++){
            if(this.dataSource2.data[i].isSelected==true)
            {
            this.dataSource2.data[i].comment="";
            }

        }
}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    addTemplate(item, event) {
    }
    ChangeRow(row){
        if(this.roaModel.isAll==false)
        {
            for(var i = 0; i< this.dataSource.data.length; i++){
                this.dataSource.data[i].isSelected=false;

            }
        }
            
            for(var i = 0; i< this.dataSource2.data.length; i++){
                this.dataSource2.data[i].isSelected=false;

            }
        
        row.isSelected = true;
        if (this.roaModel.isAll == false) {

            for (var i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].isSelected == true) {
                    this.dataSource.data[i].comment = "";

                }


            }
        }

        for(var i = 0; i< this.dataSource2.data.length; i++){
            if(this.dataSource2.data[i].isSelected==true)
            {
            this.dataSource2.data[i].comment="";
            }

        }
        //debugger;

    }
    doAction() {
        //debugger;
        this.saveRecommendation();    
        

    }
    doCancel() {
        this.dialogRef.close();
        

    }
    saveRecommendation(){
        
        if (this.roaModel.isAll == false) {
            for (var i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].isSelected == true) {
                    this.roaModel.supplierID = this.dataSource.data[i].supplierID;
                    this.roaModel.comments = this.dataSource.data[i].comment;
                }


            }
        }
        for(var i = 0; i< this.dataSource2.data.length; i++){
            if(this.dataSource2.data[i].isSelected==true)
            {
                this.roaModel.supplierID=this.dataSource2.data[i].supplierID;
                this.roaModel.comments=this.dataSource2.data[i].comment;
            }

        }
   //here there will be selection based on that supplier will be awarded for that particular line
        this.rfqService.saveROA(this.roaModel).subscribe(result => {
            //debugger;
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
/** Builds and returns a new createNewRow. */
// function createNewRow(id: number): RowData {

//     return {
//         supplierName: SUPPLIERNAME[Math.round(Math.random() * (SUPPLIERNAME.length - 1))],
//         comment: COMMENT[Math.round(Math.random() * (COMMENT.length - 1))],
//     };
// }

// function createNewRow2(id: number): RowData {

//     return {
//         supplierName: SUPPLIERNAME[Math.round(Math.random() * (SUPPLIERNAME.length - 1))],
//         comment: COMMENT[Math.round(Math.random() * (COMMENT.length - 1))],
//     };
// }
