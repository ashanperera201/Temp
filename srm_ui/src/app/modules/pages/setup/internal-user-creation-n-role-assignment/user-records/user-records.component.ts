import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Table } from './table';
interface Lang {
  viewValue: string; value: string;
}
interface Currency {
  viewValue: string; value: string;
}

interface Login {
  viewValue: string; value: string;
}

export interface RoleSection {
  name: string;
  title: string;
}

export interface SelectedRole {
  name: string;
  title: string;
}

const ELEMENT_DATA_CATEGORIES_NEW: Table[] = [
  {
    id: 1,
    created: 'Mellie',
    userName: 'Gabbott',
    type: 'mgabbott0@indiatimes.com',
    description: '11/01/22 : 11:00AM',
    action: 'approved',
    status: 'open'
  },
  {
    id: 2,
    created: 'Yehudi',
    userName: 'Ainsby',
    type: 'yainsby1@w3.org',
    description: 'Support',
    action: 'open',
    status: 'close'
  },
  {
    id: 3,
    created: 'Noellyn',
    userName: 'Primett',
    type: 'nprimett2@ning.com',
    description: 'Human Resources',
    action: 'reject',
    status: 'open'
  },
  {
    id: 4,
    created: 'Stefanie',
    userName: 'Yurenin',
    type: 'syurenin3@boston.com',
    description: 'Marketing',
    action: 'approved',
    status: 'close'
  },
  {
    id: 5,
    created: 'Stormi',
    userName: "O'Lunny",
    type: 'solunny4@patch.com',
    description: 'Engineering',
    action: 'approved',
    status: 'open'
  },
  {
    id: 6,
    created: 'Keelia',
    userName: 'Giraudy',
    type: 'kgiraudy5@nba.com',
    description: 'Marketing',
    action: 'open',
    status: 'close'
  },
  {
    id: 7,
    created: 'Ikey',
    userName: 'Laight',
    type: 'ilaight6@wiley.com',
    description: 'Support',
    action: 'reject',
    status: 'close'
  },
  {
    id: 8,
    created: 'Adrianna',
    userName: 'Ruddom',
    type: 'aruddom7@seattletimes.com',
    description: 'Marketing',
    action: 'reject',
    status: 'open'
  },
  {
    id: 9,
    created: 'Dionysus',
    userName: 'McCory',
    type: 'dmccory8@ox.ac.uk',
    description: 'Engineering',
    action: 'Open',
    status: 'close'
  },
  {
    id: 10,
    created: 'Claybourne',
    userName: 'Shellard',
    type: 'cshellard9@rediff.com',
    description: 'Engineering',
    action: 'approved',
    status: 'open'
  },
];
@Component({
  selector: 'app-user-records',
  templateUrl: './user-records.component.html',
  styleUrls: ['./user-records.component.scss']
})
export class UserRecordsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  rowData: any;
  userForm: FormGroup;
  newUser: string;

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;

  groupName: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  groupNameSelected: string[] = ['List 06', 'List 07', 'List 08', 'List 09', 'List 10'];
  roles: RoleSection[] = [
    {
      name: 'RID 4467',
      title: 'Reviewer 1',
    },
    {
      name: 'RID 4468',
      title: 'Reviewer 2',
    },
    {
      name: 'RID 4469',
      title: 'Reviewer 3',
    },
  ];
  selectedRoles: SelectedRole[] = [
    {
      name: 'RID 4467',
      title: 'Reviewer 1',
    },
    {
      name: 'RID 4468',
      title: 'Reviewer 2',
    },
    {
      name: 'RID 4469',
      title: 'Reviewer 3',
    },
  ];
  /* dropdown inside the form - specific values */
  lang: Lang[] = [
    { viewValue: 'Dropdown value 01', value: 'val01 ' },
  ];

  currency: Currency[] = [
    { viewValue: 'Dropdown value 01', value: 'val01 ' },
  ];

  login: Login[] = [
    { viewValue: 'Dropdown value 01', value: 'val01 ' },
  ];

  toDoOverviewDataSource: MatTableDataSource<Table>;
  displayedDashboardColumns: string[];

  groupNameSearch = new FormControl();
  roleSelect = new FormControl();
  options: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  roleIdSelect: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  roleNameSelect: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  filteredOptions: Observable<string[]>;
  inputType: string = 'password';

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      userName: [''],
    });

    const user = this.activatedRoute.snapshot.queryParamMap.get('user');
    const type = this.activatedRoute.snapshot.queryParamMap.get('type');
    this.rowData = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('row'));
    if (user === 'new') {
      this.newUser = this.userForm.get('userName').value;
    } else {
      this.newUser = this.rowData.userIdentity;
    }

    this.toDoOverviewDataSource = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);

    this.displayedDashboardColumns = ['created', 'userName', 'description'];
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


  ngOnInit(): void {

    this.uploader = new FileUploader({

      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        //debugger
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe(res => this.response = res);

    this.filteredOptions = this.roleSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.filteredOptions = this.groupNameSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }


  ngAfterViewInit(): void {
    this.toDoOverviewDataSource.paginator = this.paginator;
    this.toDoOverviewDataSource.sort = this.sort;
  }

  delete(i): void {
    console.log(i);
  }

  showPw(): void {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


}
