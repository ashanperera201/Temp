import { Component, ViewChild, ViewEncapsulation, ChangeDetectorRef,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateValueOverlayComponent } from '../create-value-overlay/create-value-overlay.component';
import { SetupTableService } from '../../../../shared/Services/etendering/setup-table.service';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { TableValueModel } from '../../../../main/Models/etendering/table-value-model';
/* export interface RowData {

    uiCode: string;
    description: string;
    id: string;
} */

/** Constants used to fill up our data base. */
const UICODE: string[] = [
    'Net 30', 'Net 60', 'Net 45', 'Net 75'
];
const DESCRIPTION: string[] = [
    'Net Payment in 30 Days', 'Net Payment in 60 Days', 'Net Payment in 45 Days', 'Net Payment in 75 Days'
];
const ID: string[] = [
    'Net_30', 'Net_60', 'Net_45', 'Net_75'
];

@Component({
    selector: 'rfx',
    templateUrl: './table-detail.component.html',
    styleUrls: ['./table-detail.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TableDetailComponent implements OnInit{
    displayedColumns: string[] = ['colName', 'colDesc', 'id', 'edit' , 'active'];
    //displayedColumns1: string[] = ['name', 'description', 'id', 'updateby', 'ovalue', 'nvalue','date'];
    @ViewChild(MatPaginator,{ static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    dataSource:any=[];
   tableValue:any[];
    source:any;
    name: string;
    row: {};

    panelOpenState = false;
    uicodeSearch:string='';
    uidescSearch:string='';

    constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute,private setupService: SetupTableService) {
        this.source = JSON.parse(this.route.snapshot.params['source']);
       
    }

    createValue() {
        const dialogRef = this.dialog.open(CreateValueOverlayComponent, {
            data: { action: 'createValue',source: null,tabledetail:this.source },
            disableClose: true
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
            if (result ) {
               
               this.LoadAllTableValues();
                
            }
        });
    }

    editValue(row,i) {
        const dialogRef = this.dialog.open(CreateValueOverlayComponent, {
            data: {  action: 'editValue', source: row,tabledetail:this.source  }
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
            if (result ) {
               
               this.LoadAllTableValues();
                
            }
        });
       
    }
    activeRow($event, row): void {
        let isDelete=false;
        if($event.checked==false){
            isDelete=true;
        }
       const tableModel = { id:row.id,colName: row.colName, colDesc: row.colDesc, isDelete:isDelete };
        const data = { tableName:this.source.tableName,actionName: 'Delete', userId: null, isSuccess: 0 ,tableModel:tableModel};
       
        this.setupService.SaveTableValue(data).subscribe(result => {
            if (result ) {
               
                this.LoadAllTableValues();
                 
             }
        }); 
      }
    
    //
    ngOnInit(){
       
        this.LoadAllTableValues();
    }
    LoadAllTableValues(){
        this.setupService.LoadTableValue(this.source.tableName).subscribe(result => {
         // this.tableValue=  JSON.parse(JSON.stringify(result.data));;
          //this.dataSource = JSON.parse(JSON.stringify(result.data));
          this.tableValue = JSON.parse(JSON.stringify(result.data));;
          this.dataSource = new MatTableDataSource(this.tableValue);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
      });
      }

      goBack() {
        this.router.navigate(['/tables']);
    }   
    exportToExcel(){
        let workbook = new Workbook();


        let wsRFQInformation = workbook.addWorksheet(this.source.tableName);
        var rowValues = [];
        rowValues[0] = 'Id';
        rowValues[1] = 'Name';
        rowValues[2] = 'Description';
        rowValues[3] = 'IsDelete';
      

        const newRow1 = wsRFQInformation.addRow(rowValues, 'i');//Row 1


        rowValues = [];
    

        wsRFQInformation.addRow(rowValues, 'i');//Row 2 Data
       if (this.dataSource.data.length>0) {
            for (var i = 0; i < this.dataSource.data.length; i++) {
                rowValues = [];
                rowValues[0] = this.dataSource.data[i].id;
                rowValues[1] = this.dataSource.data[i].colName;
                rowValues[2] = this.dataSource.data[i].colDesc;
                rowValues[3] = this.dataSource.data[i].isDelete;
               
                const dataRow = wsRFQInformation.addRow(rowValues, 'i');//Row 1
            }
        } 
        this.autoAdjustWidth(wsRFQInformation);

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, this.source.tableName+'.xlsx');
        });

    }

    autoAdjustWidth(worksheet: any) {
        // column size adjusted
        worksheet.columns.forEach((column) => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                maxColumnLength = Math.max(
                    maxColumnLength,
                    10,
                    cell.value ? cell.value.toString().length : 0
                );
            });
            column.width = maxColumnLength + 2;
        });
    }

  /*   applyFilterCode(filterValue: string) {
        filterValue = filterValue.toLowerCase(); // Remove whitespace
    
        let datafilter=this.tableValue.filter(i=>i.colName.toLowerCase().includes(filterValue));
        this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
      }
      applyFilterDesc(filterValue: string) {
        filterValue = filterValue.toLowerCase(); // Remove whitespace
     
        let datafilter=this.tableValue.filter(i=>i.colDesc.toLowerCase().includes(filterValue));
        this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
      } */
       applyFilter(){
        if(this.uicodeSearch.trim()!='' && this.uidescSearch.trim()!=''){
            let datafilter=this.tableValue.filter(i=>i.colName.toLowerCase().includes(this.uicodeSearch.trim().toLowerCase()) 
            && i.colDesc.toLowerCase().includes(this.uidescSearch.trim().toLowerCase())
            );
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else if(this.uicodeSearch.trim()=='' && this.uidescSearch.trim()==''){
            let datafilter=this.tableValue;
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
       else{
        if(this.uicodeSearch.trim()!=''){
            let datafilter=this.tableValue.filter(i=>i.colName.toLowerCase().includes(this.uicodeSearch.trim().toLowerCase()));
           
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else{
            let datafilter=this.tableValue.filter(i=>i.colDesc.toLowerCase().includes(this.uidescSearch.trim().toLowerCase));
           
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
       }
      } 
}

