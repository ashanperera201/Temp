import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardTagsDatatableComponent } from 'app/modules/common/dashboard-tags-datatable/dashboard-tags-datatable.component';
import { EmergPendingListComponent } from 'app/modules/common/emerg-pending-list/emerg-pending-list.component';
import { InviteSupplierListComponent } from 'app/modules/common/invite-supplier-list/invite-supplier-list.component';
import { NormalDatatableComponent } from 'app/modules/common/normal-datatable/normal-datatable.component';
import { NormalRegListComponent } from 'app/modules/common/normal-reg-list/normal-reg-list.component';
import { TagsOverlayComponent } from 'app/modules/common/tags-overlay/tags-overlay.component';
import { ReviewToDoListComponent } from 'app/modules/common/review-to-do-list/review-to-do-list.component';
import { environment } from 'environments/environment.prod';
import { AuthService } from '@auth0/auth0-angular';
import { SupplierReviewConstants } from '../supplier-reviews/supplier-review-constants';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DashboardComponent implements OnInit{

  @ViewChild(NormalDatatableComponent) child: NormalDatatableComponent;
  @ViewChild(NormalRegListComponent) childall: NormalRegListComponent;
  @ViewChild(EmergPendingListComponent) childemg: EmergPendingListComponent;
  @ViewChild(ReviewToDoListComponent) childSp: ReviewToDoListComponent;
  @ViewChild(InviteSupplierListComponent) childinv: InviteSupplierListComponent;
  @ViewChild(DashboardTagsDatatableComponent) childTag: DashboardTagsDatatableComponent;


  @Output() messageEvent = new EventEmitter<[]>();

  panelOpenState = false;
  dashboardStat: any = [];
  userTemplateStat: any = [];
  pendingVal: string;
  pendingPerc: string;
  supplierVal: string;
  supplierPerc: string;
  EmergVal: string;
  EmergPerc: string;
  InviteVal: string;
  userrole: string = '';
  useremail: string = '';
  isinviteVisible: boolean = false;
  isemergencyVisible: boolean = false;
  isSupplierPerformanceVisible: boolean = false;
  pendingxpandStatus: boolean = false;
  registeredxpandStatus: boolean = false;
  emergencyxpandStatus: boolean = false;
  supplierPerformanceExpandStatus: boolean = false;
  invitexpandStatus: boolean = false;
  profileSet: any = [];

  NonCriticalVal: any;
  CriticalVal: any;
  HighCriticalVal: any;
  pendingCountData: any = [];
  limitingRoles = SupplierReviewConstants.limitingRoles;
  status1 = "0";
  status2 = "0";
  status3 = "0";
  status4 = "0";
  status5 = "0";
  status6 = "0";
  status7 = "0";
  status8 = "0";
  status9 = "0";
  status10 = "0";
  status11 = "0";
  status12 = "0";
  status13 = "0";
  status14 = "0";
  status15 = "0";
  show = true;
  newData: any;
  searchTerm = "All";
  //messagelist : any = []; 
  /**
   * Constructor
   */
  constructor( private http: HttpClient,public dialog: MatDialog ,private router: Router, public auth: AuthService) {
    
    this.auth.user$.subscribe(
      async (profile) => (
        this.profileSet = profile,
        this.isAuthenticated(),
        this.getWFdata()

      )
    );

        this.getDashboardStatistics();
        this.getUserTemplateStatistics();

  }

  ngOnInit(){
    this.RemoveAllFilters();
    if(localStorage.getItem('dashboardclick') =='pending'){
      this.pendingxpandStatus = true;
      this.getPendingData("All");
    } else if(localStorage.getItem('dashboardclick')=='register'){
      this.registeredxpandStatus = true;
      this.getPendingAllData();
    }else if(localStorage.getItem('dashboardclick')=='emergency'){
      this.emergencyxpandStatus = true;
      this.getPendingEmergData();
    }else if(localStorage.getItem('dashboardclick')=='invite'){
      this.invitexpandStatus = true;
      this.getInviteData();
    }
    else if(localStorage.getItem('dashboardclick')=='supplierPerformance'){
      this.supplierPerformanceExpandStatus = true;
      this.getSupplierPerformanceData();
    }
    else{
      this.pendingxpandStatus = false;
      this.registeredxpandStatus = false;
      this.emergencyxpandStatus = false;
      this.supplierPerformanceExpandStatus = false;
      this.invitexpandStatus = false;
    }
  }

  isAuthenticated(){

      if (this.profileSet == null) {

        console.log('not authenticated');

        location.replace("/home");
      } else {

        console.log('authenticated');
        // location.replace("/supplier/dashboard");
      }

  }

  async getDashboardStatistics() {
    this.userrole = localStorage.getItem("userrole");

    this.http.get(environment.nodeurl + '/api/supplier/statistic?role=' + this.userrole)
      .subscribe(data => {
        this.dashboardStat = data;

        this.dashboardStat.forEach(element => {
          var result = element;
          if (result["description"] == "Pending Task value") {
            this.pendingVal = element["value"];
          } else if (result["description"] == "Pending Task perc") {
            this.pendingPerc = element["value"];
          } else if (result["description"] == "Supplier Reg value") {
            this.supplierVal = element["value"];
          } else if (result["description"] == "Supplier Reg perc") {
            this.supplierPerc = element["value"];
          } else if (result["description"] == "Emergency Suppliers value") {
            this.EmergVal = element["value"];
          } else if (result["description"] == "Emergency Suppliers perc") {
            this.EmergPerc = element["value"];
          } else if (result["description"] == "Invite value") {
            this.InviteVal = element["value"];
          }
        });

        this.setRolePermission();
        this.getPendingCount();
      });
  }

  async getUserTemplateStatistics() {
    this.userrole = localStorage.getItem("userrole");
    this.useremail = localStorage.getItem("useremail");

    this.http.get(environment.nodeurl + '/api/template/userTemplates?role=' + this.userrole+'&email='+this.useremail)
      .subscribe(data => {
        this.userTemplateStat = data;

      });
  }

  changeSelected(templateId,index) {
    this.http.get<any>(environment.nodeurl + '/api/template/querydata?templateId=' + templateId + '&role=' + this.userrole + '&type=N').subscribe(data => {

        var messagelist = data;

        // this.childTag[index].filltabledata(messagelist, 'tags');

    });
  }

  async setRolePermission() {
    this.isSupplierPerformanceVisible = true;
    if (this.userrole == 'IMI-SRM Analyst') {
      this.isinviteVisible = true;
    } else {
      this.isinviteVisible = false;
    }
    if (this.userrole == 'IMI-SRM Analyst' || this.userrole == 'IMI-GM' || this.userrole == 'IMI-VP') {
      this.isemergencyVisible = true;
    } else {
      this.isemergencyVisible = false;
    }
  }

  async getPendingData(word) {
    this.searchTerm = word;
    this.newData = null;

    localStorage.setItem('dashclickItem', 'pendingxpandStatus');
    await this.http.get(environment.nodeurl + '/api/supplier/onlyPendingall?rolename=' + this.userrole).subscribe(async data => {
      if (data) {
        var messagelist = data;
        this.newData = data;

        if (this.searchTerm == "All"){
          this.child.filltabledata(messagelist);
          // this.messageEvent.emit(this.messagelist);
        }
        else{
          if(this.searchTerm == "Normal" || this.searchTerm == "Critical" || this.searchTerm == "High Critical"){
            this.newData = this.newData.filter(x => x.criticality == this.searchTerm);
            await this.child.filltabledata(this.newData);
          }
          else{
            this.newData = this.newData.filter(x => x.supplier_status == this.searchTerm);            
            await this.child.filltabledata(this.newData);
          }
        }
      }
    });
  }

  /**async getPendingData() {
    localStorage.setItem('dashclickItem', 'pendingxpandStatus');
    await this.http.get(environment.nodeurl + '/api/supplier/onlyPendingall?rolename=' + this.userrole).subscribe(async data => {
      if (data) {
        var messagelist = data;

        // this.messageEvent.emit(this.messagelist);
        this.child.filltabledata(messagelist);

      }
    });
  }*/

  public async getPendingCount() {
    this.userrole = localStorage.getItem("userrole");
     
    await this.http.get(environment.nodeurl + '/api/supplier/suppliercount?rolename=' + this.userrole).subscribe(async data => {
      if (data) {
        this.pendingCountData = data;

        this.pendingCountData.forEach(element => {
          var result = element;
          if (result["description"] == "High Critical") {
            this.HighCriticalVal = element["value"];
          } 
          else if (result["description"] == "Critical") {
            this.CriticalVal = element["value"];
          } 
          else if (result["description"] == "Non Critical") {
            this.NonCriticalVal = element["value"];
          } 

          // IMI-HSEQ
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "Awaiting for Audit dates"){
            this.status1 = element["value"];
          }
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "Awaiting for HSEQ Desktop Audit"){
            this.status2 = element["value"];
          }
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "Awaiting for HSEQ Recommendation"){
            this.status3 = element["value"];
          }
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "Awaiting Supplier for Audit Dates"){
            this.status4 = element["value"];
          }
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "Awaiting Supplier response on NCR"){
            this.status12 = element["value"];
          }
          else if(this.userrole == "IMI-HSEQ" && result["description"] == "HSEQ to Perform the Audit"){
            this.status13 = element["value"];
          }

          // IMI-SRM Analyst
          else if(this.userrole == "IMI-SRM Analyst" && result["description"] == "Awaiting for SRM Recommendation"){
            this.status5 = element["value"];
          }
          else if(this.userrole == "IMI-SRM Analyst" && result["description"] == "New - Pending Criticality Matrix"){
            this.status6 = element["value"];
          }
          else if(this.userrole == "IMI-SRM Analyst" && result["description"] == "Pending Criticality Matrix"){
            this.status7 = element["value"];
          }
          else if(this.userrole == "IMI-SRM Analyst" && result["description"] == "Criticality not performed"){
            this.status15 = element["value"];
          }

          // IMI-GM
          else if(this.userrole == "IMI-GM" && result["description"] == "Awaiting for GM approval"){
            this.status8 = element["value"];
          }

          // IMI-VP
          else if(this.userrole == "IMI-VP" && result["description"] == "Awaiting for VP approval"){
            this.status9 = element["value"];
          }

          // IMI-Treasury Bank Reviewer
          else if(this.userrole == "IMI-Treasury Bank Reviewer" && result["description"] == "Awaiting Bank Details Review"){
            this.status10 = element["value"];
          }

          // IMI-Treasury Bank Approver
          else if(this.userrole == "IMI-Treasury Bank Approver" && result["description"] == "Awaiting Bank Details Approval"){
            this.status11 = element["value"];
          }
          
        });
      }
    });
  }

  async getPendingAllData() {
    localStorage.setItem('dashclickItem', 'registeredxpandStatus');
    await this.http.get(environment.nodeurl + '/api/supplier/registerall?rolename=' + this.userrole).subscribe(async data => {
      if (data) {
        var messagelist = data;

        // this.messageEvent.emit(this.messagelist);
        this.childall.filltabledata(messagelist);

      }
    });
  }

  async getPendingEmergData() {
    localStorage.setItem('dashclickItem', 'emergencyxpandStatus');
    await this.http.get(environment.nodeurl + '/api/supplier/registerallemg?rolename=' + this.userrole).subscribe(async data => {
      if (data) {
        var messagelist = data;

        // this.messageEvent.emit(this.messagelist);
        this.childemg.filltabledata(messagelist);

      }
    });
  }

  async getSupplierPerformanceData() {
    localStorage.setItem('dashclickItem', 'supplierPerformanceExpandStatus');
    await this.http.get(environment.nodeurl + '/api/supplier/reviewTodosByUser?loggedInUser=' + localStorage.getItem("username")).subscribe(async data => {
      if (data) {
        var messagelist = data;
        this.childSp.filltabledata(messagelist);
      }
    });
  }


  async getInviteData() {
    if (this.userrole == 'IMI-SRM Analyst') {
      localStorage.setItem('dashclickItem', 'invitexpandStatus');
      await this.http.get(environment.nodeurl + '/api/supplier/invite').subscribe(async data => {
        if (data) {
          var messagelist = data;

          // this.messageEvent.emit(this.messagelist);
          this.childinv.filltabledata(messagelist);

        }
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(TagsOverlayComponent,{disableClose: true});
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async deleteUserTemplate(templateid){
    if (this.useremail != '') {
      this.http.get(environment.nodeurl + '/api/template/DeleteSaveUserTemplate?templateId=' + templateid+'&email='+this.useremail)
        .subscribe(data => {
          window.location.reload() ;

        });
    }
  }

  getWFdata(){
    var wfuser = "admin"
  
    if(this.profileSet.email == 'admin@aspnetboilerplate.com'){
      wfuser = "admin";
    }
    else{
      wfuser = this.profileSet.email;
    }
        
    const documentbody =
    {
      "userNameOrEmailAddress": wfuser,
      "password": "123qwe",
      "rememberClient": true
    }
    
    
    let headers1 = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("auth0token")
    });
    let options1 = { headers: headers1 };

    this.http.get('https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub, options1).subscribe({
      next: (data: any) => {
        if (data) {
          if (this.limitingRoles.includes(localStorage.getItem("userrole")?.toLowerCase().replace(/\s/g, ""))){
            this.show = false;
          }
          let headers = new HttpHeaders({
            'Content-Type':'application/json'
          });
          let options = { headers: headers };
          this.http.post(environment.workflowApiUrl+'/api/TokenAuth/Authenticate',documentbody,options)
            .subscribe(data => {
                var workflowToken = data["result"].accessToken;
                localStorage.setItem('apiTokenworkflow',workflowToken);
              });  

        }}})    

    
  }

  RemoveAllFilters(){
    localStorage.removeItem('reportfilter');
    localStorage.removeItem('allfilter-i');
    localStorage.removeItem('allfilter');
    localStorage.removeItem('auditfilter');
    localStorage.removeItem('allfiltertags');
    localStorage.removeItem('allfilter-e');
    localStorage.removeItem('kpifilter');
  }

}
