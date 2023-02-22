import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { SetupTableService } from '../../../../shared/Services/etendering/setup-table.service';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'create-value-overlay',
    templateUrl: './create-value-overlay.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CreateValueOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    source: any;
    colDesc: string = '';
    colName: string = '';
    Tname: string = '';
    id: string = '';
    tabledetail:any;
    isDelete:boolean=false;
    isSaved:boolean =false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,private setupService: SetupTableService,
        public dialogRef: MatDialogRef<CreateValueOverlayComponent>,
        public dialog: MatDialog,
        router: Router,
        private route: ActivatedRoute
    ) {
        this.source = data.source;
        this.tabledetail=data.tabledetail;
        if(this.source==null){
            this.colDesc =  '';
            this.colName =  '';
            this.Tname = this.tabledetail ? this.tabledetail.tableName : '';
            this.id =  "00000000-0000-0000-0000-000000000000";
            this.isDelete=false;
          
        }
        else{
            this.colDesc = this.source ? this.source.colDesc : '';
            this.colName = this.source ? this.source.colName : '';
            this.Tname = this.tabledetail ? this.tabledetail.tableName : '';
            this.id = this.source ? this.source.id : '';
            if(this.source.isDelete==false){
                this.isDelete=true;
            }
            else{
                this.isDelete=false;
            }
           
        }
        dialogRef.disableClose = true; 
    }

    

    ngOnInit() {
       
    }

    

    submitValue() {
        this.isSaved=true;
        if (this.colName==null || this.colDesc==null) {
            this.isSaved=false;
            return;
        }
        if (this.colName.trim().length==0 || this.colDesc.trim().length==0) {
            this.isSaved=false;
            return;
        }
        if(this.data.action=='editValue'){
            const tableModel = { id:this.id,colName: this.colName, colDesc: this.colDesc, isDelete: 0 };
            const data = { tableName:this.tabledetail.tableName,actionName: 'Edit', userId: null, isSuccess: 0 ,tableModel:tableModel};
           
            this.setupService.SaveTableValue(data).subscribe(result => {
                this.isSaved=false;
                this.dialogRef.close(result);
            });
        }
        else{
            const tableModel = { id:this.id,colName: this.colName, colDesc: this.colDesc, isDelete: 0 };
            const data = { tableName:this.tabledetail.tableName,actionName: 'New', userId: null, isSuccess: 0 ,tableModel:tableModel};
           
            this.setupService.SaveTableValue(data).subscribe(result => {
                this.isSaved=false;
                this.dialogRef.close(result);
            });
        }
     
    }



    doAction() {
        this.dialogRef.close();
    }
}
