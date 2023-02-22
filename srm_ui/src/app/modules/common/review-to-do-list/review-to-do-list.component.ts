import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { UserFields } from 'app/main/Models/Template';
import { ReviewTodo } from 'app/modules/pages/supplier-reviews/supplier-review-models';
import { DataService } from 'app/modules/pages/supplier-reviews/supplier-review-data.service';
import { SupplierReviewConstants } from 'app/modules/pages/supplier-reviews/supplier-review-constants';
const ELEMENT_TODO: ReviewTodo[] = [];

@Component({
  selector: 'app-review-to-do-list',
  templateUrl: './review-to-do-list.component.html',
  styleUrls: ['./review-to-do-list.component.scss'],
 // providers: [DatePipe]
})
export class ReviewToDoListComponent implements OnInit {

  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild('select') select: MatSelect;
  employees: any[];
  issuccess = false;
  iserror = false;
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully saved';
  selectedValue: string = 'all';
  isloading: boolean = true;
  allSelected: boolean = false;
  filterName:string;
  dataSourceDashboardList: any = [];
  supplierReviewalActionType = SupplierReviewConstants.supplierReviewalActionType;
  reviewApprovalActionType = SupplierReviewConstants.reviewApprovalActionType;
  dataSource = new MatTableDataSource(ELEMENT_TODO);
  displayedColumns: string[] = ['id', 'actionType', 'evaluationName', 'supplierName', 'actionTakerUsername', 'status',
  'createdDate', 'modifiedDate'];

  custom_search = [
    { value: true, viewValue: 'All' },
    { value: true, viewValue: 'Action' },
    { value: true, viewValue: 'Evaluation Name' },
    { value: true, viewValue: 'Supplier Name' },
    { value: true, viewValue: 'Action Taker' },
    { value: true, viewValue: 'Status' },
    { value: true, viewValue: 'Created Date' },
    { value: true, viewValue: 'Modified Date' }
  ];

  ColumnList = [
    { name: 'Action', completed: 0, val: 'actionType' },
    { name: 'Evaluation Name', completed: 1, val: 'evaluationName' },
    { name: 'Supplier Name', completed: 2, val: 'supplierName' },
    { name: 'Action Taker', completed: 3, val: 'actionTakerUsername' },
    { name: 'Status', completed: 4, val: 'status' },
    { name: 'Created Date', completed: 5, val: 'createdDate' },
    { name: 'Modified Date', completed: 6, val: 'modifiedDate' }
  ]

  FilterdisplayedColumns = [
    { name: 'Supplier Name', selected: false },
    { name: 'Action Taker', selected: false },
    { name: 'Status', selected: false },
    { name: 'Created Date',selected: false },
    { name: 'Modified Date',selected: false }
  ]

  columnsToDisplay: string[] = this.ColumnList.map(c => c.val);
  columnsToDisplayDesc: string[] = this.ColumnList.map(c => c.name);

  choose_search: any;
  tempData: ReviewTodo[];
  currentUserRole: string;
  useremail = '';

  constructor(private http: HttpClient, private router: Router, private dataService: DataService,) {
    this.choose_search = "All";
    this.getUserSelectedFields();
  }

  ngOnInit(): void {
  }

  // Set to data to table
  filltabledata(data: any) {
    if(localStorage.getItem('dashboardspTodofilter')!=''){
      this.filterName = localStorage.getItem('dashboardspTodofilter');
      this.selectedValue = localStorage.getItem('dashboardspTodofiltersel')? localStorage.getItem('dashboardspTodofiltersel'):'all';
      
    }else{
      this.filterName = '';
      this.selectedValue = 'all';
    }

    if (data) {
      this.dataSourceDashboardList = [];
      data.forEach(element => {
        this.dataSourceDashboardList.push(
          {
            actionType: element.actionType,
            supplierName: element.supplierName,
            evaluationName: element.evaluationName,
            actionTakerUsername: element.actionTakerUsername,
            status: element.status,
            createdDate: element.createdDate,
            modifiedDate: element.modifiedDate,
            reviewResponseId: element.reviewResponseId
          }
        )
      });
      this.dataSource = new MatTableDataSource<ReviewTodo>(this.dataSourceDashboardList);
      this.tempData = this.dataSource.data;
      this.table.renderRows();
      this.dataSource.paginator = this.tableOnePaginator;

      if(localStorage.getItem('dashboardspTodofilter')!=''){
        this.applyFilter(localStorage.getItem('dashboardspTodofilter'));
      }

    }
    this.isloading = false;
  }

  selectchange(){
    this.applyFilter(localStorage.getItem('dashboardspTodofilter')?localStorage.getItem('dashboardspTodofilter'):'');
  }

  applyFilter(value) {
    const filterValue = value?value.trim().toLowerCase():'';

    localStorage.setItem('dashboardspTodofilter',value?value.trim():'');
    localStorage.setItem('dashboardspTodofiltersel',this.selectedValue);

    if (this.selectedValue == 'all') {
      this.dataSource.data = this.tempData;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource.data = this.tempData;
      var type = this.selectedValue;

      const temp = this.dataSource.data.filter(function (d) {
        var result;
        console.log("typee", type, d)
        if (type == "Action") { result = d.actionType; }
        else if (type == "Evaluation Name") { result = d.evaluationName; }
        else if (type == "Supplier Name") { result = d.supplierName; }
        else if (type == "Action Taker") { result = d.actionTakerUsername; }
        else if (type == "Status") { result = d.status; }
        else if (type == "Created Date") { result = d.createdDate; }
        else if (type == "Modified Date") { result = d.modifiedDate; }
        return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue || result.toLowerCase().includes(filterValue);
      });
      this.dataSource.data = temp;
    }
    this.isloading = false;
  }

  async getUserSelectedFields() {
    this.useremail = localStorage.getItem("useremail");

    this.http.get(environment.nodeurl + '/api/template/userDatatableFields?email=' + this.useremail)
      .subscribe(data => {
        if (data) {
          var selected: any = data;
          if (selected.filter(x => x.section == 'reviewtodo Task').length > 0) {
            var usersavedcolumns: string[] = selected.filter(x => x.section == 'reviewtodo Task')[0].selectedColumns;

            var tempColumnList: string[] = [];
            tempColumnList.push('actionType', 'evaluationName');
            var templist = this.ColumnList;

            usersavedcolumns.forEach(element => {
              var objIndex = this.FilterdisplayedColumns.findIndex((obj => obj.name == element));
              if (objIndex != -1) {
                this.FilterdisplayedColumns[objIndex].selected = true;

                tempColumnList.push(templist.filter(x => x.name == element)[0].val);
              }
            });

            this.columnsToDisplay = this.columnsToDisplay.filter(x => tempColumnList.includes(x));
            this.columnsToDisplayDesc = this.columnsToDisplayDesc.filter(x => usersavedcolumns.includes(x));
          }
          else {
            for (let index = 0; index < this.FilterdisplayedColumns.length; index++) {
              this.FilterdisplayedColumns[index].selected = true;
            }
          }
        }
      });
  }

  async saveFields() {
    var templatedto = new UserFields();
    templatedto.section = 'reviewtodo Task';
    templatedto.selectedColumns = this.columnsToDisplayDesc;

    this.http.post<any>(environment.nodeurl + '/api/template/SaveUserField?email=' + this.useremail, templatedto).subscribe(data2 => {
      if (data2) {
        this.issuccess = true;
      } else {
        this.iserror = true;
      }
      setTimeout(function () {
        this.issuccess = false;
        this.iserror = false;
      }.bind(this), 2000);
    });
  }

  addRemoveField(item, event) {
    var selitem = this.ColumnList.filter(a => a.name == item).map(c => c.val)[0];

    if (selitem) {
      if (!event.checked) {
        var index = this.ColumnList.filter(x=>x.val == selitem)[0].completed;
        this.columnsToDisplay.splice(index,0,selitem);
        this.columnsToDisplayDesc.splice(index,0,item);
      } else {
        this.columnsToDisplay = this.columnsToDisplay.filter(a => a !== selitem);
        this.columnsToDisplayDesc = this.columnsToDisplayDesc.filter(a => a !== item);
      }
    }
  }

  gotoActionPage(row) {
    if (row.actionType==this.supplierReviewalActionType){
      this.dataService.todoOrigin = 1;
      this.dataService.editResponse = 1;
    }
    else if (row.actionType == this.reviewApprovalActionType){
      this.dataService.todoOrigin = 1;
      this.dataService.approvalState = 1;  
    }
    this.router.navigate(['/review-response-page/' + row.reviewResponseId]);
  }

  toggleAllSelection() {
    var selected = this.allSelected;
    for (var i = 0; i < this.FilterdisplayedColumns.length; i++) {
      this.FilterdisplayedColumns[i].selected = selected;
    }
    if(this.allSelected){
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    }else{
      this.columnsToDisplay = ['actionType','evaluationName'];
      this.columnsToDisplayDesc = ['actionType','evaluationName'];
    }
  }
}