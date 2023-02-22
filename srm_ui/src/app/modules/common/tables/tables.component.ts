import { AfterViewInit, Component, ViewChild, ViewEncapsulation,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateTableOverlayComponent } from './create-table-overlay/create-table-overlay.component';
import { SetupTableService } from '../../../shared/Services/etendering/setup-table.service';

export interface RowData {

    tableName: string;
    tableDescription: string;
    sourceDB: string;
    
}

/** Constants used to fill up our data base. */
const NAME: string[] = [
    'Address', 'Units of Measure', 'Currency', 'Country Code', 'Payment Terms', 'Shipping Terms', 'Purchase Type'
];
const DESCRIPTION: string[] = [
    'Delivery Locations', 'IFS UoM', 'All currencies', 'All country codes', 'All payment terms from IFS', 'All shiping Terms', 'Types allowed in IFS'
];
const SOURCE: string[] = [
    'IFS', 'XITRICON'
];
const CREATE: string[] = [
    'N/A', 'M.Ali', 'M.Nauman'
];

@Component({
    selector: 'tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TablesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['tableName', 'tableDescription', 'sourceDB'];
    dataSource:any=[];
    tableValue:any[];

    tblnameSearch:string='';
    tbldescSearch:string='';
    srcdbSearch:string='';

    constructor(public dialog: MatDialog,private setupService: SetupTableService,
        private router: Router,
        private route: ActivatedRoute) {

        //const users13 = Array.from({ length: 7 }, (_, k) => createNewRow());
       // this.dataSource = new MatTableDataSource(users13);


    }
    ngOnInit(){
        this.LoadAllTables();
    }
    OpenURL(url, row) {
        const dataSource = JSON.stringify(row);
        this.router.navigate([url, { source: dataSource }]);
    }


    avtivateParams(row, i, $event): void {
    }

   /*  createTable() {
        const dialogRef = this.dialog.open(CreateTableOverlayComponent, {
            data: { action: 'createTable' }
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {

        });
    }

    editTable(row, i) {
        const dialogRef = this.dialog.open(CreateTableOverlayComponent, {
            data: { action: 'editTable', source: row }
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
            if (result.Tname !== row.name || result.des !== row.description) {
                const source = row.source;
                const user = row.create;

                const newRow = {
                    name: result.Tname,
                    description: result.des,
                    source: source,
                    create: user
                };

                this.dataSource.data.splice(i, 1, newRow);
                const newData = this.dataSource.data;
                this.dataSource = new MatTableDataSource(newData);

            }
        });
    } */


    filterChange = (type, event): void => {

        let value = '';

        value = event ? event.target.value.trim().toLowerCase() : '';


        const filterValue = value;

        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (type === 'name') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.tableName.toString().toLowerCase().includes(filter);
        } else if (type === 'description') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.tableDescription.toString().toLowerCase().includes(filter);
        } else if (type === 'source') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.sourceDB.toLowerCase().includes(filter);
        }
        /*  else if (type === 'create') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.create.toString().toLowerCase().includes(filter);
        } */

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };

   

    LoadAllTables(){
        this.setupService.LoadAllTables().subscribe(result => {
            this.tableValue = JSON.parse(JSON.stringify(result.data));;
            this.dataSource = new MatTableDataSource(this.tableValue);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
      });
      }
   applyFilter(){
   
        if(this.tblnameSearch.trim()!='' && this.tbldescSearch.trim()!='' && this.srcdbSearch.trim()!=''){
         
            let datafilter=this.tableValue.filter(i=>i.tableName.toLowerCase().includes(this.tblnameSearch.trim().toLowerCase()) 
            && i.tableDescription.toLowerCase().includes(this.tbldescSearch.trim().toLowerCase())
            && i.sourceDB.toLowerCase().includes(this.srcdbSearch.trim().toLowerCase()));

            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else if(this.tblnameSearch.trim()=='' && this.tbldescSearch.trim()==''  && this.srcdbSearch.trim()==''){
       
            let datafilter=this.tableValue;
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
       else{
       
        if(this.tblnameSearch.trim()!=''){
            let datafilter=this.tableValue.filter(i=>i.tableName.toLowerCase().includes(this.tblnameSearch.trim().toLowerCase()));
           
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else if(this.tbldescSearch.trim()!=''){
            let datafilter=this.tableValue.filter(i=>i.tableDescription.toLowerCase().includes(this.tbldescSearch.trim().toLowerCase()));
           
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
        else{
            console.log(1)
            console.log(this.tableValue)
            let datafilter=this.tableValue.filter(i=>i.sourceDB.toLowerCase().includes(this.srcdbSearch.trim().toLowerCase));
           
            this.dataSource = new MatTableDataSource(datafilter);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
       }
      }  

}


