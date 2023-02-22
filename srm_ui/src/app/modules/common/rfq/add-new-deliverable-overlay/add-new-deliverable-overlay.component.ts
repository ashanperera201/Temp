import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQHeaderDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-header-deliverable-view-model';
import { RfqHeaderDeliverablesService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-deliverables.service';
import { DeliverablesComponent } from 'app/modules/common/rfq/header-component/deliverables/deliverables.component';

@Component({
    selector: 'add-new-paymentschedules-overlay',
    templateUrl: './add-new-deliverable-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewDeliverableOverlayComponent {

    parentComponent: DeliverablesComponent;
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';
    dataId: any = "";
    lblHeading: string;
    buttontext: string;
    rfqId: any;

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    isEditable = false;
    iserror = false;
    validatePreviousMilestoneFormat = true;
    validateProgressFormat = true;
    validateStageProgressFormat = true;

    isDelete: boolean;
    frmHeaderDeliverable: FormGroup;
    attributeCatagories: any[];
    deliverableViewModel: RFQHeaderDeliverableModel[] = [];
    milstoneNos: string[];
    isSaved: boolean = false;

    constructor(public dialogRef: MatDialogRef<AddNewDeliverableOverlayComponent>,
        public dialog: MatDialog, private fb: FormBuilder, private rfqHeaderDeliverableService: RfqHeaderDeliverablesService, @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.parentComponent = data.DeliverablesComponent;
        this.dataId = data.id;
        this.rfqId = data.rfxId;
        this.milstoneNos = data.milstoneNos;
        this.isEditable = data.editable;
        if (this.isEditable) {
            this.lblHeading = "Edit";
            this.buttontext = "Update";
        } else {
            this.lblHeading = "Add New";
            this.buttontext = "Add";
        }
        this.frmHeaderDeliverable = this.fb.group({

            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'mileStoneNo': [null, Validators.required],
            'previousMilestoneNo': [null, Validators.required],
            'progressPercentage': [null, Validators.required],
            'stagePaymentPercentage': [null, Validators.required],
            'beginDate': [null, Validators.required],
            'attributeCategoryId': [null, Validators.required],
            'isVisibleToSuppliers': [false]
        });
    }

    ngOnInit() {
        let rfqHeaderDeliverable: RFQHeaderDeliverableModel = new RFQHeaderDeliverableModel();
        this.rfqHeaderDeliverableService.GetRFQHeaderDeliverablesById(this.dataId).subscribe(result => {
            this.isDelete = true;
            rfqHeaderDeliverable = result.data;
            rfqHeaderDeliverable.previousMilestoneNo = rfqHeaderDeliverable.previousMilestoneNo + "";
            rfqHeaderDeliverable.progressPercentage = rfqHeaderDeliverable.progressPercentage + "";
            rfqHeaderDeliverable.stagePaymentPercentage = rfqHeaderDeliverable.stagePaymentPercentage + "";

            this.attributeCatagories = result.data.attributeCatagories;
            if (rfqHeaderDeliverable.id != "00000000-0000-0000-0000-000000000000") {
                this.frmHeaderDeliverable.patchValue(rfqHeaderDeliverable);
            }
        });
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        let rfqHeaderDeliverables: RFQHeaderDeliverableModel = new RFQHeaderDeliverableModel();
        rfqHeaderDeliverables = Object.assign(rfqHeaderDeliverables, form);
        if (this.milstoneNos.includes(rfqHeaderDeliverables.mileStoneNo)) {
            this.frmHeaderDeliverable.get('mileStoneNo').setErrors({ duplicateMilestoneNo: true });
            return;
        }
        rfqHeaderDeliverables.rfxId = this.rfqId;
        rfqHeaderDeliverables.id = this.dataId;

        rfqHeaderDeliverables.beginDate = this.handleDOBChange(rfqHeaderDeliverables.beginDate)

        this.rfqHeaderDeliverableService.SaveRFQHDeliverable(rfqHeaderDeliverables).subscribe(result => {
            this.isSaved = false;
            if (this.isEditable) {
                this.dialogRef.close({ data: "updated" });
                this.parentComponent.fetchRFQHeaderDeliverableData(this.rfqId);
                this.parentComponent.Message = "Updated";
                this.parentComponent.show("successerror");
            } else {
                this.dialogRef.close({ data: "added" });
                this.parentComponent.fetchRFQHeaderDeliverableData(this.rfqId);
                this.parentComponent.Message = "Added";
                this.parentComponent.show("successerror");
            }
        });
    }

    handleDOBChange(dt) {
        var dd = dt.getDate();
        var mm = dt.getMonth() + 1;
        if (mm < 10) {
            mm = '0' + mm
        }
        var yyyy = dt.getFullYear();
        var hh = dt.getHours();
        if (hh < 10) {
            hh = '0' + hh
        }
        var min = dt.getMinutes();
        if (min < 10) {
            min = '0' + min
        }
        var ss = dt.getSeconds();
        if (ss < 10) {
            ss = '0' + ss
        }
        return yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss
    }

    keyPressNumbersWithDecimal1() {
        this.validatePreviousMilestoneFormat = true;
    }

    keyPressNumbersWithDecimal2() {
        this.validateProgressFormat = true;
    }

    keyPressNumbersWithDecimal3() {
        this.validateStageProgressFormat = true;
    }

    isDecimalValidater(value) {
        // Validating previousMilestone number
        if (!Number.isInteger(value.previousMilestoneNo) && !value.previousMilestoneNo.includes('.')) {
            var code, i, len;
            for (i = 0, len = value.previousMilestoneNo.length; i < len; i++) {
                code = value.previousMilestoneNo.charCodeAt(i);
                if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123) ||
                    (code == 46)) { // lower alpha (a-z)
                } else {
                    this.validatePreviousMilestoneFormat = false;
                }
            }

        } else {
            this.validatePreviousMilestoneFormat = false;
        }
        // Validating progress number
        if (!Number.isInteger(value.progressPercentage) && value.progressPercentage.includes('.')) {
            var code, i, len;
            for (i = 0, len = value.progressPercentage.length; i < len; i++) {
                code = value.progressPercentage.charCodeAt(i);
                if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123) ||
                    (code == 46)) { // lower alpha (a-z)

                } else {
                    this.validateProgressFormat = false;
                }
            }
        } else {
            this.validateProgressFormat = false;
        }
        // Validating stage progress number
        if (!Number.isInteger(value.stagePaymentPercentage) && value.stagePaymentPercentage.includes('.')) {
            var code, i, len;
            for (i = 0, len = value.stagePaymentPercentage.length; i < len; i++) {
                code = value.stagePaymentPercentage.charCodeAt(i);
                if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123) ||
                    (code == 46)) { // lower alpha (a-z)

                } else {
                    this.validateStageProgressFormat = false;
                }

            }
        } else {
            this.validateStageProgressFormat = false;
        }
    }

    doAction() {
        this.dialogRef.close({ data: "cancel" });
        // window.location.reload() ;
    }

    onMilestoneNoChange() {
        if (this.milstoneNos.includes(this.frmHeaderDeliverable.get('mileStoneNo').value)) {
            this.frmHeaderDeliverable.get('mileStoneNo').setErrors({ duplicateMilestoneNo: true });
            this.isSaved = true;
        }
        else {
            this.isSaved = false;
        }
    }
}