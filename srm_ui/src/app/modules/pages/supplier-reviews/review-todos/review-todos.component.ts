/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { ReviewTodo } from '../supplier-review-models';
import { DataService } from '../supplier-review-data.service';
import { DatePipe } from '@angular/common';
import { UserGroupService } from 'app/shared/Services/user-groups.service';

@Component({
  selector: 'app-review-todos',
  templateUrl: './review-todos.component.html',
  styles: [
  ]
})

export class ReviewTodosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;

  displayedColumns13: string[] = ['actionType','evalName', 'formType', 'supplierName', 'actionTakerUsername', 'status', 'createdDate', 'modifiedDate',
   'actionButton', 'viewButton'];

  todos: MatTableDataSource<ReviewTodo>;
  panelOpenState = false;
  reviewTodoCreatedState = SupplierReviewConstants.reviewTodoCreatedState;
  supplierReviewalActionType = SupplierReviewConstants.supplierReviewalActionType;
  reviewApprovalActionType = SupplierReviewConstants.reviewApprovalActionType;
  userGroupDetails = [];
  userGroups = [];
  /**
   * Constructor
   */
  constructor(public dialog: MatDialog, private http: HttpClient, private router: Router, private dataService: DataService,  
    private datePipe: DatePipe,  private userGroupService: UserGroupService) {
  }

  ngOnInit(): void {
    this.http.get(environment.nodeurl + '/api/supplier/reviewTodosByUser?loggedInUser=' + localStorage.getItem("username"))
      .subscribe((data: ReviewTodo[]) => {
        if (data) {
          this.todos = new MatTableDataSource<ReviewTodo>(data);
          this.todos.paginator = this.paginator;
          this.todos.sort = this.sort;
        }
        this.userGroupService.getUserGroupInfo().subscribe((data1: any) => {
          if (data1) {
            this.userGroupDetails = data1;
            this.userGroupService.fetchUserGroups().subscribe((data: any) => {
              if (data) {
                this.userGroups = data;
              }
            })
          }
        })
      });
  }

  canViewResponse(row){
    if (
      row.status != this.reviewTodoCreatedState){

        // below checks are not needed as BE only sends TODOS related to loggedInUser
        if (row.actionTakerUsername.toLowerCase() == localStorage.getItem('username').toLowerCase())
           return true;
        else{
         const userGroup = this.userGroups.find(x => x.userGroup.toLowerCase() === row.actionTakerUsername.toLowerCase());
         if (userGroup){
          const userGroupId = userGroup.id;
          const result = this.userGroupDetails.find(x => x.groupId === userGroupId);
          const fetchedUsersGroupInfo = JSON.parse(result.userIds);
          if (fetchedUsersGroupInfo.includes(localStorage.getItem('useremail').toLowerCase())){
            return true;
          }}

        }
  }
  else
  return false;
  }
  canTakeAction(row) {
    if (
        row.status == this.reviewTodoCreatedState){

          // below checks are not needed as BE only sends TODOS related to loggedInUser
          if (row.actionTakerUsername.toLowerCase() == localStorage.getItem('username').toLowerCase())
             return true;
          else{
           const userGroup = this.userGroups.find(x => x.userGroup.toLowerCase() === row.actionTakerUsername.toLowerCase());
           if (userGroup){
            const userGroupId = userGroup.id;
            const result = this.userGroupDetails.find(x => x.groupId === userGroupId);
            const fetchedUsersGroupInfo = JSON.parse(result.userIds);
            if (fetchedUsersGroupInfo.includes(localStorage.getItem('useremail').toLowerCase())){
              return true;
            }}

          }
    }
    else
    return false;
}
  goToActionPage(row){
      if (row.actionType==this.supplierReviewalActionType){
        this.dataService.todoOrigin = 1;
        this.dataService.approvalState = 0;  
        this.dataService.editResponse = 1;
      }
      else if (row.actionType == this.reviewApprovalActionType){
        this.dataService.todoOrigin = 1;
        this.dataService.approvalState = 1;  
      }
      this.dataService.currentToDo = row;
      this.router.navigate(['/review-response-page/' + row.reviewResponseId]);
  }

  goToResponsePage(row){
    console.log("here 2")
    this.dataService.approvalState = 1;
    if (row.actionType==this.supplierReviewalActionType){
      this.dataService.todoOrigin = 1;
      this.dataService.editResponse = 0;
    }
    else if (row.actionType == this.reviewApprovalActionType){
      this.dataService.todoOrigin = 1;
    }
    this.router.navigate(['/review-response-page/' + row.reviewResponseId]);
}

  // Filter the data table
  filterChange(type, event): void {
    let value = '';
    if (type === 'createdDate' || type === 'modifiedDate') {
      value = this.datePipe.transform(event.target.value, 'dd/MM/YY');
      //value = moment(event).format('DD-MMM-YYYY');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }
    const filterValue = value;

    this.todos.filter = filterValue.trim().toLowerCase();

    if (type === 'actionType') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.actionType.toString().toLowerCase().includes(filter);
    } else if (type === 'actionTakerUsername') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.actionTakerUsername.toString().toLowerCase().includes(filter);
    } else if (type === 'status') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.status.toLowerCase().includes(filter);
    } else if (type === 'evalName') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.evaluationName.toLowerCase().includes(filter);
    }else if (type === 'formType') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.services.toLowerCase().includes(filter);
    } else if (type === 'supplierName') {
      this.todos.filterPredicate = (data, filter: any): boolean => data.supplierName.toLowerCase().includes(filter);
    } 

    if (this.todos.paginator) {
      this.todos.paginator.firstPage();
    }
  }

  //reset filters/data
  resetFilters(): void {
    this.filterChange('', '');
  }
}

