import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';

@Component({
  selector: 'visibility-config',
  templateUrl: './visibility-config.component.html',
  styleUrls: ['./visibility-config.component.scss']
})
export class VisibilityConfigComponent implements OnInit, OnDestroy {

  @Input() subCategory: any;
  @Input() moduleCode: string;
  @Output() onPermissionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSave: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  permissionChange = (permission: any, categoryCode: any) => {
    this.onPermissionChange.emit({ selectedPermission: permission, moduleCode: this.moduleCode, categoryCode: categoryCode });
  }

  savePermissionConfig = () => {
    this.onSave.emit(true);
  }

  ngOnDestroy(): void {
  }
}
