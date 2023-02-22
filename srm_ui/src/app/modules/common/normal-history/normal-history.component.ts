import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from 'environments/environment.prod';

export interface DashboardElement {
    createdDate: string;
    decisionOutcome: string;
    propertyOutcome: number;
    actionCommand: string;
    decisionRemarks: string;
    userId: number;
    userRole: string;
    userEmail: string;
  }
  
  const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'history',
    styleUrls: ['normal-history.component.scss'],
    templateUrl: 'normal-history.component.html',
    providers: [
        DatePipe
      ]
})
export class NormalHistoryComponent implements AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    @Input() supplierId: string;
    @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

    dataSourceDashboardList: any = [];
    dataSourceNew = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    displayedColumns: string[] = ['position','createdDate', 'decisionOutcome','propertyOutcome','actionCommand','decisionRemarks','userId','email','userRole'];

    constructor(private datePipe: DatePipe,private http: HttpClient) {
    }

    ngAfterViewInit() {
    }

    ngOnInit() {
        this.http.get(environment.nodeurl + '/api/workflow/history?suplierId=' + this.supplierId)
        .subscribe(datahis => {
            var history: any = [];
            history = datahis;
            this.filltabledata(history);
        });
      }

    filltabledata(data: any) {
        if (data) {
          this.dataSourceDashboardList = [];
          data.forEach(element => {
            this.dataSourceDashboardList.push(
              {
                createdDate: this.datePipe.transform(element.createddate, "dd-MMM-yyyy HH:mm"),
                decisionOutcome: element.status_remark,
                propertyOutcome: element.iscurrentstatus,
                actionCommand: element.çommandName,
                decisionRemarks: element.status_comment,
                userId: element.userid,
                userRole: element.userrole,
                userEmail: element.useremail
              }
            )
          });
    
          this.dataSourceNew = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
          // this.dataSourceNew.paginator = this.tableOnePaginator;
        }
      }
}


