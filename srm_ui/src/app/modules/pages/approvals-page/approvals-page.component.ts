import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { CmOverlayComponent } from './cm-overlay/cm-overlay.component';
import { DialogOverviewExampleDialog } from './dialog-overview-example-dialog.component';
import { ApprovalConfirmationOverlayComponent } from './approval-confirmation-overlay/approval-confirmation-overlay.component';
import { RejectionConfirmationOverlayComponent } from './rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { KpiFields } from 'app/main/Models/Template';
import Swal from 'sweetalert2';
export interface ChangedSupplier {
    supplierId: string;
    supplierName: string;
    status: string;
    submittedDate: string;
    changedProperties: Array<Property>;
    oldCategories: Array<Category>;
    newCategories: Array<Category>;
    isGeneralChange: boolean;
  isCategoryChange: boolean;
  isBanckChange: boolean;
  

}

export interface DialogData {
    animal: string;
    name: string;
  }
export interface Property {
    property: string;
    page: string;
    tab: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
}
export interface Category {
    position: string;
    generalCategory: string;
    subCategory: string;
    detailCategory: string;
}

@Component({
    selector: 'approvals-page',
    templateUrl: './approvals-page.component.html',
    styleUrls: ['./approvals-page.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class ApprovalsPageComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    userrole: string = '';
    tagselected: any = 0;
    currentReqPage = '';
    dataSourceDashboardList: any = [];
    templateData: any = [];
    // dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    // selection = new SelectionModel<DashboardElement>(true, []);
    isloadeddata = true;
    selectedList: any;
    iserror = false;
    DataToExport = [];
    SupplierCode: boolean = false;
    SupplierName: boolean = false;
    Status: boolean = false;
    Email: boolean = false;
    Error: boolean = false;
    LastInterfacedDate: boolean = false;
    UserRole: boolean = false;

    allSelected: boolean = false;
    checkedList: any;
    filterValues = {};
    minDate = null;
    maxDate = null;

    errormessage = 'Select atleast one column';
    successmessage='Re-interface is done';
    issuccess = false;
    disableButton: boolean = false;

    supplierNameModel = '';
    statusModel = '';
    supplierCodemodel = '';
    locationModel = '';
    ifscodemodel = '';
    countryModel = '';
    classificationModel = '';
    supplierCode = '';
    createddatefrom = '';
    createddateto = '';
    lastsupsubmitdatefrom = '';
    lastsupsubmitdateto = '';
    srmreviewfrom='';
    srmreviewto='';
    auditcompletefrom='';
    auditcompleteto='';
    srmrecomfrom='';
    srmrecomto='';
    gmapprovedfrom='';
    gmapprovedto='';
    vpapprovedfrom ='';
    vpapprovedto ='';

    srmreviewdurModel = '';
    regisdurModel = '';
    auditcomModel= '';
    deptkpiResultModel='';
    srmkpiModel='';
    srmkpiResultModel = '';
    city = '';
    postalcode = '';
    adressline1 = '';
    firstname = '';
    email = '';
    crno = '';
    typeoforg = '';
    vatno = '';
    // tempData: DashboardElement[];
    totalSize = 0;
    previousCount =0;
    supplier: any;
    supplieremail: string;
    minCreatedDate = null;
    maxCreatedDate = null;

    changeDetailsColumns: string[] = ['page', 'tab', 'fieldName', 'oldValue', 'newValue'];
    changeDetailsDataSource: MatTableDataSource<Property>;

    categoryColumns: string[] = ['position', 'generalCategory', 'subCategory', 'detailCategory'];
    oldCategoryDataSource: MatTableDataSource<Category>;
    newCategoryDataSource: MatTableDataSource<Category>;

    
    remark1: string;
    remark2: string;
    decisionRemark: string = '';
    supplierId: number;
    supplierName: string;
    supplierRole: string;
    supplierNextRole: string;
    status: string;
    workflowStatus: string;
    isloadingdecision: boolean = false;
    submittedDate: string;
    configForm: FormGroup;
    approvalCategoryString: string;
    availableForApproval: boolean = false;
    isApproved: boolean = false;

    constructor(public dialog: MatDialog, private route: ActivatedRoute, private http: HttpClient,
                private _formBuilder: FormBuilder, private _fuseConfirmationService: FuseConfirmationService,
                private router: Router) {
    
        route.params.subscribe(params => {
            this.supplierId = Number(params["id"]);
        });
        this.supplierRole = localStorage.getItem('userrole');
        
        
        
    }

    ngOnInit(): void {
        this.http.get(environment.nodeurl + '/api/supplier/supplierChangesForApproval?supplierID=' + this.supplierId)
            .subscribe((data: ChangedSupplier) => {
                if (data) {
                                    
                    this.supplierName = data.supplierName;
                    this.status = data.status;
                    this.submittedDate = data.submittedDate;
                    
                    

                    // if (this.supplierRole == 'SRM Analyst' || this.supplierRole == 'Bank Reviewer' || this.supplierRole == 'Bank Approver')
                    // if (this.status == 'Awaiting Bank Reviewer change approval'){
                    //     if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                    //         this.availableForApproval = true;
                    //         this.workflowStatus = 'Awaiting Bank Approver change approval';
                    //     }    
                    // }

                    // if (this.status == 'Awaiting Bank Approver change approval'){
                    //     if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                    //         this.availableForApproval = true;
                    //         this.workflowStatus = 'Approved';
                    //     }    
                    // }

                    // if (this.status == 'Awaiting SRM change approval'){
                    //     if(this.supplierRole == 'IMI-SRM Analyst'){
                    //         this.availableForApproval = true;
                    //         this.workflowStatus = 'Awaiting GM change approval';
                    //     }    
                    // }
                    
                    // if (this.status == 'Awaiting GM change approval'){
                    //     if(this.supplierRole == 'IMI-GM'){
                    //         this.availableForApproval = true;
                    //         this.workflowStatus = 'Awaiting VP change approval';
                    //     }    
                    // } 

                    // if (this.status == 'Awaiting VP change approval'){
                    //     if(this.supplierRole == 'IMI-VP'){
                    //         this.availableForApproval = true;
                    //         this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                    //     }    
                    // } 

                        this.approvalCategoryString = "";
                        if(data.isGeneralChange){
                            this.approvalCategoryString = this.approvalCategoryString + "General"
                        }
                        if(data.isCategoryChange || data.isBanckChange){
                            this.approvalCategoryString = this.approvalCategoryString + ", "
                        }
                        if(data.isCategoryChange){
                            this.approvalCategoryString = this.approvalCategoryString + "Category"
                        }
                        if(data.isBanckChange){
                            this.approvalCategoryString = this.approvalCategoryString + ", "
                        }
                        if(data.isBanckChange){
                            this.approvalCategoryString = this.approvalCategoryString + "Bank"
                        }
            
                        if(data.isBanckChange || data.isCategoryChange || data.isGeneralChange){
                            this.approvalCategoryString = this.approvalCategoryString + " Change"
                        }
                        while(this.approvalCategoryString.charAt(0) === ',')
                        {
                            this.approvalCategoryString = this.approvalCategoryString.substring(1);
                        }


                    

                        
                        
                    this.changeDetailsDataSource = new MatTableDataSource<Property>(data.changedProperties);
                    this.changeDetailsDataSource.paginator = this.paginator;
                    this.changeDetailsDataSource.sort = this.sort;

                    this.oldCategoryDataSource = new MatTableDataSource<Category>(data.oldCategories);
                    this.oldCategoryDataSource.paginator = this.paginator;
                    this.oldCategoryDataSource.sort = this.sort;

                    this.newCategoryDataSource = new MatTableDataSource<Category>(data.newCategories);
                    this.newCategoryDataSource.paginator = this.paginator;
                    this.newCategoryDataSource.sort = this.sort;

                    // if (this.changeDetailsDataSource.data.length == 0 ){
                    //     this.approvalCategoryString = ""
                    // }

                    switch (this.approvalCategoryString) {
                        case "General Change":
                            if (this.status == 'Awaiting SRM change approval'){
                                if(this.supplierRole == 'IMI-SRM Analyst'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;


                                }    
                            }
                            break;
                        case " Category Change":
                            if (this.status == 'Awaiting GM change approval'){
                                if(this.supplierRole == 'IMI-GM'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting VP change approval';
                                }    
                            } 
    
                            if (this.status == 'Awaiting VP change approval'){
                                if(this.supplierRole == 'IMI-VP'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break;
                        case " , Bank Change":
                            if (this.status == 'Awaiting Bank Reviewer change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Approver change approval';
                                }    
                            }

                            if (this.status == 'Awaiting Bank Approver change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break;
                        case "General, Category Change":
                            if (this.status == 'Awaiting SRM change approval'){
                                if(this.supplierRole == 'IMI-SRM Analyst'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting GM change approval';
                                }    
                            }

                            if (this.status == 'Awaiting GM change approval'){
                                if(this.supplierRole == 'IMI-GM'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting VP change approval';
                                }    
                            } 

                            if (this.status == 'Awaiting VP change approval'){
                                if(this.supplierRole == 'IMI-VP'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break; 
                        case "General, , Bank Change":
                            if (this.status == 'Awaiting SRM change approval'){
                                if(this.supplierRole == 'IMI-SRM Analyst'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                                }    
                            }

                            if (this.status == 'Awaiting Bank Reviewer change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Approver change approval';
                                }    
                            }

                            if (this.status == 'Awaiting Bank Approver change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break;  
                        case " Category, Bank Change":
                            if (this.status == 'Awaiting GM change approval'){
                                if(this.supplierRole == 'IMI-GM'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting VP change approval';
                                }    
                            } 

                            if (this.status == 'Awaiting VP change approval'){
                                if(this.supplierRole == 'IMI-VP'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                                }    
                            } 

                            if (this.status == 'Awaiting Bank Reviewer change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Approver change approval';
                                }    
                            }

                            if (this.status == 'Awaiting Bank Approver change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break;
                        case "General, Category, Bank Change":
                            if (this.status == 'Awaiting SRM change approval'){
                                if(this.supplierRole == 'IMI-SRM Analyst'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting GM change approval';
                                }    
                            }

                            if (this.status == 'Awaiting GM change approval'){
                                if(this.supplierRole == 'IMI-GM'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting VP change approval';
                                }    
                            } 

                            if (this.status == 'Awaiting VP change approval'){
                                if(this.supplierRole == 'IMI-VP'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                                }    
                            } 

                            if (this.status == 'Awaiting Bank Reviewer change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Awaiting Bank Approver change approval';
                                }    
                            }

                            if (this.status == 'Awaiting Bank Approver change approval'){
                                if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                                    this.availableForApproval = true;
                                    this.workflowStatus = 'Approved';
                                    this.isApproved = true;
                                }    
                            }
                            break;                            
                        default:

                            break;
                    }
                    
                    // // General
                    // if (this.approvalCategoryString.includes('General')){
                    //     if (this.status == 'Awaiting SRM change approval'){
                    //         if(this.supplierRole == 'IMI-SRM Analyst'){
                    //             this.availableForApproval = true;
                    //             this.workflowStatus = 'Approved';
                    //         }    
                    //     }
                    // } 

                    // // Category
                    // if (this.approvalCategoryString.includes('Category')){
                    //     if (this.status == 'Awaiting GM change approval'){
                    //         if(this.supplierRole == 'IMI-GM'){
                    //             this.availableForApproval = true;
                    //             this.workflowStatus = 'Awaiting VP change approval';
                    //         }    
                    //     } 

                    //     if (this.status == 'Awaiting VP change approval'){
                    //         if(this.supplierRole == 'IMI-VP'){
                    //             this.availableForApproval = true;
                    //             this.workflowStatus = 'Approved';
                    //         }    
                    //     } 
                    // }
                    //     // Bank
                    //     if (this.approvalCategoryString.includes('Bank')){
                    //         if (this.status == 'Awaiting Bank Reviewer change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Approver change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting Bank Approver change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Approved';
                    //             }    
                    //         }
                    //     }

                    //     // General + Category
                    //     if (this.approvalCategoryString.includes('General') && this.approvalCategoryString.includes('Category')){
                    //         if (this.status == 'Awaiting SRM change approval'){
                    //             if(this.supplierRole == 'IMI-SRM Analyst'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting GM change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting GM change approval'){
                    //             if(this.supplierRole == 'IMI-GM'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting VP change approval';
                    //             }    
                    //         } 

                    //         if (this.status == 'Awaiting VP change approval'){
                    //             if(this.supplierRole == 'IMI-VP'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Approved';
                    //             }    
                    //         } 

                    //     }

                    //     // General + Bank
                    //     if (this.approvalCategoryString.includes('General') && this.approvalCategoryString.includes('Bank')){
                    //         if (this.status == 'Awaiting SRM change approval'){
                    //             if(this.supplierRole == 'IMI-SRM Analyst'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting Bank Reviewer change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Approver change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting Bank Approver change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Approved';
                    //             }    
                    //         }
                    //     }

                    //     // Category + Bank
                    //     if (this.approvalCategoryString.includes('Category') && this.approvalCategoryString.includes('Bank')){
                    //         if (this.status == 'Awaiting GM change approval'){
                    //             if(this.supplierRole == 'IMI-GM'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting VP change approval';
                    //             }    
                    //         } 

                    //         if (this.status == 'Awaiting VP change approval'){
                    //             if(this.supplierRole == 'IMI-VP'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                    //             }    
                    //         } 

                    //         if (this.status == 'Awaiting Bank Reviewer change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Approver change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting Bank Approver change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Approved';
                    //             }    
                    //         }
                    //     }    

                    //     // General + Category + Bank
                    //     if (this.approvalCategoryString.includes('General') && this.approvalCategoryString.includes('Category') && this.approvalCategoryString.includes('Bank')){
                    //         if (this.status == 'Awaiting SRM change approval'){
                    //             if(this.supplierRole == 'IMI-SRM Analyst'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting GM change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting GM change approval'){
                    //             if(this.supplierRole == 'IMI-GM'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting VP change approval';
                    //             }    
                    //         } 

                    //         if (this.status == 'Awaiting VP change approval'){
                    //             if(this.supplierRole == 'IMI-VP'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Reviewer change approval';
                    //             }    
                    //         } 

                    //         if (this.status == 'Awaiting Bank Reviewer change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Awaiting Bank Approver change approval';
                    //             }    
                    //         }

                    //         if (this.status == 'Awaiting Bank Approver change approval'){
                    //             if(this.supplierRole == 'IMI-Treasury Bank Approver'){
                    //                 this.availableForApproval = true;
                    //                 this.workflowStatus = 'Approved';
                    //             }    
                    //         }
                    //     }

                }
            });

            this.configForm = this._formBuilder.group({
                title: 'Are you sure want to perform this action?',
                message: '<span class="font-medium">This action cannot be undone!</span>',
                icon: this._formBuilder.group({
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Yes',
                        color: 'primary'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: false
            });

    }

    reject() {

            const dialogRef1 = this.dialog.open(DialogOverviewExampleDialog, {
              data: {remark1: this.remark1, remark2: this.remark2},
            });
        
            dialogRef1.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.remark1 = result;
              console.log('remark1 : ' + this.remark1 );
              console.log('remark2 : ' + this.remark2 );
              if(this.remark1){
                this.isloadingdecision = true;
                  
                this.http.post<any>(environment.nodeurl + '/api/supplier/supplierChangesApproval?supplierID=' + this.supplierId + '&approvalStatus=Rejected' + '&isApproved=' + false, null)
                    .subscribe(data => {

                        this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId).subscribe((data) => {

                            this.supplier = data[0];
                            this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.remark1 + '&category=changereject').subscribe(async (data) => {
                                
                                this.isloadingdecision = false;
                                this.issuccess = true;
                                this.successmessage = 'Successfully rejected change request!';
                                this.disableButton = true;
                                // this.router.navigate(['/approval-changes-landing/']);
            
                            });  
                        });

                    });  
              }
            });

        // const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        // dialogRef.addPanelClass('confirmation-dialog');
        // dialogRef.afterClosed().subscribe(async (result) => {
        //     if (result == 'confirmed') {
                              
        //     }
        // });



    }
 
    showrolebased() {
        if(this.supplierRole){
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result == 'confirmed') {
                    this.http.post<any>(environment.nodeurl + '/api/supplier/supplierChangesApproval?supplierID=' + this.supplierId + '&isApproved=' + true, null)
                        .subscribe(data => {
                            this.router.navigate(['/approval-changes-landing/']);
                        });                
                }
            });
        }
    }

    loadDatabasedStatus() {
        if(this.supplierRole){
           if (this.supplierRole == 'SRM Analyst' || this.supplierRole == 'Bank Reviewer' || this.supplierRole == 'Bank Approver') {
                this.router.navigate(['/approval-changes-landing/']);                     
            }
            
        }
    }

    approve() {
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        dialogRef.addPanelClass('confirmation-dialog');
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.isloadingdecision = true;
                this.http.post<any>(environment.nodeurl + '/api/supplier/supplierChangesApproval?supplierID=' + this.supplierId + '&approvalStatus=' + this.workflowStatus + '&isApproved=' + this.isApproved, null)
                    .subscribe(data => {
                        this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId)
        .subscribe(data => {

            var supplier = data[0];
            let catvalues = data[0].supplierCategories;
                if (catvalues) {
                    var categories = []
                    for (let i = 0; i < catvalues.length; i++) {
                        categories.push({
                            //id: i,
                            position: catvalues[i].position,
                            generalCategory: catvalues[i].generalCategory,
                            subCategory: catvalues[i].subCategory,
                            detailCategory: catvalues[i].detailCategory,
                            isChecked: catvalues[i].isChecked,
                            isSRMChecked: catvalues[i].isSRMChecked,
                            generalCode: catvalues[i].generalCode,
                            subCode: catvalues[i].subCode,
                            detailCode: catvalues[i].detailCode
                        });
                    }
                }
        //         this.http.post<any>(environment.nodeurl + '/api/supplier/register', supplier).subscribe(async data => {
        //         this.http.post<any>(environment.nodeurl + '/api/supplier/sendchangeapprovalmail?rolename=' + this.supplierRole + '&supplierid=' + this.supplierId)
        // .subscribe(data => {

            if(this.workflowStatus == 'Awaiting SRM change approval'){
                this.supplierNextRole = 'IMI-SRM Analyst'
            }
            if(this.workflowStatus == 'Awaiting GM change approval'){
                this.supplierNextRole = 'IMI-GM'
            }
            if(this.workflowStatus == 'Awaiting Bank Reviewer change approval'){
                this.supplierNextRole = 'IMI-Treasury Bank Reviewer'
            }
            if(this.workflowStatus == 'Awaiting Bank Approver change approval'){
                this.supplierNextRole = 'IMI-Treasury Bank Approver'
            }
            if(this.workflowStatus == 'Awaiting VP change approval'){
                this.supplierNextRole = 'IMI-VP'
            }
            if(this.workflowStatus == 'Approved'){
                this.supplierNextRole = 'None'
            }

            if(this.workflowStatus != 'Approved'){
                this.http.post<any>(environment.nodeurl + '/api/supplier/sendchangeapprovalmail?rolename=' + this.supplierNextRole + '&supplierid=' + this.supplierId ,supplier).subscribe(data => {

                this.isloadingdecision = false;
                this.issuccess = true;
                this.successmessage = 'Successfully approved change request!';
                this.disableButton = true;
                    this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+this.supplierId).subscribe(data2 => {
                        if (data2) {
                            this.previousCount = data2.length;
                            // if(element.userrole == 'IMI-VP'){
                                this.interfaceSupplierData(supplier,categories);
                            // }else{
                                // this.interfaceBankData(supplier);
                            // }
                        }
                    });
    
                });
            }

            if(this.workflowStatus == 'Approved'){

                this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId).subscribe((data) => {

                    this.supplier = data[0];

                this.supplieremail = this.supplier.email;
                    this.http.get<any>(environment.nodeurl + '/api/email/sendChangeApproveSupplierMail?email=' + this.supplieremail + '&supplierid=' + this.supplierId + '&content=no&category=vp').subscribe((data) => {
                        this.isloadingdecision = false;
                        this.issuccess = true;
                        this.successmessage = 'Successfully approved change request!';
                        this.disableButton = true;

                    });
                });

                
            }

            
        });
                        //this.router.navigate(['/approval-changes-landing/']);
                    });                
            }
        });
    }

    getSupplierData(element){
        this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + element.supplierId)
        .subscribe(data => {

            var supplier = data[0];
            let catvalues = data[0].supplierCategories;
                if (catvalues) {
                    var categories = []
                    for (let i = 0; i < catvalues.length; i++) {
                        categories.push({
                            //id: i,
                            position: catvalues[i].position,
                            generalCategory: catvalues[i].generalCategory,
                            subCategory: catvalues[i].subCategory,
                            detailCategory: catvalues[i].detailCategory,
                            isChecked: catvalues[i].isChecked,
                            isSRMChecked: catvalues[i].isSRMChecked,
                            generalCode: catvalues[i].generalCode,
                            subCode: catvalues[i].subCode,
                            detailCode: catvalues[i].detailCode
                        });
                    }
                }

                this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+element.supplierId).subscribe(data2 => {
                    if (data2) {
                        this.previousCount = data2.length;
                        if(element.userrole == 'IMI-VP'){
                            this.interfaceSupplierData(supplier,categories);
                        }else{
                            // this.interfaceBankData(supplier);
                        }
                    }
                });


        });
    }

    interfaceSupplierData(supplier,categories){
        const ifsSupplier = {
            supplier_id: supplier.supplier_id,
            supplier_name: supplier.supplier_name,
            email: supplier.email,
            supplier_name_arabic: supplier.supplier_name_arabic,
            establishment_year: supplier.establishment_year,
            issued_by: supplier.issued_by,
            web_site: supplier.web_site,
            supplier_type: supplier.supplier_type,
            country: supplier.country,
            city: supplier.city,
            other_city: supplier.other_city,

            po_box: supplier.po_box,
            postal_code: supplier.postal_code,
            address_line1: supplier.address_line1,
            address_line2: supplier.address_line2,
            title: supplier.title,
            first_name: supplier.first_name,
            last_name: supplier.last_name,
            telphone_country_code: supplier.telphone_country_code,
            telephone_no: supplier.telephone_no,
            extension: supplier.extension,
            position: supplier.position,
            mobile_country_code: supplier.mobile_country_code,
            mobile_no: supplier.mobile_no,
            fax_country_code: supplier.fax_country_code,
            fax_no: supplier.fax_no,
            additional_material: supplier.additional_material,

            cr_no: supplier.cr_no,
            vat_no: supplier.vat_no,
            gosi_certificate: supplier.gosi_certificate,

            parentcompany: supplier.parentcompany,
            sistercompany: supplier.sistercompany,
            ownercompany: supplier.ownercompany,
            operatingProfit1: supplier.operatingProfit1,
            operatingProfit2: supplier.operatingProfit2,
            netIncome1: supplier.netIncome1,
            netIncome2: supplier.netIncome2,
            currentAsset1: supplier.currentAsset1,
            currentAsset2: supplier.currentAsset2,
            totalLiable1: supplier.totalLiable1,
            totalLiable2: supplier.totalLiable2,
            totalEquity1: supplier.totalEquity1,
            totalEquity2: supplier.totalEquity2,
            noOfYears: supplier.noOfYears,
            ownsPlantEquip: supplier.ownsPlantEquip,
            designnCap: supplier.designnCap,
            finishProd: supplier.finishProd,
            internalPolicy: supplier.internalPolicy,
            registeredOrg: supplier.registeredOrg,
            suspendedProj1: supplier.suspendedProj1,
            suspendedProj2: supplier.suspendedProj2,
            litigation1: supplier.litigation1,
            litigation2: supplier.litigation2,
            compliance1: supplier.compliance1,
            compliance2: supplier.compliance2,
            shareholder1: supplier.shareholder1,
            shareholder2: supplier.shareholder2,
            labour1: supplier.labour1,
            labour2: supplier.labour2,
            environment1: supplier.environment1,
            environment2: supplier.environment2,
            imiInterested1: supplier.imiInterested1,
            imiInterested2: supplier.imiInterested2,
            hse1: supplier.hse1,
            hse2: supplier.hse2,
            docuHse: supplier.docuHse,
            isohealth: supplier.isohealth,
            envtMgt1: supplier.envtMgt1,
            envtMgt2: supplier.envtMgt2,
            dedicatedpers: supplier.dedicatedpers,
            statistic: supplier.statistic,
            qualityPolicy1: supplier.qualityPolicy1,
            qualityPolicy2: supplier.qualityPolicy2,
            qualityMgt: supplier.qualityMgt,
            qualityResp1: supplier.qualityResp1,
            qualityResp2: supplier.qualityResp2,
            qualityreviewDate: supplier.qualityreviewDate,
            typeOfOrganization: supplier.typeOfOrganization,
            typeOfOrganization2: supplier.typeOfOrganization2,
            managerialno: supplier.managerialno,
            technicalno: supplier.technicalno,
            operationsno: supplier.operationsno,
            saudiNationalsno: supplier.saudiNationalsno,
            totallno: supplier.totallno,
            hijriSelected: supplier.hijriSelected,

            bankCountryCodes: supplier.bankCountryCodes,
            // qualityResp2Ctrl: supplier.qualityResp2,
            bankName: supplier.bankName != 'Other' ? supplier.bankName : supplier.otherBankName,
            swiftcode: supplier.swiftcode,
            accountHolderName: supplier.accountHolderName,
            ibanNo: supplier.ibanNo,
            bankAddress: supplier.bankAddress,
            bankAddress2: supplier.bankAddress2,
            accountCurrency: supplier.accountCurrency,
            account_number: supplier.account_number,
            isEmergencySupplier: 'FALSE',
            supplierCategories: categories,
            wasalAddress: supplier.wasalAddress,
            additionalCtrl: supplier.additionalCtrl,
            additionalCtrl2: supplier.additionalCtrl2,
            additionalCtrl3: supplier.additionalCtrl3,
            additionalCtrl4: supplier.additionalCtrl4,
            additionalCtrl5: supplier.additionalCtrl5,
            supplier_extra: supplier.supplier_extra,
            PortalAccess: 'TRUE'
        }

        this.http.post<any>(environment.ifsIntegrationUrl + '/api/update/', ifsSupplier).subscribe(data3 => {
            if (data3["Response"]) {
                if (data3["Message"] != null) {
                    var ifscode = data3["Message"];
                    this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+ifsSupplier.supplier_id).subscribe(data2 => {
                        if (data2) {
                            var messagelist = data2;
                            if(this.previousCount == data2.length){
                                this.http.post<any>(environment.nodeurl + '/api/supplier/ifsreinterfacestatus?supplierId=' + ifsSupplier.supplier_id, null).subscribe(data => {
                                    this.getSuppliers();

                                });
                            }
                        }
                    });

                }
                this.issuccess = true;

            }

            Swal.close();
            this.issuccess = true;
        });
    }

    async getSuppliers() {
        var kpiDto = new KpiFields();
        kpiDto.startindex = 0;
        kpiDto.pagesize = 5;

        this.isloadeddata = true;
        var supplierid= 0;

        this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+supplierid).subscribe(data2 => {
            if (data2) {
                this.isloadeddata = false;
                var messagelist = data2;
                // this.filltabledata(messagelist, 'all');
                // this.totalSize = messagelist.length;
                // this.dataSourceDashboard.paginator = this.tableOnePaginator;
            } else {
            }
            setTimeout(function () {
                this.issuccess = false;
                this.iserror = false;
            }.bind(this), 2000);
        });
    }

    public downloadFile(fileUrl: string, isNew: boolean) {
        window.location.href = environment.nodeurl + '/api/file/downloadNeedmore?fileUrl=' + fileUrl + '&isNew=' + isNew;
    }

    getData(supplierId){
        window.location.href = 'https://tstruhsrmapp01.imi-ksa.com:4460/SRMETClient/dashboard/inner/d/' + supplierId;
        // this.router.navigate(['/dashboard/inner/d/' + supplierId]);
    }
}