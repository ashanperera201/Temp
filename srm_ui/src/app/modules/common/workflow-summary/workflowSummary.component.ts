import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../../api.service';
import config from '../../../../auth_management_api_config.json';
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
import { SupplierHistory } from 'app/shared/Models/SupplierHistory';

// import Swal from 'sweetalert2';

export interface DialogData {
  actionItemsVisible: any;
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface CriticalityScore {
  position: number;
  criticalityScore: any;
}

export interface SelectedCritics {
  position: number;
  scope: string;
  check: boolean;
  personalDetail: any;
}

const ELEMENT_DATA_SELECTEDCRITICS: SelectedCritics[] = [];
const ELEMENT_DATA_CRITICALITYSCORE: CriticalityScore[] = [];

@Component({
  selector: 'workflowSummary',
  templateUrl: '../workflow-summary/workflowSummary.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WorkflowSummaryComponent {
  @Input() supplierId: string;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  suppliername: string = '';
  classification: string = '';
  srmrecommendation: string = '';
  srmrecommendationremark: string = '';
  hseqrecommendation: string = '';
  hseqrecommendationremark: string = '';
  srmremarkreject: string = '';
  gmremark: string = '';
  vpremark: string = '';

  /**
   * Constructor
   */
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getHistory();
    this.getSupplierData();
  }

  getHistory() {
    var supplieridstring = this.supplierId.toString();
    this.http.get(environment.nodeurl + '/api/workflow/history?suplierId=' + supplieridstring)
      .subscribe(datahis => {
        var history: any = [];
        history = datahis;

        history.forEach((element, index) => {
          if (history[index + 1].status_remark == 'Awaiting for VP approval' && element.iscurrentstatus == 'Completed' && element.status_remark == 'Awaiting for SRM Recommendation') {
            this.srmremarkreject = this.srmremarkreject!=""?this.srmremarkreject:element.status_comment;
          }
          else if (history[index + 1].status_remark == 'Awaiting for GM approval' && element.iscurrentstatus == 'Completed' && element.status_remark == 'Awaiting for SRM Recommendation') {
            this.srmremarkreject = this.srmremarkreject != "" ? this.srmremarkreject : element.status_comment;
          }
          else if (element.status_remark == 'Awaiting for SRM Recommendation') {
            this.srmrecommendation = this.srmrecommendation != "" ? this.srmrecommendation : element.çommandName;
            this.srmrecommendationremark = this.srmrecommendationremark != "" ? this.srmrecommendationremark : element.status_comment;
          } else if (element.status_remark == 'Awaiting for HSEQ Recommendation' || element.status_remark == 'Awaiting for HSEQ Desktop Audit') {
            this.hseqrecommendation = this.hseqrecommendation != "" ? this.hseqrecommendation : element.çommandName;
            this.hseqrecommendationremark = this.hseqrecommendationremark != "" ? this.hseqrecommendationremark : element.status_comment;
          } else if (element.status_remark == 'Awaiting for GM approval') {
            this.gmremark = this.gmremark != "" ? this.gmremark : element.status_comment;
          } else if (element.status_remark == 'Awaiting for VP approval') {
            this.vpremark = this.vpremark != "" ? this.vpremark : element.status_comment;
          }
        });
      });
  }

  getSupplierData() {
    this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId)
      .subscribe(data => {

        this.suppliername = data[0].supplier_name;

        var criticalityScore = data[0].criticality;
        if (criticalityScore > 0) {

          if (criticalityScore >= 7) {
            this.classification = 'High Critical'
          }

          if (criticalityScore == 5) {
            this.classification = 'Critical'
          }

          if (criticalityScore == 6) {
            this.classification = 'Critical'
          }

          if (criticalityScore < 5) {
            this.classification = 'Non Critical'
          }
        } else {
          this.classification = 'Not performed'
        }
      });
  }
}
