import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQPartLineDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-deliverable-view-model';
import { RfqPartLineDeliverableService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-deliverable.service';
import { RfqDeliverablesComponent } from 'app/modules/common/rfq/Lines/rfq-part-line/rfq-deliverables/rfq-deliverables.component';

@Component({
    selector: 'add-new-paymentschedules-overlay',
    templateUrl: './add-new-line-deliverable-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewLineDeliverableOverlayComponent {

    parentComponent: RfqDeliverablesComponent;
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';
    dataId: any = "";
    lblHeading: string;
    buttontext: string;
    rfqId: any;
    rfqPartLineId: any;

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    isEditable = false;
    iserror = false;
    validatePreviousMilestoneFormat = true;
    validateProgressFormat = true;
    validateStageProgressFormat = true;
    rfqPartLineDeliverable: RFQPartLineDeliverableModel;
    isDelete: boolean;
    frmPartLineDeliverable: FormGroup;
    attributeCatagories: any[];
    deliverableViewModel: RFQPartLineDeliverableModel[] = [];
    milstoneNos: string[];
    isSaved: boolean = false;

    constructor(public dialogRef: MatDialogRef<AddNewLineDeliverableOverlayComponent>,
        public dialog: MatDialog, private fb: FormBuilder, private rfqPartLineDeliverableService: RfqPartLineDeliverableService, @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.parentComponent = data.DeliverablesComponent;
        this.dataId = data.id;
        this.rfqId = this.data.rfqId;
        this.rfqPartLineId = this.data.rfqPartLineId;
        this.milstoneNos = data.milstoneNos;
        this.isEditable = this.data.editable;

        if (this.isEditable) {
            this.lblHeading = "Edit";
            this.buttontext = "Update";
        } else {
            this.lblHeading = "Add New";
            this.buttontext = "Add";
        }
        this.frmPartLineDeliverable = this.fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'mileStoneNo': [null, Validators.required],
            'previousMilestone': [null, Validators.required],
            'progressPercentage': [null, Validators.required],
            'stagePaymentPercentage': [null, Validators.required],
            'beginDate': [null, Validators.required],
            'attributeCategoryId': [null, Validators.required],
            'displayToSupplier': [false]
        });
    }

    ngOnInit() {
        this.rfqPartLineDeliverableService.GetPartLineDeliverableById(this.dataId).subscribe(result => {
            this.isDelete = true;
            this.rfqPartLineDeliverable = result.data;
            this.rfqPartLineDeliverable.previousMilestone = this.rfqPartLineDeliverable.previousMilestone + "";
            this.rfqPartLineDeliverable.progressPercentage = this.rfqPartLineDeliverable.progressPercentage + "";
            this.rfqPartLineDeliverable.stagePaymentPercentage = this.rfqPartLineDeliverable.stagePaymentPercentage + "";

            this.attributeCatagories = result.data.attributeCatagories;
            if (this.rfqPartLineDeliverable.id != "00000000-0000-0000-0000-000000000000") {
                this.frmPartLineDeliverable.patchValue(this.rfqPartLineDeliverable);
            }
        });
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        let rfqPartLineDeliverables: RFQPartLineDeliverableModel = new RFQPartLineDeliverableModel();
        rfqPartLineDeliverables = Object.assign(rfqPartLineDeliverables, form);
        if (this.milstoneNos.includes(rfqPartLineDeliverables.mileStoneNo)) {
            this.frmPartLineDeliverable.get('mileStoneNo').setErrors({ duplicateMilestoneNo: true });
            return;
        }
        rfqPartLineDeliverables.rfxId = this.rfqId;
        rfqPartLineDeliverables.rfxPartLineId = this.rfqPartLineId;
        rfqPartLineDeliverables.id = this.dataId;
        rfqPartLineDeliverables.beginDate = this.handleDOBChange(rfqPartLineDeliverables.beginDate)
        this.rfqPartLineDeliverableService.SaveRFQPDeliverable(rfqPartLineDeliverables).subscribe(result => {
            this.isSaved = false;
            if (this.isEditable) {
                this.dialogRef.close({ data: "updated" });
                this.parentComponent.fetchRFQPartLineDeliverableData(this.rfqId);
                this.parentComponent.Message = "Updated";
                this.parentComponent.show("successerror");
            } else {
                this.dialogRef.close({ data: "added" });
                this.parentComponent.fetchRFQPartLineDeliverableData(this.rfqId);
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
        if (this.milstoneNos.includes(this.frmPartLineDeliverable.get('mileStoneNo').value)) {
            this.frmPartLineDeliverable.get('mileStoneNo').setErrors({ duplicateMilestoneNo: true });
            this.isSaved = true;
        }
        else {
            this.isSaved = false;
        }
    }

}