/* eslint-disable max-len */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
export interface PeriodicElement {
  section: string;
  uiFieldName: string;
  databaseName: string;
  fieldType: string;
  mandatory: boolean;
  editable: boolean;
  defaultValue: any;
  defaults: string;
  table: any;
  tableValue: any;
}

const users13: PeriodicElement[] = [
  { section: 'Basic Information', uiFieldName: 'RFQ No', databaseName: 'RFQ_No', fieldType: 'Text Field', defaultValue: '', mandatory: true, editable: true, defaults: 'textField', tableValue: 'tableA', table: '' },
  { section: 'Basic Information', uiFieldName: 'REV No', databaseName: 'REV_No', fieldType: 'Dropdown', defaultValue: '', mandatory: true, editable: false, defaults: 'dropdown', tableValue: 'tableB', table: '' },
  { section: 'Basic Information', uiFieldName: 'Buyer Name', databaseName: 'Buyer_Name', fieldType: 'Text Field', defaultValue: '', mandatory: false, editable: false, defaults: 'textField', tableValue: 'tableB', table: '' },
  { section: 'Basic Information', uiFieldName: 'Description', databaseName: 'Description', fieldType: 'Dropdown', defaultValue: '', mandatory: true, editable: false, defaults: 'dropdown', tableValue: 'tableC', table: '' },
  { section: 'Basic Information', uiFieldName: 'Name', databaseName: 'Name', fieldType: 'Date', defaultValue: '', mandatory: true, editable: false, defaults: 'date', tableValue: 'tableA', table: '' },
  { section: 'Basic Information', uiFieldName: 'Project Code', databaseName: 'Project_Code', fieldType: 'Text Field', defaultValue: '', mandatory: true, editable: false, defaults: 'textField', tableValue: 'tableC', table: '' },
  { section: 'Basic Information', uiFieldName: 'Sub Project Code', databaseName: 'Sub_Proj_code', fieldType: 'Text Field', defaultValue: '', mandatory: true, editable: false, defaults: 'textField', tableValue: 'tableA', table: '' },
  { section: 'Project Information', uiFieldName: 'Program ID', databaseName: 'prog_ID', fieldType: 'Text Field', defaultValue: '', mandatory: true, editable: false, defaults: 'textField', tableValue: 'tableB', table: '' },
  { section: 'Project Information', uiFieldName: 'Project Type', databaseName: 'Proj_tyep', fieldType: 'Date', defaultValue: '', mandatory: true, editable: false, defaults: '20-04-2020', tableValue: 'tableA', table: '' },
  { section: 'Project Information', uiFieldName: 'Activity', databaseName: 'Activity', fieldType: 'Dropdown', defaultValue: '', mandatory: true, editable: false, defaults: 'dropdown', tableValue: 'tableB', table: '' },
];

interface ViewDetails {
  viewValue: string; value: string;
}
interface SpecificSections {
  viewValue: string; value: string;
}
interface DefaultValues {
  viewValue: string; value: string;
}
interface DBtables {
  viewValue: string; value: string;
}

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumn13: string[] = ['section', 'uiFieldName', 'databaseName', 'fieldType', 'table', 'defaultValue', 'mandatory', 'editable'];
  dataSource13: MatTableDataSource<PeriodicElement>;
  userForm: FormGroup;

  /* dropdown inside the form - view details */
  viewDetails: ViewDetails[] = [
    { viewValue: 'Main Modules 01', value: 'mainModules01' },
    { viewValue: 'Main Modules 02', value: 'mainModules02' },
    { viewValue: 'Main Modules 03', value: 'mainModules03' },
  ];

  /* dropdown inside the form - specific values */
  specificSections: SpecificSections[] = [
    { viewValue: 'Main Section Modules 01', value: 'sainSectionModules01' },
    { viewValue: 'Main Section Modules 02', value: 'sainSectionModules02' },
    { viewValue: 'Main Section Modules 03', value: 'sainSectionModules03' },
  ];

  /* dropdown inside the table */
  defaultValues: DefaultValues[] = [
    { viewValue: 'Text Field', value: 'textField' },
    { viewValue: 'Dropdown', value: 'dropdown' },
    { viewValue: 'Date', value: 'date' },
  ];

  /* dropdown inside the table */
  dBtables: DBtables[] = [
    { viewValue: 'Table A', value: 'tableA' },
    { viewValue: 'Table B', value: 'tableB' },
    { viewValue: 'Table C', value: 'tableC' },
  ];


  date = new FormControl(new Date());
  /**
   * Constructor
   */
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    /* initiating the user form */
    this.userForm = this.fb.group({
      viewDetail: [''],
      specificSection: [''],
    });

    /* table data source */
    this.dataSource13 = new MatTableDataSource(users13);

  }

  ngAfterViewInit(): void {
    this.dataSource13.paginator = this.paginator;
    this.dataSource13.sort = this.sort;
  }

  /* form submit */
  onSubmit(): void {
    console.log(this.userForm.value);
  }

  /* dropdown select from the table */
  dropDownSelect(i, row): void {
    console.log(i, row);
  }

  /* tabledropdown select from the table */
  dropTablesDownSelect(i, row): void {
    console.log(i, row);
  }

  /* mandatory checkbox from the table */
  clickMandatory($event, i, row): void {
    console.log($event, i, row);
  }

  /* editable checkbox from the table */
  clickEditable($event, i, row): void {
    console.log($event, i, row);
  }
}
