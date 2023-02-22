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

import { RFQCollaborationTeamAccessModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-access-model';
import { RFQCollaborationModel } from 'app/main/Models/etendering/rfq-collaboration-model';
import { RFQCollaborationTeamModel } from 'app/main/Models/etendering/ViewModels/rfq-collaboration-team-model';
import { RfqCollaborationService } from 'app/shared/Services/etendering/RFQ/rfq-collaboration.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface RowData {
  teamUserName: string;
  teamPosition: string;
  teamEmail: string;
}

/* export interface RowData2 {
    team: string;
    description: string;
} */
/** Constants used to fill up our data base. */
/* const TEAMUSERNAME: string[] = [
    'Muhammed Munaad', 'Muhammed Rafiq'
];
const TEAMPOSITION: string[] = [
    'Technical Lead'
];
const TEAMEMAIL: string[] = [
    'A@gmail.com', 'B@gmail.com'
]; */

/** Constants used to fill up our data base. */
/* const TEAM: string[] = [
    'Quality Engineering', 'Quality Raw Materials'
];
const DESCRIPTION: string[] = [
    'Engineering Quality Team', 'Packaging Quality Team'
]; */

@Component({
  selector: 'add-collabteam-overlay',
  templateUrl: './add-collabteam-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddCollaborationTeamOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumn: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail', 'primaryUser'];
  displayedColumn1: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail'];
  dataSource: MatTableDataSource<RowData>;

  displayedColumn2: string[] = ['id', 'team', 'description'];
  // dataSource2: MatTableDataSource<RowData2>;

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
  ErrorInfo: string = "";
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

  selectedCollaboration: any[] = [];

  constructor(public dialogRef: MatDialogRef<AddCollaborationTeamOverlayComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
    private ifsEmployeeService: IFSEmployeeService,
    private collaborationTeamService: CollaborationTeamService,
    private rolesService: RolesService,
    private rfqCollaborationService: RfqCollaborationService
  ) {
    this.rfqId = data.rfqId;
    if (data.colTeamAccessModel != null) {
      this.colTeamAccessModel = data.colTeamAccessModel;
    }

    this.overlayTxt = data.overlayTxt;

    this.collaborationTeamSearchModel.pageSize = 10;
    this.collaborationTeamSearchModel.page = 1;
  }
  ngOnInit(): void {




    this.getCT();




  }



  saveRFQCollaborationTeamAccess() {
    this.ErrorInfo = "";
    let collTeam = this.collaborationTeamTextViewModel.filter(x => x.isChecked == true);
    this.collaborationTeamSearchModel.collaborationTeamTextViewModels = collTeam;
    this.collaborationTeamSearchModel.rfqId = this.rfqId;

    for (var k = 0; k < this.collaborationTeamSearchModel.collaborationTeamTextViewModels.length; k++) {
      if (this.collaborationTeamSearchModel.collaborationTeamTextViewModels[k].isUsersExists == false) {
        this.ErrorInfo = "Collaboration  Team " + this.collaborationTeamSearchModel.collaborationTeamTextViewModels[k].teamName + " has no items."
        return;
      }
    }
    // console.log(this.collaborationTeamSearchModel);
    /*  for(let z=0; z< this.rfqAccessModelList.length; z++){
       for(let i=0; i< this.rfqAccessModelList[z].selectedrfxRoleList.length; i++ ){
         for(let j=0; j< this.rfqAccessModelList[z].selectedpagesAccess.length; j++ ){
           this.rfqCollaborationTeamAccessModel = new RFQCollaborationTeamAccessModel();
             this.rfqCollaborationTeamAccessModel.role = this.rfqAccessModelList[z].selectedrfxRoleList[i];
             this.rfqCollaborationTeamAccessModel.pageName = this.rfqAccessModelList[z].selectedpagesAccess[j];

           this.rfqAccessModelList[z].selectedAccessLvl.forEach(x=>{
               if(x == "Full"){
                 this.rfqCollaborationTeamAccessModel.isEdit = true;
                 this.rfqCollaborationTeamAccessModel.isView = true;
               }else if(x == "Edit"){
                 this.rfqCollaborationTeamAccessModel.isEdit = true;
               }else if(x == "View"){
                 this.rfqCollaborationTeamAccessModel.isView = true;
               }
             });               

             this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam = new RFQCollaborationTeamModel();
             this.rfqCollaborationTeamAccessModel.substituteUserId = this.rfqAccessModelList[z].substituteUserId;
             this.rfqCollaborationTeamAccessModel.userId = this.rfqAccessModelList[z].id;
             this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.rfqId =  this.rfqId;
             this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.collaborationTeamId = this.teamModel.id;
             if(this.colTeamAccessModel !=null){
               if(i==0 ){
                 
                 this.rfqCollaborationTeamAccessModel.id = this.colTeamAccessModel.id;
               }
               this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.id = this.colTeamAccessModel.rfqCollaborationTeam.id;
             }
             this.rfqCollaborationTeamAccessModelList.push(this.rfqCollaborationTeamAccessModel);
         }
       }
     }      */
    if (collTeam.length > 0 && this.ErrorInfo == "") {
      this.rfqCollaborationService.RFQSaveCollaborationTeamAcess(this.collaborationTeamSearchModel).subscribe(result => {
        this.dialogRef.close();
      });
    }
  }



  searchTeam() {


    this.collaborationTeamSearchModel.teamName
    this.collaborationTeamSearchModel.teamDescription
    this.getCT();

  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.collaborationTeamSearchModel.pageSize = event.pageSize;
    this.collaborationTeamSearchModel.page = page;
    this.getCT();
    //  this.dataSource=   this.CreatePaginationData(page,size);

  }



  getCT() {
    this.collaborationTeamService.getCTList(this.collaborationTeamSearchModel).subscribe(result => {
      this.collaborationTeamSearchModel = result;
      this.collaborationTeamTextViewModel = result.collaborationTeamTextViewModels;
      console.log(this.collaborationTeamSearchModel);
      /* if(this.colTeamAccessModel != null){
        this.selectedTeam(this.colTeamAccessModel.rfqCollaborationTeam.collaborationTeamId);
      } */

    });
  }



  saveCT() {
    this.collaborationTeamTextViewModel[0].teamName = this.saveTeamName;
    this.collaborationTeamTextViewModel[0].teamDescription = this.saveTeamDesc;

    this.collaborationTeamService.createEditTeam(this.collaborationTeamTextViewModel).subscribe(result => {

      this.collaborationTeamTextViewModel = result;

    });

  }


  ngAfterViewInit() {

  }



  doAction() {
    this.dialogRef.close();
    //window.location.reload() ;

  }

  showOptions(event: MatCheckboxChange, row): void {
    if (event.checked === true) {
      this.selectedCollaboration.push(row);
    } else {
      this.selectedCollaboration.splice(this.selectedCollaboration.indexOf(row), 1);
    }
  }
}
/** Builds and returns a new createNewRow. */
/* function createNewRow(id: number): RowData {

    return {
        teamUserName: TEAMUSERNAME[Math.round(Math.random() * (TEAMUSERNAME.length - 1))],
        teamPosition: TEAMPOSITION[Math.round(Math.random() * (TEAMPOSITION.length - 1))],
        teamEmail: TEAMEMAIL[Math.round(Math.random() * (TEAMEMAIL.length - 1))],
    };
} */

/** Builds and returns a new createNewRow. */
/* function createNewRow2(id: number): RowData2 {

    return {
        team: TEAM[Math.round(Math.random() * (TEAM.length - 1))],
        description: DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))],
    };
} */
