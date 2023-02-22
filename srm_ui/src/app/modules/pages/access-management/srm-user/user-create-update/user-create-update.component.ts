import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SrmUserService } from '../../../../../shared/Services/srm-user.service';
import { UserTabComponent } from './user-tab/user-tab.component';

@Component({
  selector: 'app-user-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss']
})
export class UserCreateUpdateComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(UserTabComponent) userTabComponentrt: MatSort;

  rowData: any;
  newUser: string;

  hasAnotherDropZoneOver: boolean;
  response: string;

  toDoOverviewDataSource: MatTableDataSource<any>;
  displayedDashboardColumns: string[];
  filteredOptions: any;

  inputType: string = 'password';


  serviceTypes = [
    {
      "id": 1,
      "label": "Service type 1"
    },
    {
      "id": 2,
      "label": "Service type 2"
    }
  ];

  groupNameSelected: string[] = [];

  constructor(
    // public dialog: MatDialog,
    // public matDialogRef: MatDialogRef<UserCreateUpdateComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private srmUserService: SrmUserService) {

  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    // this.toDoOverviewDataSource.paginator = this.paginator;
    // this.toDoOverviewDataSource.sort = this.sort;
  }

  delete(i): void {
    console.log(i);
  }

  closeModal = () => {
    // this.matDialogRef.close();
  }

  showPw(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }



}
