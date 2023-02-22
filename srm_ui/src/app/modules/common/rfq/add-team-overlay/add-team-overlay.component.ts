/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IFSEmployeeService } from 'app/shared/Services/etendering/ifs-employee-service';
import { IFSEmployeeSearchModel } from 'app/main/Models/etendering/ifs-employee-search-model';
import { IFSEmployeeModel } from 'app/main/Models/etendering/ViewModels/ifs-employee-model';
import { CollaborationTeamService } from 'app/shared/Services/etendering/collaboration-team.service';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { CollaborationTeamTextViewModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-view-model';
import { RolesService } from 'app/shared/Services/roles.service';
import { User } from '@auth0/auth0-angular';
import { RFQCollaborationTeamAccessModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-access-model';
import { RFQCollaborationModel } from 'app/main/Models/etendering/rfq-collaboration-model';
import { RFQCollaborationTeamModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-model';
import { RfqCollaborationService } from 'app/shared/Services/etendering/RFQ/rfq-collaboration.service';
import { Deferred } from 'jquery';
import { analytics } from 'app/mock-api/dashboards/analytics/data';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { loadavg } from 'os';
import { TouchSequence } from 'selenium-webdriver';
import { threadId } from 'worker_threads';
export interface RowData {
  teamUserName: string;
  teamPosition: string;
  teamEmail: string;
}

export interface RowData2 {
  team: string;
  description: string;
}
/** Constants used to fill up our data base. */
const TEAMUSERNAME: string[] = [
  'Muhammed Munaad', 'Muhammed Rafiq'
];
const TEAMPOSITION: string[] = [
  'Technical Lead'
];
const TEAMEMAIL: string[] = [
  'A@gmail.com', 'B@gmail.com'
];

/** Constants used to fill up our data base. */
const TEAM: string[] = [
  'Quality Engineering', 'Quality Raw Materials'
];
const DESCRIPTION: string[] = [
  'Engineering Quality Team', 'Packaging Quality Team'
];

@Component({
  selector: 'add-team-overlay',
  templateUrl: './add-team-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddTeamOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild('secPaginator',  {static: false}) secPaginator: MatPaginator;
  @ViewChild('firstPaginator' , {static: false}) firstPaginator: MatPaginator;
  
  pageEvent1: PageEvent;
  pageEvent2: PageEvent;

  displayedColumn: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail', 'primaryUser'];
  displayedColumn1: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail'];
  dataSource: MatTableDataSource<RowData>;

  displayedColumn2: string[] = ['id', 'team', 'description'];
  dataSource2: MatTableDataSource<RowData2>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  templateData: any = [];
  useremail: string = '';

  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  overlayTxt = "";

  isSaved:boolean =false;
  searchnamePri:string='';
  searchnameSec:string='';
  // New code starting from below:
  //costFactorGroupSearchModel: CostFactorGroupSearchModel = new CostFactorGroupSearchModel();

  ifsEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
  collaborationTeamSearchModel: CollaborationTeamSearchModel = new CollaborationTeamSearchModel();

  ifsSEmployeePrimaryListModel: IFSEmployeeModel[] = [];
  ifsSEmployeePrimaryModel: IFSEmployeeModel;

  //ifsSEmployeePrimaryListModel : any[];

  ifsSEmployeeSecondaryListModel: IFSEmployeeModel[] = [];
  SelectedIFSSEmployeePrimaryModel: IFSEmployeeModel[] = [];
  rfxIFSSEmployeePrimaryModel: IFSEmployeeModel[] = [];

  //
  SelectedIFSSEmployeeSecondaryModel: IFSEmployeeModel[] = [];
  //
  CollabAccess = [];
  collaborationTeamTextViewModel: CollaborationTeamTextViewModel[];
  saveTeamName: string;
  saveTeamDesc: string;
  isSearchPrimUser: boolean;
  isSearchSecUser: boolean;
  isSearchUser: boolean;
  isDisabledCheckbox: boolean;
  openSubTab: boolean = false;
  openTeamTab: boolean = false;
  openrfxAccessTab: boolean = false;


  primaryUserId: string;
  SubsituteUserId: string;
  collaborationTeamId: string;

  SavecollaborationTeamTextViewModel: CollaborationTeamTextViewModel = new CollaborationTeamTextViewModel();
  rfqCollaborationTeamAccessModel: RFQCollaborationTeamAccessModel = new RFQCollaborationTeamAccessModel();
  rfqCollaborationTeamAccessModelList = [];
  rfqAccessModelList: RFQCollaborationTeamAccessModel[] = [];


  rfxRoleList = [];
  SelectedrfxRoleList = [];
  SelectedrfxRoleId: any;

  isButtonVisible = false;
  pagesAccess = [];
  SelectedpagesAccess = [];
  AccessLvl = [];
  SelectedAccessLvl = [];

  isFull: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  rfqId: string;
  colTeamAccessModel: any;
  pageEvent: PageEvent;
  basicdataTeam: string;
  teamModel: CollaborationTeamTextViewModel = new CollaborationTeamTextViewModel();
  selectedprimaryuserCount: boolean = false;
  isTeamSelected: boolean = false;
isLoaded=true;
  selectedTeamChipFirst: any[] = [];
  selectedTeamChipSecond: any[] = [];
isEditTeam:boolean=false;
ifsprimEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
ifsSecoundaryEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();

  constructor(public dialogRef: MatDialogRef<AddTeamOverlayComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
    private ifsEmployeeService: IFSEmployeeService,
    private collaborationTeamService: CollaborationTeamService,
    private rolesService: RolesService,
    private rfqCollaborationService: RfqCollaborationService
  ) {
    //debugger
    this.rfqId = data.rfqId;
    if (data.colTeamAccessModel != null) {
      this.colTeamAccessModel = data.colTeamAccessModel;
    }
    const users = Array.from({ length: 3 }, (_, k) => createNewRow(k + 1));
    const users2 = Array.from({ length: 3 }, (_, k) => createNewRow2(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dataSource2 = new MatTableDataSource(users2);
    this.overlayTxt = data.overlayTxt;
if(this.overlayTxt=='Edit Collaboration Team Member'){
  this.isEditTeam=true;
}
    this.collaborationTeamSearchModel.pageSize = 10000;
    this.collaborationTeamSearchModel.page = 1;

    this.ifsprimEmployeeSearchModel.pageSize = 10;
    this.ifsprimEmployeeSearchModel.page = 1;
    this.ifsSecoundaryEmployeeSearchModel.pageSize = 10;
    this.ifsSecoundaryEmployeeSearchModel.page = 1;
  }
  ngOnInit(): void {
    //debugger
    this.rfxRoleList = [
      { id: 1, name: 'Buyer' },
      { id: 2, name: 'Manager' },
      { id: 3, name: 'Technical Bid Evaluator' },
      { id: 4, name: 'Commercial Bid Evaluator' },
      { id: 5, name: 'Watcher' }
    ];
    this.pagesAccess = [
      { id: 1, name: 'Full RFQ' },
      { id: 2, name: 'Evaluations - TBE' },
      { id: 3, name: 'Evaluations - TBE' },
      { id: 4, name: 'Evaluations - CBE' },
      { id: 5, name: ' Scoring & Evaluations' }
    ];
    this.AccessLvl = [
      { id: 1, name: 'Full' },
      { id: 2, name: 'Edit' },
      { id: 3, name: 'View' },

    ];

    this.teamModel.id = "00000000-0000-0000-0000-000000000000";

   

    this.getRoles();
    this.GetIFSEmployee();
   
    
  }
  
  displaySelection() {
    this.rfxRoleList
    //console.log(this.rfxRoleList);
    console.log("this.SelectedrfxRoleList");
    //  console.log(this.SelectedrfxRoleList);

    console.log("this.SelectedAccessLvl");
    // console.log(this.SelectedAccessLvl);


  }
  onChange(Value) {

    this.SelectedAccessLvl.push(Value); // or do whatever as required
  }

  saveRFQCollaborationTeamAccess() {
this.isSaved=true;
    //this.teamModel = this.collaborationTeamTextViewModel.find(x => x.isChecked == true);
    //console.log(this.rfqAccessModelList);
    for (let z = 0; z < this.rfqAccessModelList.length; z++) {
      for (let i = 0; i < this.rfqAccessModelList[z].selectedrfxRoleList.length; i++) {
        for (let j = 0; j < this.rfqAccessModelList[z].selectedpagesAccess.length; j++) {
          this.rfqCollaborationTeamAccessModel = new RFQCollaborationTeamAccessModel();
          this.rfqCollaborationTeamAccessModel.role = this.rfqAccessModelList[z].selectedrfxRoleList[i];
          this.rfqCollaborationTeamAccessModel.pageName = this.rfqAccessModelList[z].selectedpagesAccess[j];

          this.rfqAccessModelList[z].selectedAccessLvl.forEach(x => {
            if (x == "Full") {
              this.rfqCollaborationTeamAccessModel.isEdit = true;
              this.rfqCollaborationTeamAccessModel.isView = true;
            } else if (x == "Edit") {
              this.rfqCollaborationTeamAccessModel.isEdit = true;
            } else if (x == "View") {
              this.rfqCollaborationTeamAccessModel.isView = true;
            }
          });

          this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam = new RFQCollaborationTeamModel();
          // console.log(1);
          this.rfqCollaborationTeamAccessModel.substituteUserId = this.rfqAccessModelList[z].substituteUserId;
          // console.log(this.rfqAccessModelList[z]);
          //console.log(2);
          this.rfqCollaborationTeamAccessModel.userId = this.rfqAccessModelList[z].id;
          this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.rfqId = this.rfqId;
          //this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.collaborationTeamId = this.teamModel.id;
          if (this.colTeamAccessModel != null) {
            if (i == 0) {

              this.rfqCollaborationTeamAccessModel.id = this.colTeamAccessModel.id;
            }
            this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.id = this.colTeamAccessModel.rfqCollaborationTeam.id;
          }
          this.rfqCollaborationTeamAccessModelList.push(this.rfqCollaborationTeamAccessModel);
        }
      }
    }
    if(this.rfqCollaborationTeamAccessModelList.length>0){
    this.rfqCollaborationService.saveRFQCollaborationTeamAcess(this.rfqCollaborationTeamAccessModelList).subscribe(result => {
      this.isSaved=false;
      this.dialogRef.close();
    });
  }
  }

  searchPrimUser() {
    if(!this.isEditTeam){
    this.isSearchPrimUser = true;
    this.searchnamePri=this.ifsprimEmployeeSearchModel.employeepriName
    this.ifsprimEmployeeSearchModel.page = 1;
    this.ifsprimEmployeeSearchModel.pageSize=10;
    this.ifsprimEmployeeSearchModel.totalItems=0;
    this.ifsprimEmployeeSearchModel.totalPages=0;
   
    this.LoadPrimaryUserDetails();
    }
  }

  searchSecUser() {
    this.isSearchSecUser = true;
    //this.isSearchUser = true;
    this.searchnameSec=this.ifsSecoundaryEmployeeSearchModel.employeesecName
    this.ifsSecoundaryEmployeeSearchModel.page = 1;
    this.ifsSecoundaryEmployeeSearchModel.pageSize=10;
    this.ifsSecoundaryEmployeeSearchModel.totalItems=0;
    this.ifsSecoundaryEmployeeSearchModel.totalPages=0;
  
    this.LoadSecondaryUserDetails();
  }

  
   GetIFSEmployee(){
    this.ifsEmployeeSearchModel.collaborationTeamId = this.basicdataTeam;
    this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
      this.ifsprimEmployeeSearchModel=JSON.parse(JSON.stringify(result.data));;
    this.ifsSecoundaryEmployeeSearchModel=JSON.parse(JSON.stringify(result.data));;
      
        this.ifsSEmployeePrimaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
        this.ifsEmployeeSearchModel.employeepriName=this.searchnamePri;
        this.ifsEmployeeSearchModel.employeesecName=this.searchnameSec;
        
        this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
       
    
      if(this.colTeamAccessModel != null){
        this.GetCollTeamAcessByTeamId();
      }
    
    });    
   }
   LoadPrimaryUserDetails(){
    this.ifsEmployeeSearchModel=this.ifsprimEmployeeSearchModel;
  this.ifsEmployeeSearchModel.employeeName=this.ifsprimEmployeeSearchModel.employeepriName;
    this.ifsEmployeeSearchModel.collaborationTeamId = this.basicdataTeam;
    this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
      this.ifsprimEmployeeSearchModel = JSON.parse(JSON.stringify(result.data));
          this.ifsSEmployeePrimaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
          this.ifsprimEmployeeSearchModel.employeepriName=this.searchnamePri;
          if(this.isSearchPrimUser ){     
            this.firstPaginator.pageIndex=0;
           }
           this.isSearchPrimUser =false;
    
           if(this.ifsSEmployeePrimaryListModel.length>0 && this.SelectedIFSSEmployeePrimaryModel.length>0){
            this.ifsSEmployeePrimaryListModel.forEach(i=>{
              let isExist= this.SelectedIFSSEmployeePrimaryModel.filter(x=>x.id==i.id)
                   
              if(isExist.length==1 ){
                
                i.isChecked=true;
              }
            })
         
         
        }
   
    });

    
   }
   LoadSecondaryUserDetails(){
    this.ifsEmployeeSearchModel=this.ifsSecoundaryEmployeeSearchModel;
 this.ifsEmployeeSearchModel.collaborationTeamId = this.basicdataTeam;
 this.ifsEmployeeSearchModel.employeeName=this.ifsSecoundaryEmployeeSearchModel.employeesecName;
 this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
  this.ifsSecoundaryEmployeeSearchModel = JSON.parse(JSON.stringify(result.data));
       this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
       
       this.ifsSecoundaryEmployeeSearchModel.employeesecName=this.searchnameSec;
       if(this.isSearchSecUser ){
        this.secPaginator.pageIndex=0;
        }
        this.isSearchSecUser =false;
  
        if(this.ifsSEmployeeSecondaryListModel.length>0 && this.SelectedIFSSEmployeeSecondaryModel.length>0){
          this.ifsSEmployeeSecondaryListModel.filter(i=>i.isChecked=false)
          this.ifsSEmployeeSecondaryListModel.forEach(i=>{
        
            let isExist= this.SelectedIFSSEmployeeSecondaryModel.filter(x=>x.id==i.id)
          
             if(isExist.length==1 ){
              if(isExist[0].id==i.id){
                i.isChecked=true;
               if(isExist[0].primaryUserId!=null){
                
                i.primaryUserId=isExist[0].primaryUserId;
               }
              }
              
            } 
          })
        }
   

 });

 
   }
  
  
  selectedAccessLevel(row: any, isFullCheck: string) {
    var isFull;
    var isEdit;
    var isView;

    row.selectedAccessLvl.forEach(x => {
      if (x == "Full") {
        row.selectedAccessLvl.push("View");
        row.selectedAccessLvl.push("Edit");
      } else {
        if (isFullCheck == "full") {
          row.selectedAccessLvl = [];
          x = null;
        }
      }
      if (x == "Edit") {
        isEdit = true;
      }
      if (x == "View") {
        isView = true;
      }

    });

    if (isEdit && isView) {
      row.selectedAccessLvl.push("Full");
    } else if (isEdit && !isView) {
      row.selectedAccessLvl = [];
      row.selectedAccessLvl.push("Edit");
    } else if (!isEdit && isView) {
      row.selectedAccessLvl = [];
      row.selectedAccessLvl.push("View");
    }
  }

  OnPaginateChange(event: PageEvent) {
   //debugger;
    
   let page = event.pageIndex;
   let size = event.pageSize;
   page = page + 1;
   this.ifsprimEmployeeSearchModel.pageSize = event.pageSize;
   this.ifsprimEmployeeSearchModel.page = page;
   this.LoadPrimaryUserDetails();
  }

  OnSecoundaryPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;   
    this.ifsSecoundaryEmployeeSearchModel.pageSize = event.pageSize;
    this.ifsSecoundaryEmployeeSearchModel.page = page;
    this.LoadSecondaryUserDetails();
  
  }

 
  userProfileInformation: string = null;
  rolesDataSource: any[];

  getRoles() {
    this.rolesService.fetchRoles().subscribe(result => {

      if (result.length > 0) {
        this.rolesDataSource = result.filter(i => i.roleType == "ET");

      }
      else {
        this.rolesDataSource = result;
      }


      if (this.colTeamAccessModel != null) {


        this.rfqCollaborationTeamAccessModel = new RFQCollaborationTeamAccessModel();
        this.rfqCollaborationTeamAccessModel.selectedAccessLvl = [];
        this.rfqCollaborationTeamAccessModel.selectedpagesAccess = [];
        this.rfqCollaborationTeamAccessModel.selectedrfxRoleList = [];
        switch (this.colTeamAccessModel.pageName) {
          case "Full RFQ":

            this.rfqCollaborationTeamAccessModel.selectedpagesAccess.push("Full RFQ");
            break;
          case "Evaluations - TBE":

            this.rfqCollaborationTeamAccessModel.selectedpagesAccess.push("Evaluations - TBE");
            break;
          case "Evaluations - CBE":

            this.rfqCollaborationTeamAccessModel.selectedpagesAccess.push("Evaluations - CBE");
            break;
          case "Scoring & Evaluations":

            this.rfqCollaborationTeamAccessModel.selectedpagesAccess.push("Scoring & Evaluations");
            break;
        };
        if (this.colTeamAccessModel.isEdit) {
          this.rfqCollaborationTeamAccessModel.selectedAccessLvl.push("Edit");
        } if (this.colTeamAccessModel.isView) {
          this.rfqCollaborationTeamAccessModel.selectedAccessLvl.push("View");
        } if (this.colTeamAccessModel.isView && this.colTeamAccessModel.isEdit) {
          this.rfqCollaborationTeamAccessModel.selectedAccessLvl.push("Full");
        }

        this.rolesDataSource.forEach(x => {
          if (x.roleName == this.colTeamAccessModel.role) {
            this.rfqCollaborationTeamAccessModel.selectedrfxRoleList.push(x.roleName);
          }
        });
      }
    });

  }
  saveCT() {
    this.collaborationTeamTextViewModel[0].teamName = this.saveTeamName;
    this.collaborationTeamTextViewModel[0].teamDescription = this.saveTeamDesc;

    this.collaborationTeamService.createEditTeam(this.collaborationTeamTextViewModel).subscribe(result => {

      this.collaborationTeamTextViewModel = result;

    });

  }
  removeRFXIFSSEmployeePrimaryModel(id: string) {

    this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(this.rfxIFSSEmployeePrimaryModel.filter(x => x.id != id)));
  }
  temp: any;
  tabClick(tab: any) {
    if (tab.tab.textLabel == "RFx Access") {
      this.isButtonVisible = true;
      
   
      console.log("This is the final method, it has been activated as intended");
      for (let i = 0; i < this.SelectedIFSSEmployeePrimaryModel.length; i++) {
        // Prevents primary users from being re-added when RFXAccess tab is selected
        if (!this.rfqAccessModelList.find(x => x.id == this.SelectedIFSSEmployeePrimaryModel[i].id)) {

          if (this.colTeamAccessModel == null) {
            this.rfqCollaborationTeamAccessModel = new RFQCollaborationTeamAccessModel();
            this.rfqCollaborationTeamAccessModel.selectedAccessLvl = [];
            this.rfqCollaborationTeamAccessModel.selectedpagesAccess = [];
            this.rfqCollaborationTeamAccessModel.selectedrfxRoleList = [];
          }
          this.rfqCollaborationTeamAccessModel.id = this.SelectedIFSSEmployeePrimaryModel[i].id;
          this.rfqCollaborationTeamAccessModel.userName = this.SelectedIFSSEmployeePrimaryModel[i].employeeName;
          this.rfqCollaborationTeamAccessModel.userId = this.SelectedIFSSEmployeePrimaryModel[i].id;
          let subSelected = this.SelectedIFSSEmployeeSecondaryModel.filter(i => i.isChecked == true);
          if (subSelected.length > 0) {
            let subColl = this.SelectedIFSSEmployeeSecondaryModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked);
            if(subColl!=null){
            this.rfqCollaborationTeamAccessModel.substituteUserId=subColl.id;
            }
          }
          else {
            this.rfqCollaborationTeamAccessModel.substituteUserId = "00000000-0000-0000-0000-000000000000";
          }
          this.rfqCollaborationTeamAccessModel.role = null;
          this.rfqCollaborationTeamAccessModel.pageName = null;
          this.rfqCollaborationTeamAccessModel.isEdit = false;
          this.rfqCollaborationTeamAccessModel.isFull = false;
          this.rfqCollaborationTeamAccessModel.isView = false;

          // if edit, then role, pageName, isEdit,isFull and isView should be binded with the appropriate data.
          if (this.colTeamAccessModel != null) {
            this.rfqCollaborationTeamAccessModel.role = this.colTeamAccessModel.role;
            this.rfqCollaborationTeamAccessModel.pageName = this.colTeamAccessModel.pageName;
            this.rfqCollaborationTeamAccessModel.isEdit = false;
            this.rfqCollaborationTeamAccessModel.isFull = false;
            this.rfqCollaborationTeamAccessModel.isView = false;

          }
          this.rfqAccessModelList.push(this.rfqCollaborationTeamAccessModel);
        } else {

          let subColl = this.SelectedIFSSEmployeeSecondaryModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked);
          if(subColl!=null){
            this.rfqCollaborationTeamAccessModel.substituteUserId=subColl.id;
          }
          
        }

      }

      // remove Primary user from rfqAccessModelList if they have been unchecked from the Primary user tab

      this.rfqAccessModelList.forEach(x => {
        this.temp = this.SelectedIFSSEmployeePrimaryModel.find(y => y.id == x.id);
        if (this.temp != null) {
          x.isSelectedPrimUser = true;
        } else {
          x.isSelectedPrimUser = false;
        }
      });
      this.rfqAccessModelList = JSON.parse(JSON.stringify(this.rfqAccessModelList.filter(x => x.isSelectedPrimUser == true)));

    }
    else if (tab.tab.textLabel == "Substitute User") {
      // debugger;
       this.ifsSecoundaryEmployeeSearchModel.employeesecName=this.searchnameSec;
       this.isButtonVisible=false;
        if(this.firstPaginator!=null){
         this.firstPaginator.length=this.ifsprimEmployeeSearchModel.totalItems;
         this.firstPaginator.pageIndex=this.ifsprimEmployeeSearchModel.page-1;
         this.firstPaginator.pageSize=this.ifsprimEmployeeSearchModel.pageSize;
       }
       
      this.secPaginator.length=this.ifsSecoundaryEmployeeSearchModel.totalItems;
      this.secPaginator.pageIndex=this.ifsSecoundaryEmployeeSearchModel.page-1;
      this.secPaginator.pageSize=this.ifsSecoundaryEmployeeSearchModel.pageSize;
      
     
     }
     else if (tab.tab.textLabel == "Primary User"){
      //debugger;
      this.ifsprimEmployeeSearchModel.employeepriName=this.searchnamePri;
      this.isButtonVisible=false;
       this.firstPaginator.length=this.ifsprimEmployeeSearchModel.totalItems; 
      this.firstPaginator.pageIndex=this.ifsprimEmployeeSearchModel.page-1;
      this.firstPaginator.pageSize=this.ifsprimEmployeeSearchModel.pageSize;
      if(this.secPaginator!=null){
      this.secPaginator.length=this.ifsSecoundaryEmployeeSearchModel.totalItems;
      this.secPaginator.pageIndex=this.ifsSecoundaryEmployeeSearchModel.page-1;
      this.secPaginator.pageSize=this.ifsSecoundaryEmployeeSearchModel.pageSize; 
      
      }
      
       
     }

    //console.log(this.rfqAccessModelList);
  }
  removeSelectedPrimSup(row) {
    //removes user selected from ifsSEmployeePrimaryListModel list from the ifsSEmployeeSecondaryListModel list  
   // this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(this.ifsSEmployeePrimaryListModel.filter(x => x.isChecked != true)));
    this.isDisabledCheckbox = false;
    if(row.isChecked==true){     
      this.SelectedIFSSEmployeePrimaryModel.push(row);
      let primcount = 0;
      
      this.rfxIFSSEmployeePrimaryModel = JSON.parse(JSON.stringify(this.SelectedIFSSEmployeePrimaryModel));
    }
    else{
      let index = this.SelectedIFSSEmployeePrimaryModel.findIndex((element) => element["id"] == row.id);
      this.SelectedIFSSEmployeePrimaryModel.splice(index, 1);
    }
    if (this.SelectedIFSSEmployeePrimaryModel.length > 0) {
      this.openSubTab = true;
    } else {
      this.openSubTab = false;
    }
  }
  UpdateSelectedData(row){
    this.SelectedIFSSEmployeeSecondaryModel.forEach(i=>{
      if(i.id==row.id){
        i.primaryUserId=row.primaryUserId
      }
    })
  }
  selectedSubUser(id: string, selectedPrimId: string) {
    
    this.ifsSEmployeeSecondaryListModel.forEach(x => {
      if (x.id == id) {
        x.isChecked = true;
        x.primaryUserId = selectedPrimId;
        this.openrfxAccessTab = true;
      } else {
        x.isChecked = false;
      }
    });
    var count = this.ifsSEmployeeSecondaryListModel.filter(x => x.isChecked == true).length;
    if (this.SelectedIFSSEmployeePrimaryModel.length == count) {
      this.isDisabledCheckbox = true;

    } else {
      this.isDisabledCheckbox = false;
    }
    // Saves Id of selected user so it can be used to save RFQCOllaborationTeam  
    //console.log(this.ifsSEmployeeSecondaryListModel)        
  }

  selectedPrimaryUser(id: string, selectedPrimId: string) {
    this.ifsSEmployeeSecondaryListModel.forEach(x => {
      if (x.id == id) {
        x.isChecked = true;
        x.primaryUserId = selectedPrimId;
        this.openrfxAccessTab = true;
      } else {
        x.isChecked = false;
      }
    });
    var count = this.ifsSEmployeeSecondaryListModel.filter(x => x.isChecked == true).length;
    if (this.SelectedIFSSEmployeePrimaryModel.length == count) {
      this.isDisabledCheckbox = true;
    } else {
      this.isDisabledCheckbox = false;
    }
  }

  selectedSecUserCheckBoxValidation(row) {
   
    if(row.isChecked==true){     
      this.SelectedIFSSEmployeeSecondaryModel.push(row);
    
    }
    else{
      let index = this.SelectedIFSSEmployeeSecondaryModel.findIndex((element) => element["id"] == row.id);
      this.SelectedIFSSEmployeeSecondaryModel.splice(index, 1);
    
      this.SelectedIFSSEmployeePrimaryModel.forEach(y => {
        if (row.primaryUserId == y.id) {
          y.isSelectedPrimUser = false;
          row.primaryUserId = null;
        
        }
      });
     
    }
  }
 

  removeFromSelectedPrimUserList(id: string, row: any) {
    this.SelectedIFSSEmployeePrimaryModel.forEach(x => {
      if (x.id == id) {
        if (row.isChecked == true) {
          x.isSelectedPrimUser = true;
        }
      }
    });

    if (this.ifsSEmployeeSecondaryListModel.find(x => x.isChecked == true && x.primaryUserId != null)) {
      if (this.openSubTab) {
        this.openrfxAccessTab = true;
      }

    } else {
      this.openrfxAccessTab = false;
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

  doAction() {
    this.dialogRef.close();
    //window.location.reload() ;

  }

  saveTemplate() {
  }

  showOptions(event: MatCheckboxChange, row, tab): void {
    if (event.checked === true) {
      tab === 'first' ? this.selectedTeamChipFirst.push(row) : this.selectedTeamChipSecond.push(row);
    } else {
      tab === 'first' ? this.selectedTeamChipFirst.splice(this.selectedTeamChipFirst.indexOf(row), 1) : this.selectedTeamChipSecond.splice(this.selectedTeamChipSecond.indexOf(row), 1);
    }
  }

  GetCollTeamAcessByTeamId() {
   
    //console.log(apiResult);
    if(this.colTeamAccessModel.userModel!=null){
      
      this.SelectedIFSSEmployeePrimaryModel.push(this.colTeamAccessModel.userModel);
      this.SelectedIFSSEmployeePrimaryModel[0].isChecked=true;
      this.ifsSEmployeePrimaryListModel.forEach(det => {
        if(det.id==this.colTeamAccessModel.userId){
          
          det.isChecked=true
        }
        
      
     }) 
    } 
    if(this.colTeamAccessModel.substituteUserModel!=null){
      this.SelectedIFSSEmployeeSecondaryModel.push(this.colTeamAccessModel.substituteUserModel);
      this.SelectedIFSSEmployeeSecondaryModel[0].isChecked=true;
      this.SelectedIFSSEmployeeSecondaryModel[0].isCheckedSub=true;
      this.SelectedIFSSEmployeeSecondaryModel[0].primaryUserId=this.SelectedIFSSEmployeePrimaryModel[0].id;
      this.SelectedIFSSEmployeePrimaryModel[0].isSelectedPrimUser=true;
      this.ifsSEmployeeSecondaryListModel.forEach(det => {
        if(det.id==this.colTeamAccessModel.substituteUserId){
          det.isChecked=true
          det.primaryUserId=this.colTeamAccessModel.userId
        }
       
     }) 
    }  
    this.openSubTab=true;
   //this.isLoaded=false;
    
  }

  removePrimary(row){
    this.isDisabledCheckbox = false;
    
     
   
    if (this.SelectedIFSSEmployeePrimaryModel.length > 0) {
      this.openSubTab = true;
    } else {
      this.openSubTab = false;
    }
    this.ifsSEmployeePrimaryListModel.filter(i=>{
         
      if(i.id==row.id ){
        
        i.isChecked=false;
      }
    })
    let index = this.SelectedIFSSEmployeePrimaryModel.findIndex((element) => element["id"] == row.id);
    this.SelectedIFSSEmployeePrimaryModel.splice(index, 1);
  }
  removeSub(row){
   
     
      this.SelectedIFSSEmployeePrimaryModel.forEach(y => {
        if (row.primaryUserId == y.id) {
          y.isSelectedPrimUser = false;
         
        
        }
      });
      this.ifsSEmployeeSecondaryListModel.filter(i=>{
         
        if(i.id==row.id ){
          
          i.isChecked=false;
          i.primaryUserId = null;
        }
      })
      let index = this.SelectedIFSSEmployeeSecondaryModel.findIndex((element) => element["id"] == row.id);
      this.SelectedIFSSEmployeeSecondaryModel.splice(index, 1);
  }
 
  handleSelectedRole(role){
   if(this.isEditTeam){
   this.rfqAccessModelList[0].selectedrfxRoleList=[];
   this.rfqAccessModelList[0].selectedrfxRoleList.push(role.roleName);
   }
  }
  handleSelectedPageAccess(accessvalue){
    if(this.isEditTeam){
   this.rfqAccessModelList[0].selectedpagesAccess=[];
    this.rfqAccessModelList[0].selectedpagesAccess.push(accessvalue);
    }
   }
}
/** Builds and returns a new createNewRow. */
function createNewRow(id: number): RowData {

  return {
    teamUserName: TEAMUSERNAME[Math.round(Math.random() * (TEAMUSERNAME.length - 1))],
    teamPosition: TEAMPOSITION[Math.round(Math.random() * (TEAMPOSITION.length - 1))],
    teamEmail: TEAMEMAIL[Math.round(Math.random() * (TEAMEMAIL.length - 1))],
  };
}

/** Builds and returns a new createNewRow. */
function createNewRow2(id: number): RowData2 {

  return {
    team: TEAM[Math.round(Math.random() * (TEAM.length - 1))],
    description: DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))],
  };
}
