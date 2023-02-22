import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { RFQLinePaymentScheduleViewModel } from 'app/main/Models/etendering/ViewModels/rfq-line-payment-schedule-view-model';
import { RfqPartLinePSService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-ps.service';

@Component({
  selector: 'add-new-line-paymentschedules-overlay',
  templateUrl: './add-new-line-paymentschedules-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddNewLinePaymentschedulesOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  private _fuseAlertService: FuseAlertService;
  templateData: any = [];
  useremail: string = '';
  dataId: any = "";
  rfqId: any;
  type: any;
  rfqPartLineId: any;
  isDelete: boolean;
  attributeCategorys: any[];
  attributeCategoryId: string;
  frmLinePaymentSchedule: FormGroup;
  linePaymentSchedule: RFQLinePaymentScheduleViewModel;
  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  addTeam = new FormGroup({
    teamName: new FormControl('Team Name One'),
    teamDescription: new FormControl('Team Description One'),
  });
  Message: string;
  buttontext: string;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  payScheduleNos: string[];
  isSaved: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddNewLinePaymentschedulesOverlayComponent>,
    public dialog: MatDialog,
    private rfqPartLinePSService: RfqPartLinePSService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dataId = data.id;
    this.rfqPartLineId = data.rfqPartLineId;
    this.rfqId = data.rfqId;
    this.type = data.type;
    this.payScheduleNos = data.payScheduleNos;
    this.frmLinePaymentSchedule = this.fb.group({
      'description': [null],
      'payScheduleNo': [null, Validators.required],
      'scheduleLineType': [null, Validators.required],
      'downPaymentType': [null, Validators.required],
      'work': [null, Validators.required],
      'milestone': [null, Validators.required],
      'payment': [null, Validators.required],
      'retention': [null, Validators.required],
      'release': [null, Validators.required],
      'releaseValue': [null, Validators.required],
      'valueVisibilityToSuppliers': [false],
      'attributeCategoryId': [null]
    })
  }

  doAction() {
    this.dialogRef.close({ data: "cancel" });
  }

  ngOnInit() {
    this.rfqPartLinePSService.GetPartPaymentScheduleByID(this.dataId).subscribe(result => {//your service call here       
      this.isDelete = true;

      this.linePaymentSchedule = result.data;
      this.attributeCategorys = result.data.attributeCategorys;
      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.buttontext = "Add";
      }
      else {
        this.buttontext = "Update";
        this.frmLinePaymentSchedule.patchValue(this.linePaymentSchedule);
      }
    });
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    let rfqHeaderPaymentScheduleViewModel: RFQLinePaymentScheduleViewModel = new RFQLinePaymentScheduleViewModel();
    rfqHeaderPaymentScheduleViewModel = Object.assign(rfqHeaderPaymentScheduleViewModel, form);
    rfqHeaderPaymentScheduleViewModel.payScheduleNo = rfqHeaderPaymentScheduleViewModel.payScheduleNo.trim();
    if (this.payScheduleNos.includes(rfqHeaderPaymentScheduleViewModel.payScheduleNo)) {
      this.frmLinePaymentSchedule.get('payScheduleNo').setErrors({ duplicateScheduleNo: true });
      return;
    }
    rfqHeaderPaymentScheduleViewModel.rFQId = this.rfqId;
    rfqHeaderPaymentScheduleViewModel.rFQPartLineId = this.rfqPartLineId;
    rfqHeaderPaymentScheduleViewModel.isDescriptionSave = true;
    rfqHeaderPaymentScheduleViewModel.id = this.dataId;
    rfqHeaderPaymentScheduleViewModel.attributeCategoryId = '00000001-0000-0000-0000-000000000000';    
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      rfqHeaderPaymentScheduleViewModel.dueDate = this.linePaymentSchedule.dueDate;
    }
    this.rfqPartLinePSService.SavePartPaymentSchedule(rfqHeaderPaymentScheduleViewModel).subscribe(
      result => {
        this.isSaved = false;
        console.log(result);
        this.dialogRef.close({ data: "Success" });
      }
    )
  }

  onPayScheduleNoChange() {
    if (this.payScheduleNos.includes(this.frmLinePaymentSchedule.get('payScheduleNo').value)) {
      this.frmLinePaymentSchedule.get('payScheduleNo').setErrors({ duplicateScheduleNo: true });
      this.isSaved = true;
    }
    else {
      this.isSaved = false;
    }
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

}