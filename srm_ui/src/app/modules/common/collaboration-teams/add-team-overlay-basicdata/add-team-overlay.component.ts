/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, Inject, ViewChild, ViewEncapsulation ,ChangeDetectorRef} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable,MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IFSEmployeeService } from 'app/shared/Services/etendering/ifs-employee-service';
import { IFSEmployeeSearchModel } from 'app/main/Models/etendering/ifs-employee-search-model';
import { IFSEmployeeModel } from 'app/main/Models/etendering/ViewModels/ifs-employee-model';
import { CollaborationTeamService } from 'app/shared/Services/etendering/collaboration-team.service';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { CollaborationTeamTextViewModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-view-model';
import { RolesService } from 'app/shared/Services/roles.service';
import { CollaborationTeamAccessModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-access-model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'add-team-overlay',
  templateUrl: './add-team-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddTeamOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumn: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail', 'primaryUser'];
  displayedColumn1: string[] = ['id', 'teamUserName', 'teamPosition', 'teamEmail'];
  displayedColumn2: string[] = ['id', 'team', 'description'];

  @ViewChild('secPaginator',  {static: false}) secPaginator: MatPaginator;
  @ViewChild('firstPaginator' , {static: false}) firstPaginator: MatPaginator;
  
  pageEvent1: PageEvent;
  pageEvent2: PageEvent;
 
 
  templateData: any = [];
  useremail: string = '';

  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;

  ifsEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
  ifsSecoundaryEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
  collaborationTeamSearchModel: CollaborationTeamSearchModel = new CollaborationTeamSearchModel();

  ifsSEmployeePrimaryListModel: IFSEmployeeModel[] = [];
  ifsSEmployeePrimaryModel: IFSEmployeeModel;

  ifsSEmployeeSecondaryListModel: IFSEmployeeModel[] = [];
  SelectedIFSSEmployeePrimaryModel: IFSEmployeeModel[] = [];
  rfxIFSSEmployeePrimaryModel: IFSEmployeeModel[] = [];

  //
  SelectedIFSSEmployeeSecondaryModel: IFSEmployeeModel[] = [];
  //



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

  SavecollaborationTeamTextViewModel: CollaborationTeamTextViewModel = new CollaborationTeamTextViewModel();
  collaborationTeamAccessModel: CollaborationTeamAccessModel = new CollaborationTeamAccessModel();
  collaborationTeamAccessModelList = [];
  rfqAccessModelList: CollaborationTeamAccessModel[] = [];

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

  colTeamAccessModel: any;
  collaborationTeamId: any = "";
  isButtonVisible = false;
  CollabAccess = [];

  selectedTeamChip: any[] = [];
  selectedFirstTab: any[] = [];
  isSaved:boolean =false;
  searchnamePri:string='';
  searchnameSec:string='';
  ifsprimEmployeeSearchModel: IFSEmployeeSearchModel = new IFSEmployeeSearchModel();
  
  
  constructor(public dialogRef: MatDialogRef<AddTeamOverlayComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,
    private ifsEmployeeService: IFSEmployeeService,
    private collaborationTeamService: CollaborationTeamService,
    private rolesService: RolesService,
    private rfqCollaborationService: CollaborationTeamService,private ref:ChangeDetectorRef
  ) {

    this.collaborationTeamId = data.id;
    if (data.colTeamAccessModel != null) {
      this.colTeamAccessModel = data.colTeamAccessModel;
    }

    this.ifsprimEmployeeSearchModel.pageSize = 10;
    this.ifsprimEmployeeSearchModel.page = 1;
    this.ifsSecoundaryEmployeeSearchModel.pageSize = 10;
    this.ifsSecoundaryEmployeeSearchModel.page = 1;
  }
  ngOnInit(): void {

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
    //this.dataSource1.paginator=this.firstPaginator
    this.GetIFSEmployee();
    //this.getCT();
    this.GetCollTeamAcessByTeamId();
    this.getRoles();
  }
  
  displaySelection() {
    this.rfxRoleList
  }

  onChange(Value) {
    this.SelectedAccessLvl.push(Value); // or do whatever as required
  }

  saveRFQCollaborationTeamAccess() {
    this.isSaved=true;
    // var teamModel = this.collaborationTeamTextViewModel.find(x => x.isChecked == true);
    //console.log(this.rfqAccessModelList);
    for (let z = 0; z < this.rfqAccessModelList.length; z++) {
      for (let i = 0; i < this.rfqAccessModelList[z].selectedrfxRoleList.length; i++) {
        for (let j = 0; j < this.rfqAccessModelList[z].selectedpagesAccess.length; j++) {
          this.collaborationTeamAccessModel = new CollaborationTeamAccessModel();
          this.collaborationTeamAccessModel.role = this.rfqAccessModelList[z].selectedrfxRoleList[i];
          this.collaborationTeamAccessModel.pageName = this.rfqAccessModelList[z].selectedpagesAccess[j];

          this.rfqAccessModelList[z].selectedAccessLvl.forEach(x => {
            if (x == "Full") {
              this.collaborationTeamAccessModel.isEdit = true;
              this.collaborationTeamAccessModel.isView = true;
            } else if (x == "Edit") {
              this.collaborationTeamAccessModel.isEdit = true;
            } else if (x == "View") {
              this.collaborationTeamAccessModel.isView = true;
            }
          });

          // this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam = new CollaborationTeamModel();
          this.collaborationTeamAccessModel.substituteUserId = this.rfqAccessModelList[z].substituteUserId;
          this.collaborationTeamAccessModel.userId = this.rfqAccessModelList[z].id;
          this.collaborationTeamAccessModel.collaborationTeamId = this.collaborationTeamId;
          // this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.collaborationTeamId = teamModel.id;
          if (this.colTeamAccessModel != null) {
            if (i == 0) {

              this.collaborationTeamAccessModel.id = this.colTeamAccessModel.id;
            }
            // this.rfqCollaborationTeamAccessModel.rfqCollaborationTeam.id = this.colTeamAccessModel.rfqCollaborationTeam.id;
          }
          this.collaborationTeamAccessModelList.push(this.collaborationTeamAccessModel);
        }
      }
    }
   // console.log(this.collaborationTeamAccessModelList);
     if(this.collaborationTeamAccessModelList.length>0){
    this.rfqCollaborationService.saveCollaborationTeamAcess(this.collaborationTeamAccessModelList).subscribe(result => {
      this.isSaved=false;
      this.dialogRef.close();
    }); 
    }  
  }

  searchPrimUser() {
    
   
    this.isSearchPrimUser = true;
    this.searchnamePri=this.ifsprimEmployeeSearchModel.employeepriName
    this.ifsprimEmployeeSearchModel.page = 1;
    this.ifsprimEmployeeSearchModel.pageSize=10;
    this.ifsprimEmployeeSearchModel.totalItems=0;
    this.ifsprimEmployeeSearchModel.totalPages=0;
   
    this.LoadPrimaryUserDetails();
  }
  
  searchSecUser() {
   
    this.isSearchSecUser = true;
   
    this.searchnameSec=this.ifsSecoundaryEmployeeSearchModel.employeesecName
    this.ifsSecoundaryEmployeeSearchModel.page = 1;
    this.ifsSecoundaryEmployeeSearchModel.pageSize=10;
    this.ifsSecoundaryEmployeeSearchModel.totalItems=0;
    this.ifsSecoundaryEmployeeSearchModel.totalPages=0;
  
    this.LoadSecondaryUserDetails();
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

GetIFSEmployee(){
  this.ifsEmployeeSearchModel.collaborationTeamId = this.collaborationTeamId;
  this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
    
    this.ifsprimEmployeeSearchModel=JSON.parse(JSON.stringify(result.data));;
    this.ifsSecoundaryEmployeeSearchModel=JSON.parse(JSON.stringify(result.data));;
    this.ifsprimEmployeeSearchModel.employeepriName=this.searchnamePri;
  
    this.ifsSecoundaryEmployeeSearchModel.employeesecName=this.searchnameSec;
  
   
    this.ifsSEmployeePrimaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
   
     
    this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
   
    this.ifsSEmployeePrimaryListModel.forEach(x => {
      if (x.isChecked == true) {
       
        this.openSubTab = true;
      } 
    });
    
    
  });
}
LoadPrimaryUserDetails(){
  this.ifsEmployeeSearchModel=this.ifsprimEmployeeSearchModel;
  this.ifsEmployeeSearchModel.employeeName=this.ifsprimEmployeeSearchModel.employeepriName;
 
  this.ifsEmployeeSearchModel.collaborationTeamId = this.collaborationTeamId;
  
  this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
    this.ifsprimEmployeeSearchModel = JSON.parse(JSON.stringify(result.data));

        this.ifsSEmployeePrimaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
    
        
      this.ifsprimEmployeeSearchModel.employeepriName=this.searchnamePri;
   
    
    
        if(this.ifsSEmployeePrimaryListModel.length>0 && this.SelectedIFSSEmployeePrimaryModel.length>0){
          this.ifsSEmployeePrimaryListModel.forEach(i=>{
            let isExist= this.SelectedIFSSEmployeePrimaryModel.filter(x=>x.id==i.id)
                 
            if(isExist.length==1 ){
              
              i.isChecked=true;
            }
          })
       
       
      }
      if(this.isSearchPrimUser ){     
        this.firstPaginator.pageIndex=0;
       }
       this.isSearchPrimUser =false;
    
  });

 
}
LoadSecondaryUserDetails(){
  this.ifsEmployeeSearchModel=this.ifsSecoundaryEmployeeSearchModel;
  this.ifsEmployeeSearchModel.collaborationTeamId = this.collaborationTeamId;
  this.ifsEmployeeSearchModel.employeeName=this.ifsSecoundaryEmployeeSearchModel.employeesecName;
    this.ifsEmployeeService.getIFSEmployeeSearch(this.ifsEmployeeSearchModel).subscribe(result => {
      this.ifsSecoundaryEmployeeSearchModel = JSON.parse(JSON.stringify(result.data));

      
          this.ifsSEmployeeSecondaryListModel = JSON.parse(JSON.stringify(result.data.ifsEmployeeModel));
        
         this.ifsSecoundaryEmployeeSearchModel.employeesecName=this.searchnameSec;
         
     
          if(this.ifsSEmployeeSecondaryListModel.length>0 && this.SelectedIFSSEmployeeSecondaryModel.length>0){
            this.ifsSEmployeeSecondaryListModel.filter(i=>i.isChecked=false)
            this.ifsSEmployeeSecondaryListModel.forEach(i=>{
          //    console.log(i);
              let isExist= this.SelectedIFSSEmployeeSecondaryModel.filter(x=>x.id==i.id)
            //  console.log(isExist);
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
          if(this.isSearchSecUser ){
           this.secPaginator.pageIndex=0;
           }
           this.isSearchSecUser =false;
       
      
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

        this.collaborationTeamAccessModel = new CollaborationTeamAccessModel();
        this.collaborationTeamAccessModel.selectedAccessLvl = [];
        this.collaborationTeamAccessModel.selectedpagesAccess = [];
        this.collaborationTeamAccessModel.selectedrfxRoleList = [];
        switch (this.colTeamAccessModel.pageName) {
          case "Full RFQ":

            this.collaborationTeamAccessModel.selectedpagesAccess.push("Full RFQ");
            break;
          case "Evaluations - TBE":

            this.collaborationTeamAccessModel.selectedpagesAccess.push("Evaluations - TBE");
            break;
          case "Evaluations - CBE":

            this.collaborationTeamAccessModel.selectedpagesAccess.push("Evaluations - CBE");
            break;
          case "Scoring & Evaluations":

            this.collaborationTeamAccessModel.selectedpagesAccess.push("Scoring & Evaluations");
            break;
        };
        if (this.colTeamAccessModel.isEdit) {
          this.collaborationTeamAccessModel.selectedAccessLvl.push("Edit");
        } if (this.colTeamAccessModel.isView) {
          this.collaborationTeamAccessModel.selectedAccessLvl.push("View");
        } if (this.colTeamAccessModel.isView && this.colTeamAccessModel.isEdit) {
          this.collaborationTeamAccessModel.selectedAccessLvl.push("Full");
        }

        this.rolesDataSource.forEach(x => {
          if (x.roleName == this.colTeamAccessModel.role) {
            this.collaborationTeamAccessModel.selectedrfxRoleList.push(x.roleName);
          }
        });
      }
    });
  }

  
  temp: any;
  tabClick(tab: any) {
   
   
    if (tab.tab.textLabel == "RFx Access") {
      this.isButtonVisible = true;
//console.log(this.SelectedIFSSEmployeePrimaryModel)
   
      for (let i = 0; i < this.SelectedIFSSEmployeePrimaryModel.length; i++) {
        // Prevents primary users from being re-added when RFXAccess tab is selected
       // console.log(this.rfqAccessModelList)
        if (!this.rfqAccessModelList.find(x => x.id == this.SelectedIFSSEmployeePrimaryModel[i].id)) {
          if (this.colTeamAccessModel == null) {
            this.collaborationTeamAccessModel = new CollaborationTeamAccessModel();
            this.collaborationTeamAccessModel.selectedAccessLvl = [];
            this.collaborationTeamAccessModel.selectedpagesAccess = [];
            this.collaborationTeamAccessModel.selectedrfxRoleList = [];
          }
          this.collaborationTeamAccessModel.id = this.SelectedIFSSEmployeePrimaryModel[i].id;
          this.collaborationTeamAccessModel.userName = this.SelectedIFSSEmployeePrimaryModel[i].employeeName;
          this.collaborationTeamAccessModel.userId = this.SelectedIFSSEmployeePrimaryModel[i].id;
          //this.collaborationTeamAccessModel.substituteUserId = this.ifsSEmployeeSecondaryListModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked).id;

          let subSelected = this.SelectedIFSSEmployeeSecondaryModel.filter(i => i.isChecked == true);
         //console.log(this.SelectedIFSSEmployeeSecondaryModel)
          if (subSelected.length > 0) {
            /* console.log(subSelected)
            console.log(this.SelectedIFSSEmployeeSecondaryModel) */
            if (this.SelectedIFSSEmployeeSecondaryModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked) != null) {
              //console.log(1)
              this.collaborationTeamAccessModel.substituteUserId = this.SelectedIFSSEmployeeSecondaryModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked).id;
            }
            else {
              //console.log(2)
              this.collaborationTeamAccessModel.substituteUserId = "00000000-0000-0000-0000-000000000000";
            }
          }
          else {
            //console.log(3)
            this.collaborationTeamAccessModel.substituteUserId = "00000000-0000-0000-0000-000000000000";
          }

          this.collaborationTeamAccessModel.role = null;
          this.collaborationTeamAccessModel.pageName = null;
          this.collaborationTeamAccessModel.isEdit = false;
          this.collaborationTeamAccessModel.isFull = false;
          this.collaborationTeamAccessModel.isView = false;

          // if edit, then role, pageName, isEdit,isFull and isView should be binded with the appropriate data.
          if (this.colTeamAccessModel != null) {
            this.collaborationTeamAccessModel.role = this.colTeamAccessModel.role;
            this.collaborationTeamAccessModel.pageName = this.colTeamAccessModel.pageName;
            this.collaborationTeamAccessModel.isEdit = false;
            this.collaborationTeamAccessModel.isFull = false;
            this.collaborationTeamAccessModel.isView = false;

          }
          if (this.CollabAccess.length > 0) {
            let useraccess = this.CollabAccess.filter(det => det.userId == this.collaborationTeamAccessModel.userId)
            //  console.log(useraccess);       
            if (useraccess.length > 0) {
              this.collaborationTeamAccessModel.isEdit = useraccess[0].isEdit;
              this.collaborationTeamAccessModel.isFull = useraccess[0].isFull;
              this.collaborationTeamAccessModel.isView = useraccess[0].isView;
              if (this.collaborationTeamAccessModel.isEdit) {
                this.collaborationTeamAccessModel.selectedAccessLvl.push("Edit");
              } if (this.collaborationTeamAccessModel.isView) {
                this.collaborationTeamAccessModel.selectedAccessLvl.push("View");
              } if (this.collaborationTeamAccessModel.isView && this.collaborationTeamAccessModel.isEdit) {
                this.collaborationTeamAccessModel.selectedAccessLvl.push("Full");
              }
              let accesspage = this.CollabAccess.filter(det => det.userId == this.collaborationTeamAccessModel.userId).map(det => det.pageName)
              let uniquepage = accesspage.filter((item, w, ar) => ar.indexOf(item) === w);
              //console.log(unique);   
              uniquepage.forEach(det => {
                this.collaborationTeamAccessModel.selectedpagesAccess.push(det);
              })
              let rolefrx = this.CollabAccess.filter(det => det.userId == this.collaborationTeamAccessModel.userId).map(det => det.role)
              let uniquerole = rolefrx.filter((item, w, ar) => ar.indexOf(item) === w);
              uniquerole.forEach(det => {
                this.collaborationTeamAccessModel.selectedrfxRoleList.push(det);
              })
            }
          }
          this.rfqAccessModelList.push(this.collaborationTeamAccessModel);
         // console.log(this.rfqAccessModelList)
        } else {
          if (this.ifsSEmployeeSecondaryListModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked != null)) {
            this.collaborationTeamAccessModel.substituteUserId = this.ifsSEmployeeSecondaryListModel.find(x => x.primaryUserId == this.SelectedIFSSEmployeePrimaryModel[i].id && x.isChecked).id;
          }
          else {
            this.collaborationTeamAccessModel.substituteUserId = "00000000-0000-0000-0000-000000000000";
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
     
     this.ref.detectChanges();
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
     this.ref.detectChanges();
      
    }
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

  selectedSubUser(id: string, selectedPrimId: string) {
   
    this.ifsSEmployeeSecondaryListModel.forEach(x => {
      if (x.id == id) {
        x.isChecked = true;
        x.primaryUserId = selectedPrimId;
        // this.openSubTab = true;
      }
    });
   
    var count = this.ifsSEmployeeSecondaryListModel.filter(x => x.isChecked == true).length;
    if (this.SelectedIFSSEmployeePrimaryModel.length == count) {
      this.isDisabledCheckbox = true;
    } else {
      this.isDisabledCheckbox = false;
    }
    // Saves Id of selected user so it can be used to save RFQCOllaborationTeam          
  }
  UpdateSelectedData(row){
    this.SelectedIFSSEmployeeSecondaryModel.forEach(i=>{
      if(i.id==row.id){
   /*      console.log(row.id);
        console.log(i.id); */
        i.primaryUserId=row.primaryUserId
      }
    })
  }
  selectedSecUserCheckBoxValidation(row) {
    //console.log(this.SelectedIFSSEmployeeSecondaryModel);
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
   //console.log(this.SelectedIFSSEmployeeSecondaryModel);
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
    //console.log(this.SelectedIFSSEmployeeSecondaryModel);
  }

  doAction() {
    this.dialogRef.close();
    //window.location.reload() ;
  }
  GetCollTeamAcessByTeamId() {
    this.ifsEmployeeService.GetCollTeamAcessByTeamId(this.collaborationTeamId).subscribe(result => {

      let apiResult=result;
      this.CollabAccess = apiResult.collaborationTeamAccessModel;    
      //console.log(apiResult);
      if(apiResult.primaryUser!=null){
        if(apiResult.primaryUser.length>0){
          this.SelectedIFSSEmployeePrimaryModel=apiResult.primaryUser
        } 
      } 
      if(apiResult.substituteUser!=null){
        if(apiResult.substituteUser.length>0){
          this.SelectedIFSSEmployeeSecondaryModel=apiResult.substituteUser
          this.SelectedIFSSEmployeeSecondaryModel.forEach(det => {
            det.isChecked=false;
           let subsUser = this.CollabAccess.filter(w => w.substituteUserId == det.id)
         
           if (subsUser.length > 0) {
            det.isChecked=true
           det.primaryUserId=subsUser[0].userId
           this.SelectedIFSSEmployeePrimaryModel.filter(w=>{
            if(w.id==det.primaryUserId){
              w.isSelectedPrimUser = true;
            }
           })
           } 
           
         }) 
        }
      }  
      
      this.ifsSEmployeeSecondaryListModel.forEach(det => {
        det.isChecked=false;
       let subsUser = this.CollabAccess.filter(w => w.substituteUserId == det.id)
     
       if (subsUser.length > 0) {
        det.isChecked=true
       det.primaryUserId=subsUser[0].userId
        
       } 
       
     }) 
    });
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
}
