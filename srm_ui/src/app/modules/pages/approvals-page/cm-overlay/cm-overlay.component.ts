import { HttpClient } from '@angular/common/http';
import { Component, Inject,ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { DatePipe } from '@angular/common';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export interface RowData1 {
  id: string;
  generalCategory:string;
  subCategory:string;
  detailCategory:string;
}

export interface scopeColumns {
  position: number;
  scope: string;
  check: boolean;
  personalDetail: any;
}

const ELEMENT_DATA_SELECTEDCRITICS: scopeColumns[] = [];


/** Constants used to fill up our data base. */
const ID: string[] = [
  '01'
];
const GCATEGORY: string[] = [
  'Air Condition'
];
const SCATEGORY: string[] = [
  'Package Unit 1','Package Unit 2','Package Unit 3'
];
const DCATEGORY: string[] = [
  'A/C Package Unit 1', 'A/C Package Unit 2','A/C Package Unit 3'
];


@Component({
  selector: 'cm-overlay',
  templateUrl: '../cm-overlay/cm-overlay.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class CmOverlayComponent {
  @ViewChild('htmlData')  pdfTable!: ElementRef;
  @ViewChild('categorytable')  categorytable!: ElementRef;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  action: string;
  local_data: any;
  allData: any;

  // dataSourceSelectedCritics = [];
  IsperformCriticality: boolean = false;
  displayedCategoriesColumns: string[] = ['id', 'generalCategory', 'subCategory', 'detailCategory'];
  dataSource1: MatTableDataSource<RowData1>;
  CategoriesColumnsNew: string[] = ['id', 'generalCategory', 'subCategory', 'detailCategory','selection'];
  scopeColumns: string[] = ['position', 'scope', 'check'];
  dataSourcescopeColumns = ELEMENT_DATA_SELECTEDCRITICS;
  
  checkboxesDataList = [
    {
      position: '1',
      scope: 'Sole Source',
      check: false
    },
    {
      position: '2',
      scope: 'Service Provider/ Subcontractor',
      check: false
    },
    {
      position: '3',
      scope: 'Impact on project/ delivery Schedule',
      check: false
    },
    {
      position: '4',
      scope: 'Impact on the quality of the final product',
      check: false
    },
    {
      position: '5',
      scope: 'Impact on the HSE of the production/ operation',
      check: false
    },
    {
      position: '6',
      scope: 'Third Party Approval Required',
      check: false
    },
    {
      position: '7',
      scope: 'Manpower/ Equipment deployment at IMIs premises',
      check: false
    },
    {
      position: '8',
      scope: 'Single PO spend >= USD100,000',
      check: false
    },
    {
      position: '9',
      scope: 'Non-standard product/service',
      check: false
    },
    {
      position: '10',
      scope: 'OOK Supplier',
      check: false
    }
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 

  /**
   * Constructor
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<CmOverlayComponent>, private datePipe: DatePipe,
    //public dialog: MatDialog,
    private http: HttpClient,
    public auth: AuthService,
    private router: Router,
  ) 
  
  {
    {
      const users1 = Array.from({length:4}, (_, k) => createNewRow1());
    
      // Assign the data to the data source for the table to render
      this.dataSource1 = new MatTableDataSource(users1);
     
    }


  }

  doAction() {
    console.log(this.local_data);
    this.dialogRef.close({ event: this.action, data: this.local_data });
   
  }

  ngOnInit(): void {
  }
  
  addCrticality(row_obj) {
    console.log(row_obj);
    this.dataSourcescopeColumns = row_obj;
 
    var count = 1;
    for (var product of row_obj) {

      this.dataSourcescopeColumns.push({
        position: product.position,
        scope: product.scope,
        check: product.check,
        personalDetail : this.allData
      });

      count++;
    }

    this.table.renderRows();



    console.log(this.dataSourcescopeColumns);

  }

  }

  function createNewRow1 (): RowData1{

    return {
        id: ID[Math.round(Math.random() * (ID.length - 1))],
        generalCategory: GCATEGORY[Math.round(Math.random() * (GCATEGORY.length - 1))],
        subCategory: SCATEGORY[Math.round(Math.random() * (SCATEGORY.length - 1))],
        detailCategory: DCATEGORY[Math.round(Math.random() * (DCATEGORY.length - 1))],
        
        
    };
}




    
 


  




 
  

