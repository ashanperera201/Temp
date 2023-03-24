import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'permissions-config',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() subCategory: any;
  @Input() moduleCode: string;

  @Output() onSave: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onEditChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedPermissions: string[] = [];

  displayedColumns: string[] = ['level', 'formName', 'fieldName', 'viewCol', 'editCol'];
  dataSource = new MatTableDataSource<any>();
  tempFieldSet: any[] = [];
  permissionPayload: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  saveConfig = () => {
    this.onSave.emit(true);
  }

  onPermissionChange = (event: any) => {
    this.selectedPermissions = [...event?.value];
    this.renderGrid();
  }

  renderGrid = () => {
    this.dataSource.data = [];
    const formItems = this.subCategory?.fieldLevels.flatMap(x => x.formItems);

    if (formItems && formItems.length > 0) {
      for (let i = 0; i < formItems.length; i++) {
        let form: any = {};
        const isPermissionIncluded: boolean = this.selectedPermissions.some(x => x === formItems[i].formCode);
        if (isPermissionIncluded) {
          for (let c = 0; c < formItems[i]?.fields.length; c++) {
            form.level = formItems[i]?.level;
            form.levelCode = formItems[i]?.levelCode;
            form.formName = formItems[i]?.formName;
            form.formCode = formItems[i]?.formCode;
            form.viewFieldCode = formItems[i]?.fields[c]?.viewFieldCode;
            form.editFieldCode = formItems[i]?.fields[c]?.editFieldCode;
            form.view = formItems[i]?.fields[c]?.view;
            form.edit = formItems[i]?.fields[c]?.edit;
            form.fieldName = formItems[i]?.fields[c]?.fieldName;
            this.tempFieldSet.push({ ...form });
            form = {};
          }
          this.dataSource.data = this.dataSource.data.concat(this.tempFieldSet);
        } else {
          this.dataSource.data = this.dataSource.data.concat(this.tempFieldSet.filter(x => x.formCode !== formItems[i].formCode));
        }
      }
    }
  }



  onEditCheckboxChange = (permissionRef: any) => {
    this.onEditChange.emit({ permissionRef: permissionRef, moduleCode: this.moduleCode, subCategory: this.subCategory });
  }

  onViewCheckboxChange = (permissionRef: any) => {
    this.onViewChange.emit({ permissionRef: permissionRef, moduleCode: this.moduleCode, subCategory: this.subCategory });
  }

  ngOnDestroy(): void {
  }
}
