import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../../api.service';
import config from '../../../../../src/auth_management_api_config.json';
import { Optional, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'environments/environment.prod';
import { truncate } from 'lodash';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { Router } from '@angular/router';
import { HSEQupdate } from 'app/main/Models/HSEQupdate';
import { SupplierWorkflow } from 'app/main/Models/SupplierWorkflow';
import { SupplierHistory } from 'app/shared/Models/SupplierHistory';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { SupplierAuditType } from 'app/main/Models/SupplierAuditType';
import { DatePipe } from '@angular/common';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


// import Swal from 'sweetalert2';

export interface DialogData {
  actionItemsVisible: any;
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface CriticalityScore {
  position: number;
  criticalityScore: any;
}

export interface SelectedCritics {
  position: number;
  scope: string;
  check: boolean;
  personalDetail: any;
}

const ELEMENT_DATA_SELECTEDCRITICS: SelectedCritics[] = [];
const ELEMENT_DATA_CRITICALITYSCORE: CriticalityScore[] = [];

@Component({
  selector: 'overlay',
  templateUrl: '../overlay/overlay.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class OverlayComponent {
  @ViewChild('htmlData')  pdfTable!: ElementRef;
  @ViewChild('categorytable')  categorytable!: ElementRef;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  iserrorHSEQ: boolean = false;
  issuccessHSEQ: boolean = false;  
  successmessageHSEQ = 'Successfully saved!';
  errormessageHSEQ = 'Something went wrong!';

  iserrorSaved: boolean = false;
  issuccessSaved: boolean = false;  
  successmessageSaved = 'Successfully saved!';
  errormessageSaved = 'Something went wrong!';

  
  

  apiToken = localStorage.getItem("auth0token");
  fetchedMyRoleN: any = [];
  // displayedCategoriesColumns: string[] = ['id', 'position', 'generalCategory', 'subCategory', 'detailCategory', 'isChecked', 'action'];
  // displayedCategoriesColumns: string[] = ['generalCategory', 'subCategory', 'detailCategory', 'action'];
  selectedCategoriesColumnsNew: string[] = ['MainCategory', 'MiddleCategory', 'SubCategory', 'Status'];

  apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
  allSchema: any = [];
  dataSourceAll = [];
  bulkData: any = [];
  fetchedMyRoleNew: string = null;
  fetchedMyRoleNewId: string = null;
  fetchedMyRoleNewDetail: string = null;
  criticality_data = [];
  isCollapsed = true;

  isAdmin: boolean;
  isAuditor: boolean;
  fetchedMyRole: any = [];
  profileJson: string = null;
  profileSet: any = [];
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];

  supplierId = 5;
  supplierCode = '';
  createdDate = '';
  supplierName = '';
  supplierStatus = '';

  action: string;
  local_data: any;
  allData: any;

  criticalityValue: string;
  criticalityScore: number;
  criticalityDetail = [];
  supplierSingleData: any;
  userrole;
  // dataSourceSelectedCritics = [];

  displayedSelectedCritics: string[] = ['position', 'scope', 'check', 'personalDetail'];
  dataSourceSelectedCritics = ELEMENT_DATA_SELECTEDCRITICS;

  displayedCriticalityScore: string[] = ['position', 'criticalityScore'];
  dataSourceCriticalityScore = ELEMENT_DATA_CRITICALITYSCORE;

  performcriticalityvalue = true;
  issrm = false;
  waitingmoerinfo = false;
  onlysaveandsubmit = false;
  isloading: boolean = false;

  // IsCritical: boolean;

  supplierNameFormControl = new FormControl('', [
    Validators.required
  ]);

  RegistrationNoFormControl = new FormControl('', [
    Validators.required
  ]);

  RegistrationNoExpiryFormControl = new FormControl('', [
    Validators.required
  ]);

  SupplierTypeFormControl = new FormControl('', [
    Validators.required
  ]);

  EstablishmentYearFormControl = new FormControl('', [
    Validators.required
  ]);

  CountryFormControl = new FormControl('', [
    Validators.required
  ]);

  CityFormControl = new FormControl('', [
    Validators.required
  ]);

  OtherCityFormControl = new FormControl('', [
    Validators.required
  ]);

  AddressLine1FormControl = new FormControl('', [
    Validators.required
  ]);

  AddressLine2FormControl = new FormControl('', [
    Validators.required
  ]);

  PostalCodeFormControl = new FormControl('', [
    Validators.required
  ]);

  POBoxFormControl = new FormControl('', [
    Validators.required
  ]);

  TitleFormControl = new FormControl('', [
    Validators.required
  ]);

  FirstNameFormControl = new FormControl('', [
    Validators.required
  ]);

  LastNameFormControl = new FormControl('', [
    Validators.required
  ]);

  PositionFormControl = new FormControl('', [
    Validators.required
  ]);

  TelephoneNoCountryCodeFormControl = new FormControl('', [
    Validators.required
  ]);

  TelephoneNoFormControl = new FormControl('', [
    Validators.required
  ]);

  ExtensionFormControl = new FormControl('', [
    Validators.required
  ]);

  EmailFormControl = new FormControl('', [
    Validators.required
  ]);

  MobileNoFormControl = new FormControl('', [
    Validators.required
  ]);

  MobileCountryCodeFormControl = new FormControl('', [
    Validators.required
  ]);

  FaxNoCountryCodeFormControl = new FormControl('', [
    Validators.required
  ]);

  FaxNoFormControl = new FormControl('', [
    Validators.required
  ]);

  JustificationFormControl = new FormControl('', [
    Validators.required
  ]);

  IsperformCriticality: boolean = false;
  displayedCategoriesColumns: string[] = ['id', 'generalCategory', 'subCategory', 'detailCategory', 'action'];
  displayedCategoriesColumnsNew: string[] = ['position', 'scope', 'check'];
  user_role: string;
  username: string;

  selectedItemsList = [];
  checkedIDs = [];

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

  dataSourceDashboard = new MatTableDataSource(this.checkboxesDataList);
  workflowcreated = false;
  isasaveandsubmit = false;
  HSEQ_action: any;
  actionItemsVisible: any;
  supplierType: any;
  hseq_cat: any;
  hseq_visible: boolean = false;


  /**
   * Constructor
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<OverlayComponent>, private datePipe: DatePipe,
    public dialog: MatDialog,
    private http: HttpClient,
    public auth: AuthService,
    private router: Router,
    private api: ApiService) {

    this.user_role = localStorage.getItem("userrole");
    this.IsperformCriticality = data['IsperformCriticality'];

    // HSEQ category check function adding to the data
    if (this.user_role == 'IMI-HSEQ') {
      this.displayedCategoriesColumns.push("hseqaction");
    }
    else {
      var arr = this.displayedCategoriesColumns.indexOf("hseqaction") > -1;

      if (arr) {
        this.displayedCategoriesColumns = this.displayedCategoriesColumns.filter(e => e !== 'hseqaction');
      }
      else {
        console.log("nothing to do");
      }
    }

    this.auth.user$.subscribe(
      async (profile) => (
        this.profileJson = JSON.stringify(profile, null, 2),
        this.profileSet = profile,
        this.readUser(),
        await this.getMyUserRole(),
        this.fetchSelectedItems(),
        this.fetchCheckedIDs()
      )
    );

    this.getWorkflowData();

    console.log(data);
    // console.log(data.supplierId);

    this.allData = data;
    this.actionItemsVisible = this.allData.actionItemsVisible;
    this.supplierType = this.allData.supplierType;

    // HSEQ Category change & button visibility
    if (this.actionItemsVisible == true && this.user_role == 'IMI-HSEQ') {
      this.hseq_visible = true;
    }
    else {
      this.hseq_visible = false;
    }

    console.log(this.allData);
    console.log(this.allData.supplierId);

    var supplierid = this.allData.supplierId;

    this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + supplierid).subscribe(data => {
      if (data) {
        this.supplierSingleData = data;;
        let catvalues = data[0].supplierCategories;
        if (catvalues) {
          if (this.user_role == 'IMI-HSEQ') {
            this.http.get(environment.nodeurl + '/api/supplier/hseqcatgegory?supplierID=' + supplierid).subscribe(data => {
              this.hseq_cat = data;
              this.dataSourceAll = [];

              for (let i = 0; i < this.hseq_cat.length; i++) {
                this.dataSourceAll.push({
                  id: i,
                  position: this.hseq_cat[i].position,
                  generalCategory: this.hseq_cat[i].generalCategory,
                  subCategory: this.hseq_cat[i].subCategory,
                  detailCategory: this.hseq_cat[i].detailCategory,
                  isChecked: this.hseq_cat[i].isChecked,
                  isSRMChecked: this.hseq_cat[i].isSRMChecked == 'Yes' ? true : false,
                  isHSEQChecked: this.hseq_cat[i].isHSEQChecked == 'Yes' ? true : false,
                  generalCode: this.hseq_cat[i].generalCode,
                  subCode: this.hseq_cat[i].subCode,
                  detailCode: this.hseq_cat[i].detailCode,
                  hseqUpdatedBy: this.hseq_cat[i].hseqUpdatedBy == undefined ? '' : this.hseq_cat[i].hseqUpdatedBy,
                  hseqUpdatedDateTime: this.hseq_cat[i].hseqUpdatedDateTime == undefined ? '' : this.hseq_cat[i].hseqUpdatedDateTime
                });
              }
            });
          }else{
            for (let i = 0; i < catvalues.length; i++) {
              this.dataSourceAll.push({
                id: i,
                position: catvalues[i].position,
                generalCategory: catvalues[i].generalCategory,
                subCategory: catvalues[i].subCategory,
                detailCategory: catvalues[i].detailCategory,
                isChecked: catvalues[i].isChecked,
                isSRMChecked: catvalues[i].isSRMChecked == 'Yes' ? true : false,
                isHSEQChecked: catvalues[i].isHSEQChecked == 'Yes' ? true : false,
                generalCode: catvalues[i].generalCode,
                subCode: catvalues[i].subCode,
                detailCode: catvalues[i].detailCode,
                hseqUpdatedBy: catvalues[i].hseqUpdatedBy,
                hseqUpdatedDateTime: catvalues[i].hseqUpdatedDateTime
              });

              this.HSEQ_action = catvalues[i].hseqUpdatedBy;
            }
          }
        }
      }

      this.criticalityScore = this.supplierSingleData.criticality;
      if (this.criticalityScore > 0) {

        if (this.criticalityScore >= 7) {
          this.criticalityValue = 'High Critical'
        }

        if (this.criticalityScore == 5) {
          this.criticalityValue = 'Critical'
        }

        if (this.criticalityScore == 6) {
          this.criticalityValue = 'Critical'
        }

        if (this.criticalityScore < 5) {
          this.criticalityValue = 'Non Critical'
        }
      } else {
        this.criticalityValue = 'Not performed'
      }

      this.http.get<any>(environment.nodeurl + '/api/supplier/criticality?suplierId=' + this.allData.supplierId).subscribe(data => {
        if (data) {
          this.dataSourceCriticalityScore = [];

          for (var product of data) {

            this.dataSourceCriticalityScore.push({
              position: product.position,
              criticalityScore: product.scope
            });

            this.checkboxesDataList.filter(x => x.position == product.position)[0].check = true;

          }
          this.selectedItemsList = [];
          this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
            return value.check
          });

          this.userrole = localStorage.getItem("userrole");
          if (this.userrole == 'IMI-SRM Analyst') {
            this.issrm = true;
          }

          if (this.supplierSingleData[0].status.indexOf('Awaiting Clarification from Supplier') != -1) {
            this.waitingmoerinfo = true;
            this.performcriticalityvalue = false;
          }
          else if (this.supplierSingleData[0].status.indexOf('Pending Criticality Matrix') != -1) {
            this.waitingmoerinfo = false;
            this.performcriticalityvalue = true;
          }
          // else if (this.supplierSingleData[0].status.indexOf('Awaiting for Site Audit dates') != -1 || this.supplierSingleData[0].status.indexOf('Awaiting for HSEQ Desktop Audit') != -1  ) {
          //   this.waitingmoerinfo = false;
          //   this.performcriticalityvalue = true;
          //   this.onlysaveandsubmit = true;
          // }
          else {
            this.performcriticalityvalue = this.supplierSingleData[0].process_id != '' ? false : true;
            this.waitingmoerinfo = this.supplierSingleData[0].process_id != '' ? true : false;
          }


          this.table.renderRows();


        }
      });
    });

  }
  criticalitysummary = new FormGroup({
    numbers: new FormControl('1653'),
    name: new FormControl('Design supplier 01-06'),
    code: new FormControl('IMI-2021-0161'),
    score: new FormControl('0'),
  });

  // openDialog(action, obj) {
  //     obj.action = action;
  //     // obj.detail = this.selectedCritics;
  //     console.log(action);

  //     if (action == 'Add') {
  //       const dialogRef = this.dialog.open(DialogComponent, {
  //         width: '1024px',
  //         height: '634px',
  //         data: this.allData
  //       });


  //       dialogRef.afterClosed().subscribe(result => {
  //         // if(result.event == 'Add'){

  //         console.log(result.data);

  //         this.addCrticality(result.data);

  //         // } else{

  //         // }
  //       });

  //     } else {
  //       // Do Nothing
  //     }
  //   }

  doAction() {
    console.log(this.local_data);
    this.dialogRef.close({ event: this.action, data: this.local_data });
    if (this.isasaveandsubmit) {
      location.reload();
    }
  }

  closeDefaultDialog() {
    this.dialogRef.close({ event: 'Cancel' });
    if (this.isasaveandsubmit) {
      location.reload();
    }
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDashboard.filter = filterValue.trim().toLowerCase();
  }

  changeSelection() {
    this.fetchSelectedItems()
  }

  fetchSelectedItems() {
    this.selectedItemsList = [];
    this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
      return value.check
    });
  }

  fetchCheckedIDs() {
    this.checkedIDs = []
    this.checkboxesDataList.forEach((value, index) => {
      if (value.check) {
        this.checkedIDs.push(value.position);
      }
    });
  }

  ngOnInit(): void {
    
  }

  addCrticality(row_obj) {
    console.log(row_obj);
    this.dataSourceSelectedCritics = row_obj;
    // this.criticalityDetail = row_obj;
    // this.dataSourceSupplier.push({
    //   position: product.SUPPLIER_ID,
    //   name: product.SUPPLIER_NAME,
    //   supplierCode: 'New',
    //   status: product.POSITION,
    //   createdDate: '15'
    // });
    var count = 1;
    for (var product of row_obj) {

      this.dataSourceCriticalityScore.push({
        position: count,
        criticalityScore: product.scope
      });

      // this.dataSourceSelectedCritics.push({
      //   position: product.position,
      //   scope: product.scope,
      //   check: product.check,
      //   personalDetail : this.allData
      // });

      count++;
    }

    this.table.renderRows();



    console.log(this.dataSourceCriticalityScore);

    // console.log('Id is : ' + this.allData.id);


  }
  // // ngOnInit(): void {

  // // }

  // changeSelection() {
  //   const selectedElm = document.getElementById('selected');

  //   function showChecked(){
  //     this.selectedElm.innerHTML = document.querySelectorAll('input[name=fruit]:checked').length;
  //   }

  //   document.querySelectorAll("input[name=fruit]").forEach(i=>{
  //     showChecked();
  //   });

  // }

  // fetchSelectedItems() {
  //   this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
  //     return value.isChecked
  //   });
  // }

  // fetchCheckedIDs() {
  //   this.checkedIDs = []
  //   this.checkboxesDataList.forEach((value, index) => {
  //     if (value.isChecked) {
  //       this.checkedIDs.push(value.id);
  //     }
  //   });
  // }


  async getMyUserRole() {

    console.log(this.profileSet);
    console.log(this.profileSet.sub);
    console.log(this.apiToken);

    const userId = 'auth0|5f87fcc300dbe80076505906';
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub + '/roles';


    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is my role');
        console.log(data);
        this.fetchedMyRole = data;

        for (var product of this.fetchedMyRole) {
          console.log(product.name);

          if (product.name == 'Admin') {
            this.isAdmin = true;
            console.log(this.isAdmin);

          } else {
            // this.isAdmin = false;
            // console.log(this.isAdmin);
            // Desktop Auditor
            if (this.fetchedMyRoleNew == 'Desktop Auditor') {
              this.isAuditor = true;
              console.log(this.isAuditor);
            } else {

            }
          }
        }
      });
    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7C5f87fcc300dbe80076505906/roles
  }

  readUser() {
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/
    // const body = '{"user_metadata":{"userRole":"'+this.selectedMyRole+'"}}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiToken
    });
    let options = { headers: headers };

    this.http.get(url, options)
      .subscribe(data => {
        console.log('Here is the Auth0 data');
        console.log(data);
        // console.log(data.user_metadata.userRole);
        // this.profileJson = JSON.stringify(profile, null, 2),
        this.fetchedMyRoleN = data;
        this.fetchedMyRoleNew = this.fetchedMyRoleN.user_metadata.userRole;
        this.fetchedMyRoleNewId = this.fetchedMyRoleN.user_metadata.userRoleId;
        this.fetchedMyRoleNewDetail = this.fetchedMyRoleN.user_metadata.userDetail;
        console.log(this.fetchedMyRoleNew);
        console.log(this.fetchedMyRoleNewId);
        console.log(this.fetchedMyRoleNewDetail);

        this.username = this.fetchedMyRoleN.username;
      });
  }

  async getWorkflowData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };
    let url = environment.workflowApiUrl + '/api/services/app/Document/GetSchemes';
    this.http.get(url, options)
      .subscribe(data => {
        this.allSchema = data;
        console.log('Here is the API data');
        console.log(data);
      });
  }

  closeDialogEmpty() {
    this.dialogRef.close({ event: 'Cancel', data: '' });

  }

  closeDialog() {
    
    this.isloading = true;
    this.criticality_data = [];
    this.criticality_data = this.selectedItemsList;
    // this.dialogRef.close({event:'Cancel',data:this.criticality_data});
    if (this.criticality_data.length > 0) {
      this.http.post<any>(environment.nodeurl + '/api/supplier/saveCriticality?supplierId=' + this.allData.supplierId, this.criticality_data).subscribe(data => {

        // Swal.fire('Successfully saved criticality value!', 'success');
        this.issuccessSaved = true;
        this.successmessageSaved = 'Successfully saved the criticality value!';
    
        for (let i = 0; i < this.dataSourceAll.length; i++) {
          if (this.dataSourceAll[i]["isSRMChecked"] == false) {
            this.dataSourceAll[i]["isSRMChecked"] = 'No';
          } else {
            this.dataSourceAll[i]["isSRMChecked"] = 'Yes';
          }

          if (this.dataSourceAll[i]["isHSEQChecked"] == false) {
            this.dataSourceAll[i]["isHSEQChecked"] = 'No';
          } else if (this.dataSourceAll[i]["isHSEQChecked"] == true) {
            this.dataSourceAll[i]["isHSEQChecked"] = 'Yes';
          }
        }

        this.http.post<any>(environment.nodeurl + '/api/supplier/updateCategory?supplierId=' + this.allData.supplierId, this.dataSourceAll).subscribe(data2 => {
          //   Swal.fire('Successfully saved the criticality value!', 'success');
          this.isloading = false;

        })
      })
    } else {
      this.iserrorSaved = true;
      this.errormessageSaved = 'Please select categories to continue!';
      this.isloading = false;
      //   Swal.fire('Please select categories to continue', '');
    }
  }

  // HSEQ Category update
  hseqCategoryUpdate(position) {
    for (let i = 0; i < this.dataSourceAll.length; i++) {
      if (this.dataSourceAll[i]["position"] == position) {
        if (this.dataSourceAll[i]["isHSEQChecked"] == false) {
          this.dataSourceAll[i]["isHSEQChecked"] = 'No';
        } else {
          this.dataSourceAll[i]["isHSEQChecked"] = 'Yes';
        }
      }
    }
  }

  // HSEQ Criticality Matrix update
  hseqAction() {

    this.issuccessHSEQ = true;
    this.successmessageHSEQ = 'Successfully saved!';

    var count: number = 0;
    var count2: number = 0;

    if (count == 0) {
      for (let i = 0; i < this.dataSourceAll.length; i++) {
        if (this.dataSourceAll[i]["isHSEQChecked"] == false) {
          this.dataSourceAll[i]["isHSEQChecked"] = 'No';
        } else {
          this.dataSourceAll[i]["isHSEQChecked"] = 'Yes';
        }

        count = count + 1;
      }
    }

    if (count == this.dataSourceAll.length && count2 == 0) {
      for (let i = 0; i < this.dataSourceAll.length; i++) {
        if (this.dataSourceAll[i]["isSRMChecked"] == false) {
          this.dataSourceAll[i]["isSRMChecked"] = 'No';
        } else {
          this.dataSourceAll[i]["isSRMChecked"] = 'Yes';
        }

        count2 = count2 + 1;
      }
    }

    if (count == this.dataSourceAll.length && count2 == this.dataSourceAll.length) {

      this.http.post<any>(environment.nodeurl + '/api/supplier/updateCategorybyhseq?supplierId=' + this.allData.supplierId, this.dataSourceAll).subscribe(
        data => {
          let catvalues = this.dataSourceAll;
          this.dataSourceAll = [];
          
          for (let i = 0; i < catvalues.length; i++) {
            this.dataSourceAll.push({
              id: i,
              position: catvalues[i].position,
              generalCategory: catvalues[i].generalCategory,
              subCategory: catvalues[i].subCategory,
              detailCategory: catvalues[i].detailCategory,
              isChecked: catvalues[i].isChecked,
              isSRMChecked: catvalues[i].isSRMChecked == 'Yes' ? true : false,
              isHSEQChecked: catvalues[i].isHSEQChecked == 'Yes' ? true : false,
              generalCode: catvalues[i].generalCode,
              subCode: catvalues[i].subCode,
              detailCode: catvalues[i].detailCode,
              hseqUpdatedBy: catvalues[i].hseqUpdatedBy,
              hseqUpdatedDateTime: catvalues[i].hseqUpdatedDateTime
            });
            this.HSEQ_action = catvalues[i].hseqUpdatedBy;
            count = count + 1;
          }
        (result => {
          // this.dialogRef.close();

          var CreatedDate = new Date().toISOString();
          var CreatedTime = new Date().toTimeString();
          var date_time_split = CreatedDate.split("T");
          var date = date_time_split[0];

          var time_split = CreatedTime.split(" ");
          var time = time_split[0] + "." + new Date().getMilliseconds();

          var HSEQaction: HSEQupdate = new HSEQupdate();
          HSEQaction.supplierID = this.allData.supplierId;
          HSEQaction.updatedBy = this.username;
          HSEQaction.updatedDateTime = date + " " + time;

          this.http.post<any>(environment.nodeurl + '/api/supplier/ishsequpdated', HSEQaction).subscribe(data2 => {
            console.log("updated");
            // this.dialogRef.close();
            this.http.get(environment.nodeurl + '/api/supplier/hseqcatgegory?supplierID=' + this.allData.supplierId).subscribe(data => {
              this.hseq_cat = data;
              this.dataSourceAll = [];

              for (let i = 0; i < this.hseq_cat.length; i++) {
                this.dataSourceAll.push({
                  id: i,
                  position: this.hseq_cat[i].position,
                  generalCategory: this.hseq_cat[i].generalCategory,
                  subCategory: this.hseq_cat[i].subCategory,
                  detailCategory: this.hseq_cat[i].detailCategory,
                  isChecked: this.hseq_cat[i].isChecked,
                  isSRMChecked: this.hseq_cat[i].isSRMChecked == 'Yes' ? true : false,
                  isHSEQChecked: this.hseq_cat[i].isHSEQChecked == 'Yes' ? true : false,
                  generalCode: this.hseq_cat[i].generalCode,
                  subCode: this.hseq_cat[i].subCode,
                  detailCode: this.hseq_cat[i].detailCode,
                  hseqUpdatedBy: this.hseq_cat[i].hseqUpdatedBy == undefined ? '' : this.hseq_cat[i].hseqUpdatedBy,
                  hseqUpdatedDateTime: this.hseq_cat[i].hseqUpdatedDateTime == undefined ? '' : this.hseq_cat[i].hseqUpdatedDateTime
                });
              }
            });
          })
        });
      })
    }
  }

  closeDialogAfterSubmit() {
    this.isloading = true;
    this.isasaveandsubmit = true;
    this.criticality_data = [];
    this.criticality_data = this.selectedItemsList;
    console.log(this.criticality_data);

    

    // this.dialogRef.close({event:'Cancel',data:this.criticality_data});
    if (this.criticality_data.length > 0) {
      const accessTokenBody = {
        userNameOrEmailAddress: 'admin',
        password: "123qwe",
        rememberClient: true
      }
      this.http.post<any>(environment.workflowApiUrl + '/api/TokenAuth/Authenticate', accessTokenBody).subscribe(data => {
        var workflowToken = data["result"].accessToken;
        localStorage.setItem('apiTokenworkflow', workflowToken);
        this.apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
        this.supplierworkflowInit(this.criticality_data.length, this.allData.supplierId);
        this.workflowcreated = true;


        

        this.isloading = false;

      });
    } else {
      this.workflowcreated = false;
      this.iserrorSaved = true;
      this.errormessageSaved = 'Please select categories to continue!';
      this.isloading = false;
      //   Swal.fire('Please select categories to continue', '');
    }

  }

  supplierworkflowInit(criticlaityvalue, supplierid) {
    var scheme = '';

    var audit_type: SupplierAuditType = new SupplierAuditType();
    audit_type.supplierID = Number(supplierid);

    if (criticlaityvalue < 5) {
      scheme = 'Normal Approval';
      audit_type.auditType = "NA";
    } else if (criticlaityvalue == 5 || criticlaityvalue == 6) {
      scheme = 'Critical Approval';
      audit_type.auditType = "Desktop Audit";
    }
    else {
      scheme = 'High Critical Approval';
      audit_type.auditType = "Site Audit";
    }

    const documentbody =
    {
      "title": this.supplierSingleData[0].supplier_code,
      "description": this.supplierSingleData[0].supplier_name,
      "creationTime": "2020-12-18T08:51:29.332Z",
      "state": "start",
      "scheme": scheme
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.apiTokenworkflow
    });
    let options = { headers: headers };

    this.http.post(environment.workflowApiUrl + '/api/services/app/Document/Create', documentbody, options).subscribe(data => {
      if (data["result"].id > 0) {
        var documentid = data["result"].id;
        var processid = data["result"].processId;

        var workflowData = new SupplierWorkflow();
        workflowData.SUPPLIER_ID = Number(this.allData.supplierId);
        workflowData.PROCESSID = processid;
        workflowData.DOCID = Number(documentid);

        this.http.post<any>(environment.nodeurl + '/api/supplier/saveSupplierWorkflow/', workflowData).subscribe(data => {
          // alert("Successfully saved workflow id!");	
          // Swal.fire('Successfully saved workflow id!', 'success');
          this.http.post<any>(environment.nodeurl + '/api/supplier/saveCriticality?supplierId=' + this.allData.supplierId, this.criticality_data).subscribe(data => {

            // Swal.fire('Successfully saved criticality value!', 'success');

            for (let i = 0; i < this.dataSourceAll.length; i++) {
              if (this.dataSourceAll[i]["isSRMChecked"] == false) {
                this.dataSourceAll[i]["isSRMChecked"] = 'No';
              } else {
                this.dataSourceAll[i]["isSRMChecked"] = 'Yes';
              }

              if (this.dataSourceAll[i]["isHSEQChecked"] == false) {
                this.dataSourceAll[i]["isHSEQChecked"] = 'No';
              } else if (this.dataSourceAll[i]["isHSEQChecked"] == true) {
                this.dataSourceAll[i]["isHSEQChecked"] = 'Yes';
              }
            }

            this.http.post<any>(environment.nodeurl + '/api/supplier/updateCategory?supplierId=' + this.allData.supplierId, this.dataSourceAll).subscribe(data2 => {
              //   Swal.fire('Successfully saved the criticality value and initiated the workflow!', 'success');
              this.isloading = false;
              this.issuccessSaved = true;
              this.successmessageSaved = 'Successfully saved & submitted the criticality value!';

              let userid = localStorage.getItem("userrole");
              let useremail = localStorage.getItem("useremail");
              let userfullname = localStorage.getItem("userfullname");

              let status = '';

              if (criticlaityvalue > 6) {
                status = 'Awaiting for Audit dates'
              } else if (criticlaityvalue == 5 || criticlaityvalue == 6) {
                status = 'Awaiting for HSEQ Desktop Audit'
              } else {
                status = 'Awaiting for SRM Recommendation'
              }

              var history = new SupplierHistory();
              history.status_id = 3;
              history.supplier_id = this.allData.supplierId.toString();
              history.status_remark = status;
              history.status_comment = 'Criticality Matix is completed';
              history.iscurrentstatus = 'Pending';
              history.userid = userfullname;
              history.userrole = userid;
              history.ÇommandName = 'Criticality performed';
              history.useremail = useremail;
              // history.createddate = new Date();
              // history.updateddate =new Date();
                this.api.saveHistory(history);

                this.http.post<any>(environment.nodeurl + '/api/supplier/audittype', audit_type).subscribe(data2 => {
                  console.log("Audit type updated success");
                });

              if(criticlaityvalue> 6){
                var role ='IMI-HSEQ';
                this.http.post<any>(environment.nodeurl + '/api/email/sendWorkflowTriggeredMail?roleName='+role+'&supplierid=' + history.supplier_id + '&content=' + 'highcritial' + '&category=chseq', null).subscribe(data => {
                });
              }
              else if (criticlaityvalue == 5 || criticlaityvalue == 6) {
                var role = 'IMI-HSEQ';
                this.http.post<any>(environment.nodeurl + '/api/email/sendNormalworkflowmail?roleName=' + role + '&supplierid=' + history.supplier_id + '&content=' + processid + '&category=chseq', null).subscribe(data => {
                });
              } else if (criticlaityvalue < 5) {
                var role = 'IMI-SRM Analyst';
                this.http.post<any>(environment.nodeurl + '/api/email/sendNormalworkflowmail?roleName=' + role + '&supplierid=' + history.supplier_id + '&content=' + processid + '&category=nsrm', null).subscribe(data => {
                });
              }
            })
          })
        })
        console.log('Here is the API data');
        console.log(data);
      } else {
        // Swal.fire('Something went wrong please contact administrator!', 'failed');
      }
    });
  }

  public openPDF():void {  
    var categorytable = this.categorytable.nativeElement;
    var pdfTable = this.pdfTable.nativeElement;
    var suppliertitle = document.createElement("p");
    suppliertitle.innerHTML="<b>Criticality Matrix</b>";   
    var categorytitle = document.createElement("p");
    categorytitle.innerHTML="<b>Category List</b>";   
    var pdfTitle = document.createElement("p");
    pdfTitle.innerHTML="<b>Scope of Supply</b>";    
    var downloadedtime = document.createElement("p");
    downloadedtime.innerHTML="<b>PDF Saved Date :</b>"+  this.datePipe.transform(new Date(), " h:mm a, dd-MMM-yyyy");    


    var category = 'Not Performed Yet';
    if(this.selectedItemsList ){
      category = this.selectedItemsList.length > 6 ? 'High Critical':((this.selectedItemsList.length == 5 ||this.selectedItemsList.length == 6)?'Critical':'Non Critical');
    }
    var t = "<table hidden cellspacing=\"0\" cellpadding=\"0\"><tr style=\"border: none;\"><td>Supplier Code</td><td>"+this.supplierSingleData[0].supplier_code+"</td></tr>"
    +"<tr style=\"border: none;\"><td>Name (in English)</td><td>"+this.allData.supplierName+"</td></tr><tr style=\"border: none;\"><td>Supplier Status</td><td>"+this.allData.supplierStatus+"</td></tr><tr style=\"border: none;\"><td>Criticality Score</td><td>"+(this.selectedItemsList?this.selectedItemsList.length:'0')+"</td></tr><tr style=\"border: none;\"><td>Criticality Matrix</td><td>"+category+"</td></tr><tr style=\"border: none;\"><td>Supplier Type</td><td>"+this.allData.supplierType+"</td></tr></table>";


    var suppliertitle1 = document.createElement("table");
    suppliertitle1.innerHTML = t;
    
    suppliertitle.appendChild(document.createElement("br"));
    suppliertitle.appendChild(suppliertitle1);
    suppliertitle.appendChild(document.createElement("br"));

    var htmlmain = suppliertitle.innerHTML+ "</br>" + categorytitle.innerHTML+ "</br>"+ categorytable.innerHTML+ "</br></br>"
                  + pdfTitle.innerHTML+ "</br>"+ pdfTable.innerHTML+ "</br></br></br>" +downloadedtime.innerHTML;
    

    var html = htmlToPdfmake(htmlmain);

    const documentDefinition = { content: html };

    pdfMake.createPdf(documentDefinition).download(this.allData.supplierName+" Criticality Matrix");

    }
}
