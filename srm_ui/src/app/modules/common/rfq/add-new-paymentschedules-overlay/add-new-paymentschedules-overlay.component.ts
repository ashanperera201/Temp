import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { RFQHeaderPaymentScheduleViewModel } from 'app/main/Models/etendering/ViewModels/rfq-headerpaymentschedule-view-model';
import { RfqHeaderPSService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-ps.service';

@Component({
  selector: 'add-new-paymentschedules-overlay',
  templateUrl: './add-new-paymentschedules-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddNewPaymentschedulesOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  private _fuseAlertService: FuseAlertService;
  templateData: any = [];
  useremail: string = '';
  dataId: any = "";
  rfqId: any;
  type: any;
  isDelete: boolean;
  attributeCategorys: any[];
  attributeCategoryId: string;
  frmHeaderPaymentSchedule: FormGroup;
  headerPaymentSchedule: RFQHeaderPaymentScheduleViewModel;
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
  payScheduleNos: string[];
  isSaved: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddNewPaymentschedulesOverlayComponent>,
    public dialog: MatDialog,
    private rfqHeaderPSService: RfqHeaderPSService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dataId = data.id;
    this.rfqId = data.rfqId;
    this.type = data.type;
    this.payScheduleNos = data.payScheduleNos;
    this.frmHeaderPaymentSchedule = this.fb.group({
      'description': [null],
      'payScheduleNo': [null, Validators.required],
      'scheduleLineType': [null, Validators.required],
      'downPaymentType': [null, Validators.required],
      'workPercentage': [null, Validators.required],
      'milestone': [null, Validators.required],
      'paymentPercentage': [null, Validators.required],
      'retentionPercentage': [null, Validators.required],
      'releasePercentage': [null, Validators.required],
      'releaseValue': [null, Validators.required],
      'isVisibleToSupplier': [false],
      'attributeCategoryId': [null]
    })
  }

  doAction() {
    this.dialogRef.close({ data: "cancel" });
  }

  ngOnInit() {
    this.rfqHeaderPSService.GetPaymentScheduleByID(this.dataId).subscribe(result => {//your service call here
      this.isDelete = true;

      this.headerPaymentSchedule = result.data;
      this.attributeCategorys = result.data.attributeCategorys;

      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.buttontext = "Add";
      }
      else {
        this.buttontext = "Update";
        this.frmHeaderPaymentSchedule.patchValue(this.headerPaymentSchedule);
      }
    });
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    let rfqHeaderPaymentScheduleViewModel: RFQHeaderPaymentScheduleViewModel = new RFQHeaderPaymentScheduleViewModel();
    rfqHeaderPaymentScheduleViewModel = Object.assign(rfqHeaderPaymentScheduleViewModel, form);
    rfqHeaderPaymentScheduleViewModel.payScheduleNo = rfqHeaderPaymentScheduleViewModel.payScheduleNo.trim();
    if (this.payScheduleNos.includes(rfqHeaderPaymentScheduleViewModel.payScheduleNo)) {
      this.frmHeaderPaymentSchedule.get('payScheduleNo').setErrors({ duplicateScheduleNo: true });
      return;
    }
    rfqHeaderPaymentScheduleViewModel.id = this.dataId;
    rfqHeaderPaymentScheduleViewModel.rfqId = this.rfqId;
    rfqHeaderPaymentScheduleViewModel.isDescriptionSave = true;
    rfqHeaderPaymentScheduleViewModel.attributeCategoryId = '00000001-0000-0000-0000-000000000000';
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      rfqHeaderPaymentScheduleViewModel.dueDate = this.headerPaymentSchedule.dueDate;
    }
    this.rfqHeaderPSService.SavePaymentSchedule(rfqHeaderPaymentScheduleViewModel).subscribe(
      result => {
        this.isSaved = false;
        console.log(result);
        this.dialogRef.close({ data: "Success" });
      }
    )
  }

  onPayScheduleNoChange() {
    if (this.payScheduleNos.includes(this.frmHeaderPaymentSchedule.get('payScheduleNo').value)) {
      this.frmHeaderPaymentSchedule.get('payScheduleNo').setErrors({ duplicateScheduleNo: true });
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