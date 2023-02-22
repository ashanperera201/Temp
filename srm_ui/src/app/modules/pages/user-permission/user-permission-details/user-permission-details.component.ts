/* eslint-disable no-var */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Observer } from 'rxjs';
import { UserRole } from './table';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MainMenuPermission, MainTabs, MainTabsPermission, PagesPermission, SectionPermission, SubMenu, SubMenuPermission, SubSectionPermission, SubTabs, SubTabsPermission } from './data';


const userRoleData: UserRole[] = [
  {
    id: 1,
    module: 'Mellie',
    mainMenuCol: 'Gabbott',
    subMenuCol: 'mgabbott0@indiatimes.com',
    pagesCol: 'mgabbott0@indiatimes.com',
    mainTabCol: '11/01/22 : 11:00AM',
    subTabCol: 'approved',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 2,
    module: 'Yehudi',
    mainMenuCol: 'Ainsby',
    subMenuCol: 'yainsby1@w3.org',
    pagesCol: 'yainsby1@w3.org',
    mainTabCol: 'Female',
    subTabCol: 'open',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 3,
    module: 'Noellyn',
    mainMenuCol: 'Primett',
    subMenuCol: 'nprimett2@ning.com',
    pagesCol: 'nprimett2@ning.com',
    mainTabCol: 'Female',
    subTabCol: 'reject',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 4,
    module: 'Stefanie',
    mainMenuCol: 'Yurenin',
    subMenuCol: 'syurenin3@boston.com',
    pagesCol: 'syurenin3@boston.com',
    mainTabCol: 'Female',
    subTabCol: 'approved',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 5,
    module: 'Stormi',
    mainMenuCol: "O'Lunny",
    subMenuCol: 'solunny4@patch.com',
    pagesCol: 'solunny4@patch.com',
    mainTabCol: 'Female',
    subTabCol: 'approved',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 6,
    module: 'Keelia',
    mainMenuCol: 'Giraudy',
    subMenuCol: 'kgiraudy5@nba.com',
    pagesCol: 'kgiraudy5@nba.com',
    mainTabCol: 'Male',
    subTabCol: 'open',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 7,
    module: 'Ikey',
    mainMenuCol: 'Laight',
    subMenuCol: 'ilaight6@wiley.com',
    pagesCol: 'ilaight6@wiley.com',
    mainTabCol: 'Male',
    subTabCol: 'reject',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 8,
    module: 'Adrianna',
    mainMenuCol: 'Ruddom',
    subMenuCol: 'aruddom7@seattletimes.com',
    pagesCol: 'aruddom7@seattletimes.com',
    mainTabCol: 'Male',
    subTabCol: 'reject',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 9,
    module: 'Dionysus',
    mainMenuCol: 'McCory',
    subMenuCol: 'dmccory8@ox.ac.uk',
    pagesCol: 'dmccory8@ox.ac.uk',
    mainTabCol: 'Male',
    subTabCol: 'Open',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
  {
    id: 10,
    module: 'Claybourne',
    mainMenuCol: 'Shellard',
    subMenuCol: 'cshellard9@rediff.com',
    pagesCol: 'cshellard9@rediff.com',
    mainTabCol: 'Male',
    subTabCol: 'approved',
    sectionCol: 'approved',
    subSectionCol: 'approved',
    fieldNameCol: 'approved',
    viewCol: true,
    editCol: true,
  },
];

@Component({
  selector: 'app-user-permission-details',
  templateUrl: './user-permission-details.component.html',
  styleUrls: ['./user-permission-details.component.scss']
})
export class UserPermissionDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = true;
  displayedColumns: string[] = ['module', 'mainMenuCol', 'subMenuCol', 'pagesCol', 'mainTabCol', 'subTabCol', 'sectionCol', 'subSectionCol', 'fieldNameCol', 'viewCol', 'editCol',];

  dataSource = new MatTableDataSource<UserRole>(userRoleData);

  roleForm = this.fb.group({
    roleName: ['', Validators.required],
    description: ['', Validators.required],
    roleStatus: [false],
    roleType: [false],
  });

  visibilityForm = this.fb.group({
  });

  formPermission = this.fb.group({
    selectedMainMenu: ['', Validators.required],
    selectedSubMenu: ['', Validators.required],
    selectedPages: ['', Validators.required],
    selectedMainTabs: [''],
    selectedSubTabs: [''],
    selectedSection: [''],
    selectedSubSection: [''],
  });

  mainTabs: Observable<MainTabs[]>;

  subTabs: Observable<SubTabs[]>;

  mainMenu = [
    { label: 'SR Form', value: false, ctrlName: 'srForm' },
    { label: 'Dash Board', value: false, ctrlName: 'dashBoard' },
    { label: 'Items', value: false, ctrlName: 'items' },
    { label: 'Help', value: false, ctrlName: 'help' },
    { label: 'Contact', value: false, ctrlName: 'contact' },
  ];

  subMenu = [
    {
      label: 'SR Form', value: false, ctrlName: 'srForm',
      level1: [
        { label: 'Dash Board2', value: false, ctrlName: 'dashBoard2' },
        { label: 'Items2', value: false, ctrlName: 'items2' },
        { label: 'Help2', value: false, ctrlName: 'help2' },
        { label: 'Contact2', value: false, ctrlName: 'contact2' }
      ],
    },
    {
      label: 'Dash Board', value: false, ctrlName: 'dashBoard',
      level1: [
        { label: 'Dash Board', value: false, ctrlName: 'dashBoard2' },
        { label: 'Items', value: false, ctrlName: 'items2' },
        { label: 'Help', value: false, ctrlName: 'help2' },
      ],
    },
    {
      label: 'Items', value: false, ctrlName: 'items',
      level1: [
        { label: 'Dash Board', value: false, ctrlName: 'dashBoard2' },
        { label: 'Items', value: false, ctrlName: 'items2' },
        { label: 'Help', value: false, ctrlName: 'help2' },
        { label: 'Contact', value: false, ctrlName: 'contact2' },
      ],
    },
  ];

  pages = [
    {
      label: 'dashBoard 2', value: false, ctrlName: 'dashBoard2',
      level1: [
        { label: 'Dash Board3', value: false, ctrlName: 'dashBoard3' },
        { label: 'Items3', value: false, ctrlName: 'items3' },
        { label: 'Help3', value: false, ctrlName: 'help3' },
        { label: 'Contact3', value: false, ctrlName: 'contact3' }
      ],
    },
    {
      label: 'Items 2', value: false, ctrlName: 'items2',
      level1: [
        { label: 'Dash Board3', value: false, ctrlName: 'dashBoard3' },
        { label: 'Items3', value: false, ctrlName: 'items3' },
        { label: 'Help3', value: false, ctrlName: 'help3' },
        { label: 'Contact3', value: false, ctrlName: 'contact3' }
      ],
    },
    {
      label: 'help 2', value: false, ctrlName: 'help2',
      level1: [
        { label: 'Dash Board3', value: false, ctrlName: 'dashBoard3' },
        { label: 'Items3', value: false, ctrlName: 'items3' },
        { label: 'Help3', value: false, ctrlName: 'help3' },
        { label: 'Contact3', value: false, ctrlName: 'contact3' }
      ],
    },
  ];

  mainTabVisibilityTabs = [
    {
      label: 'dashBoard 3', value: false, ctrlName: 'dashBoard3',
      level1: [
        { label: 'Dash Board4', value: false, ctrlName: 'dashBoard4' },
        { label: 'Items4', value: false, ctrlName: 'items4' },
        { label: 'Help4', value: false, ctrlName: 'help4' },
        { label: 'Contact4', value: false, ctrlName: 'contact4' }
      ],
    },
    {
      label: 'items 3', value: false, ctrlName: 'items3',
      level1: [
        { label: 'Dash Board4', value: false, ctrlName: 'dashBoard4' },
        { label: 'Items4', value: false, ctrlName: 'items4' },
        { label: 'Help4', value: false, ctrlName: 'help4' },
        { label: 'Contact4', value: false, ctrlName: 'contact4' }
      ],
    },
    {
      label: 'Help 3', value: false, ctrlName: 'help3',
      level1: [
        { label: 'Dash Board4', value: false, ctrlName: 'dashBoard4' },
        { label: 'Items4', value: false, ctrlName: 'items4' },
        { label: 'Help4', value: false, ctrlName: 'help4' },
        { label: 'Contact4', value: false, ctrlName: 'contact4' }
      ],
    },
  ];

  subTabVisibilityTabs = [
    {
      label: 'dashBoard 4', value: false, ctrlName: 'dashBoard4',
      level1: [
        { label: 'Dash Board5', value: false, ctrlName: 'dashBoard5' },
        { label: 'Items 5', value: false, ctrlName: 'items5' },
        { label: 'Help 5', value: false, ctrlName: 'help5' },
        { label: 'Contact 5', value: false, ctrlName: 'contact5' }
      ],
    },
    {
      label: 'items 4', value: false, ctrlName: 'items4',
      level1: [
        { label: 'Dash Board5', value: false, ctrlName: 'dashBoard5' },
        { label: 'Items 5', value: false, ctrlName: 'items5' },
        { label: 'Help 5', value: false, ctrlName: 'help5' },
        { label: 'Contact 5', value: false, ctrlName: 'contact5' }
      ],
    },
    {
      label: 'Items 4', value: false, ctrlName: 'help4',
      level1: [
        { label: 'Dash Board5', value: false, ctrlName: 'dashBoard5' },
        { label: 'Items 5', value: false, ctrlName: 'items5' },
        { label: 'Help 5', value: false, ctrlName: 'help5' },
        { label: 'Contact 5', value: false, ctrlName: 'contact5' }
      ],
    },
  ];

  sectionVisibility = [
    {
      label: 'dashBoard 5', value: false, ctrlName: 'dashBoard5',
      level1: [
        { label: 'Dash Board6', value: false, ctrlName: 'dashBoard6' },
        { label: 'Items 6', value: false, ctrlName: 'items6' },
        { label: 'Help 6', value: false, ctrlName: 'help6' },
        { label: 'Contact 6', value: false, ctrlName: 'contact6' }
      ],
    },
    {
      label: 'items 5', value: false, ctrlName: 'items5',
      level1: [
        { label: 'Dash Board6', value: false, ctrlName: 'dashBoard6' },
        { label: 'Items 6', value: false, ctrlName: 'items6' },
        { label: 'Help 6', value: false, ctrlName: 'help6' },
        { label: 'Contact 6', value: false, ctrlName: 'contact6' }
      ],
    },
    {
      label: 'Items 5', value: false, ctrlName: 'help5',
      level1: [
        { label: 'Dash Board6', value: false, ctrlName: 'dashBoard6' },
        { label: 'Items 6', value: false, ctrlName: 'items6' },
        { label: 'Help 6', value: false, ctrlName: 'help6' },
        { label: 'Contact 6', value: false, ctrlName: 'contact6' }
      ],
    },
  ];

  subSectionVisibility = [
    {
      label: 'dashBoard 6', value: false, ctrlName: 'dashBoard6',
      level1: [
        { label: 'Dash Board7', value: false, ctrlName: 'dashBoard7' },
        { label: 'Items 7', value: false, ctrlName: 'items7' },
        { label: 'Help 7', value: false, ctrlName: 'help7' },
        { label: 'Contact 7', value: false, ctrlName: 'contact7' }
      ],
    },
    {
      label: 'items 6', value: false, ctrlName: 'items6',
      level1: [
        { label: 'Dash Board7', value: false, ctrlName: 'dashBoard7' },
        { label: 'Items 7', value: false, ctrlName: 'items7' },
        { label: 'Help 7', value: false, ctrlName: 'help7' },
        { label: 'Contact 7', value: false, ctrlName: 'contact7' }
      ],
    },
    {
      label: 'Items 6', value: false, ctrlName: 'help6',
      level1: [
        { label: 'Dash Board7', value: false, ctrlName: 'dashBoard7' },
        { label: 'Items 7', value: false, ctrlName: 'items7' },
        { label: 'Help 7', value: false, ctrlName: 'help7' },
        { label: 'Contact 7', value: false, ctrlName: 'contact7' }
      ],
    },
  ];

  mainMenuPermission: MainMenuPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  subMenuPermission: SubMenuPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  pagesPermission: PagesPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  mainTabsPermission: MainTabsPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  subTabsPermission: SubTabsPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  sectionPermission: SectionPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];
  subSectionPermission: SubSectionPermission[] = [
    { value: 'supplierRegistrationForm', viewValue: 'Supplier Registration Form' },
  ];

  task: any;
  submenuCtrl = new Array();
  pagesCtrl = new Array();
  mainTabsCtrl = new Array();
  subTabsCtrl = new Array();
  sectionCtrl = new Array();
  subSectionCtrl = new Array();
  subSectionContentCtrl = new Array();
  displayForm: boolean = false;
  hideSubMenu: boolean = true;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

    this.task = this.route.snapshot.params['task'];
    this.addMainMenuControllers();
    this.formDisable();

    this.mainTabs = new Observable((observer: Observer<MainTabs[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'SRM Module' },
          { label: 'ET Module' },
          { label: 'B2B Module' },
        ]);
      }, 1000);
    });

    this.subTabs = new Observable((observer: Observer<SubTabs[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'Visibility' },
          { label: 'Permissions' },
        ]);
      }, 1000);
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addMainMenuControllers(): void {
    const result = this.mainMenu.map(a => a.ctrlName);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      console.log(element);
      this.visibilityForm.addControl(element, this.fb.control(false));

      console.log(this.visibilityForm.controls);
    }
  }

  visibilitySelect(e, $event, name, i): void {

    if ($event.checked && name !== 'mainMenu') {
      this.visibilityForm.contains(e) ? this.visibilityForm.setControl(e, this.fb.control($event.checked)) : this.visibilityForm.addControl(e, this.fb.control($event.checked));
    } else {
      this.visibilityForm.removeControl(e);
    }

    if (name === 'mainMenu') {
      $event.checked ? this.submenuCtrl.splice(i, 1, e) : this.submenuCtrl.splice(i, 1, '');
      this.visibilityForm.setControl(e, this.fb.control($event.checked));

    } else if (name === 'subMenu') {
      $event.checked ? this.pagesCtrl.splice(i, 1, e) : this.pagesCtrl.splice(i, 1, '');
      const result = this.pages[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    } else if (name === 'pages') {
      $event.checked ? this.mainTabsCtrl.splice(i, 1, e) : this.mainTabsCtrl.splice(i, 1, '');
      const result = this.mainTabVisibilityTabs[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    } else if (name === 'mainTabs') {
      $event.checked ? this.subTabsCtrl.splice(i, 1, e) : this.subTabsCtrl.splice(i, 1, '');
      const result = this.subTabVisibilityTabs[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    } else if (name === 'subTabs') {
      $event.checked ? this.sectionCtrl.splice(i, 1, e) : this.sectionCtrl.splice(i, 1, '');
      const result = this.subSectionVisibility[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    } else if (name === 'section') {
      $event.checked ? this.subSectionCtrl.splice(i, 1, e) : this.subSectionCtrl.splice(i, 1, '');
      const result = this.pages[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    } else if (name === 'subSection') {
      $event.checked ? this.subSectionContentCtrl.splice(i, 1, e) : this.subSectionContentCtrl.splice(i, 1, '');
      const result = this.pages[i].level1.map(a => a.ctrlName);

      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);
        this.visibilityForm.addControl(element, this.fb.control(false));

        console.log(this.visibilityForm.controls);
      }
    }
  }

  updateProfile(): void {
    let data;
    this.roleForm.patchValue({
      module: data.module,
      description: data.description,
      roleStatus: data.roleStatus,
      roleType: data.roleType,
    });
  }

  //view permission
  getRowInfo(row): void {
    const data = row;
    console.log('goto: ', data);
  }

  formDisable(): void {
    if (this.task === 'view') {
      this.formPermission.disable();
      this.visibilityForm.disable();
      this.roleForm.disable();
      this.displayForm = true;
    } else if (this.task === 'editPermission') {
      this.formPermission.enable();
      this.visibilityForm.enable();
      this.roleForm.enable();
      this.displayForm = true;
    } else if (this.task === 'copyPermission') {
      this.formPermission.disable();
      this.visibilityForm.disable();
      this.roleForm.enable();
      this.displayForm = true;
    } else if (this.task === 'new') {
      this.formPermission.enable();
      this.visibilityForm.enable();
      //this.roleForm.enable();
      this.displayForm = false;

      console.log(this.roleForm.controls);
    }
  }

  onSubmit(): void {
    // TODO: Use EventEmitter with form value
    console.log(this.roleForm.value);
    this.displayForm = true;
  }

  onCheckFormSubmit(): void {
    console.log(this.visibilityForm.value);
  }
  onFormPermissionSubmit(): void {
    console.log(this.formPermission.value);
  }
}
