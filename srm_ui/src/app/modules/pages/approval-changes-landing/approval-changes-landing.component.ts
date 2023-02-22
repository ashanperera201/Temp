/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { HttpClient } from '@angular/common/http';
const htmlToPdfmake = require('html-to-pdfmake');
import moment from 'moment';
import { DatePipe } from '@angular/common';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export interface ChangeApproval {
  supplierId: string;
  supplierName: string;
  status: string;
  submittedDate: string;
  isGeneralChange: boolean;
  isCategoryChange: boolean;
  isBanckChange: boolean;
  approvalCategoryString: string;

}
@Component({
  selector: 'approval-changes-landing',
  templateUrl: './approval-changes-landing.component.html',
  styleUrls: ['./approval-changes-landing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApprovalChangesLandingComponent implements OnInit {
  @ViewChild('pendingPaginator') pendingPaginator: MatPaginator;
  @ViewChild('pendingSort') pendingSort: MatSort;
  @ViewChild('approvedPaginator') approvedPaginator: MatPaginator;
  @ViewChild('approvedSort') approvedSort: MatSort;

  displayedColumns: string[] = ['supplierId', 'supplierName', 'status', 'submittedDate', 'changeApprovalCategory'];
  dataSourcePending: MatTableDataSource<ChangeApproval>;
  dataSourceApproved: MatTableDataSource<ChangeApproval>;
  value: string;
  value2: string;
  supplierRole: string;

  tempData: ChangeApproval[];

  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private datePipe: DatePipe) {
    this.supplierRole = localStorage.getItem('userrole');
  }

  ngOnInit(): void {
    const roleName = 'srm-analyst';
    this.http.get(environment.nodeurl + '/api/supplier/changeApprovals?rolename=' + roleName)
      .subscribe((data: ChangeApproval[]) => {
        if (data) {
          data.forEach((x) => {
            x.approvalCategoryString = '';
            if (x.isGeneralChange) {
              x.approvalCategoryString = x.approvalCategoryString + 'General';
            }
            if (x.isCategoryChange || x.isBanckChange) {
              x.approvalCategoryString = x.approvalCategoryString + ', ';
            }
            if (x.isCategoryChange) {
              x.approvalCategoryString = x.approvalCategoryString + 'Category';
            }
            if (x.isBanckChange) {
              x.approvalCategoryString = x.approvalCategoryString + ', ';
            }
            if (x.isBanckChange) {
              x.approvalCategoryString = x.approvalCategoryString + 'Bank';
            }

            if (x.isBanckChange || x.isCategoryChange || x.isGeneralChange) {
              x.approvalCategoryString = x.approvalCategoryString + ' Change';
            }
            while (x.approvalCategoryString.charAt(0) === ',') {
              x.approvalCategoryString = x.approvalCategoryString.substring(1);
            }
          });
          if(this.supplierRole == 'IMI-SRM Analyst'){
            this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Awaiting SRM change approval'));
          }

          if(this.supplierRole == 'IMI-GM'){
            this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Awaiting GM change approval'));
          }

          if(this.supplierRole == 'IMI-VP'){
            this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Awaiting VP change approval'));
          }

          if(this.supplierRole == 'IMI-Treasury Bank Reviewer'){
            this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Awaiting Bank Reviewer change approval'));
          }

          if(this.supplierRole == 'IMI-Treasury Bank Approver'){
            this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Awaiting Bank Approver change approval'));
          }

          // this.dataSourcePending = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status != 'Approved'));
          this.dataSourceApproved = new MatTableDataSource<ChangeApproval>(data.filter(x => x.status == 'Approved'));

          this.dataSourcePending.paginator = this.pendingPaginator;
          this.dataSourcePending.sort = this.pendingSort;

          this.dataSourceApproved.paginator = this.approvedPaginator;
          this.dataSourceApproved.sort = this.approvedSort;
        }
      });
  }
  filterChange = (type, event): void => {

    let value = '';
    if (type === 'submittedDate') {
      value = this.datePipe.transform(event.target.value, 'dd-MMM-YYYY');
      //value = moment(event.target.value).format('DD-MM-YYYY');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }

    const filterValue = value;

    this.dataSourceApproved.filter = filterValue.trim().toLowerCase();

    if (type === 'supplierId') {
      this.dataSourceApproved.filterPredicate = (data, filter: any): boolean => data.supplierId.toString().toLowerCase().includes(filter);
    } else if (type === 'supplierName') {
      this.dataSourceApproved.filterPredicate = (data, filter: any): boolean => data.supplierName.toString().toLowerCase().includes(filter);
    } else if (type === 'status') {
      this.dataSourceApproved.filterPredicate = (data, filter: any): boolean => data.status.toLowerCase().includes(filter);
    } else if (type === 'submittedDate') {
      this.dataSourceApproved.filterPredicate = (data, filter: any): boolean => data.submittedDate.toString().toLowerCase().includes(filter);
    }

    if (this.dataSourceApproved.paginator) {
      this.dataSourceApproved.paginator.firstPage();
    }
  };


  // Filter the data table
  filterChange2(type, event): void {
    let value = '';
    if (type === 'submittedDate') {
      value = this.datePipe.transform(event.target.value, 'dd-MMM-YYYY');
      //value = moment(event).format('DD-MMM-YYYY');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }
    const filterValue = value;

    this.dataSourcePending.filter = filterValue.trim().toLowerCase();

    if (type === 'supplierId') {
      this.dataSourcePending.filterPredicate = (data, filter: any): boolean => data.supplierId.toString().toLowerCase().includes(filter);
    } else if (type === 'supplierName') {
      this.dataSourcePending.filterPredicate = (data, filter: any): boolean => data.supplierName.toString().toLowerCase().includes(filter);
    } else if (type === 'status') {
      this.dataSourcePending.filterPredicate = (data, filter: any): boolean => data.status.toLowerCase().includes(filter);
    } else if (type === 'submittedDate') {
      this.dataSourcePending.filterPredicate = (data, filter: any): boolean => data.submittedDate.toString().toLowerCase().includes(filter);
    }

    if (this.dataSourcePending.paginator) {
      this.dataSourcePending.paginator.firstPage();
    }
  }

  //reset filters/data
  resetFilters(): void {
    this.filterChange('', '');
  }
  //reset filters/data
  resetFilters2(): void {
    this.filterChange2('', '');
  }

  goToApprovalPage(supplierId): void {
    this.router.navigate(['/approvals-page/' + supplierId]);
  }

  getData(supplierId): void {
    this.router.navigate(['/dashboard/inner/d/' + supplierId]);
  }
}

