import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../../../api.service';
import config from '../../../../../src/auth_management_api_config.json';
import { Optional, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'environments/environment.prod';
import { truncate } from 'lodash';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { Router } from '@angular/router';
import { HSEQupdate } from 'app/main/Models/HSEQupdate';
import { SupplierWorkflow } from 'app/main/Models/SupplierWorkflow';
import { SupplierHistory } from 'app/main/Models/SupplierHistory';
import { Template, UserTemplate } from 'app/main/Models/Template';

@Component({
  selector: 'tags-overlay',
  templateUrl: '../tags-overlay/tags-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TagsOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  templateData: any = [];
  useremail: string = '';

  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;

  constructor(public dialogRef: MatDialogRef<TagsOverlayComponent>,
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    this.useremail = localStorage.getItem("useremail");
    this.getTemplate();
  }

  addTemplate(item, event) {

    if (!event.checked) {
      this.selectedId.push(item.templateId);
    } else {
      this.selectedId = this.selectedId.filter(a => a !== item.templateId);
    }
  }

  doAction() {
    this.dialogRef.close();
    window.location.reload() ;

  }

  saveTemplate() {
    if (this.selectedId.length > 0) {

      var templatedto = new UserTemplate();
      templatedto.email = this.useremail;
      templatedto.templateIds = this.selectedId;

      this.http.post<any>(environment.nodeurl + '/api/template/SaveUserTemplate', templatedto).subscribe(data2 => {
        if (data2) {
          this.issuccess = true;
        } else {
          this.iserror = true;
        }

      });
    }
  }

  getTemplate() {

    if (this.useremail != '') {
      this.http.get<any>(environment.nodeurl + '/api/template/userRemainTemplates?email=' + this.useremail).subscribe(data => {
        this.templateData = data;
      });
    }
  }
}