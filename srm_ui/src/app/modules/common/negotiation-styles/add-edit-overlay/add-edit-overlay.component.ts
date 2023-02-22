import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NegotiationStyleService } from 'app/shared/Services/etendering/negotiation-style.service';
import { NegotiationStyleSearchModel } from 'app/main/Models/etendering/negotiation-style-search-model';
import { NegotiationStyleViewModel } from 'app/main/Models/etendering/ViewModels/negotiation-style-view-model';
import { NegotiationStylesComponent } from '../negotiation-styles.component';
import Swal from 'sweetalert2';
import { NegotiationStyleDefaultModel } from 'app/main/Models/etendering/ViewModels/negotiation-style-default-model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-edit-overlay',
    templateUrl: './add-edit-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'group', 'visibility'];

    headerDataSource: any = [];
    lineDataSource: any = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    issuccess = false;
    iserror = false;
    isDelete = false;
    negotiationList: FormGroup;
    negotiationStyle: NegotiationStyleViewModel[];
    bidingStyles: any[];
    dataId: any = "";

    newEditText: string = "Add";
    newEditbuttonText: string = "Save";
    neweditText: string = "Negotiation Style Saved successfully";

    isButtonDisabled = true;
    negotiationStyleDefault: NegotiationStyleDefaultModel;

    context: NegotiationStylesComponent;
    isOverrideDefault = false;

    names: string;
    isSaved: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddEditOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private negotiationStyleService: NegotiationStyleService
    ) {
        this.negotiationList = this.fb.group({
            negotiationStyleModels: this.fb.array([])
        });
        this.dataId = this.data.id;
        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
            this.newEditText = "Edit";
            this.newEditbuttonText = "Update";
            this.neweditText = "Negotiation Style Updated successfully";
        }

        this.context = data.context;
        this.names = data.negotiationStyleModels.map(x => x.nsName.toLowerCase());
    }

    get negotiationStyleModels(): FormArray {
        return this.negotiationList.get("negotiationStyleModels") as FormArray
    }

    newNegotiationStyle(): FormGroup {
        return this.fb.group({
            'nsName': [null, Validators.required],
            'title': [null, Validators.required],
            'bidingStyleID': [null, Validators.required],
            'isTwoStageRFx': [null, Validators.required],
            'isRFQ': [null, Validators.required],
            'isRFI': [null, Validators.required],
            'isRFAQ': [null, Validators.required],
            'isAllowOverride': [null, Validators.required],
            'isPrivate': [null, Validators.required]
        })
    }

    isDuplicate = false;
    onNameInput(name: string, negotiationGroup) {
        if (this.names.includes(name.toLowerCase())) {
            negotiationGroup.get('nsName').setErrors({ duplicate: true });
            this.isDuplicate = true;
        }
        else {
            this.isDuplicate = false;
        }
    }

    addNegotiationStyle() {
        if (this.negotiationList.get('negotiationStyleModels').invalid) {
            this.negotiationList.get('negotiationStyleModels').markAllAsTouched();
            return;
        }
        this.negotiationStyleModels.push(this.newNegotiationStyle());
    }

    ngOnInit() {
        this.getNegotiationStyle();
        this.getDefault();
    }

    getNegotiationStyle() {
        this.negotiationStyleService.getNegotiationStyleById(this.dataId).subscribe(result => {
            if (result.data.bidingStyleID == "00000000-0000-0000-0000-000000000000") {
                result.data.bidingStyleID = null;
            }
            this.isDelete = true;
            this.negotiationStyle = [];
            this.negotiationStyle.push(result.data);
            this.bidingStyles = result.data.biddingStyleList;
            //remove closed & open bidding styles
            this.bidingStyles.splice(0,2);
            const linesFormArray = this.negotiationList.get("negotiationStyleModels") as FormArray;
            linesFormArray.push(this.newNegotiationStyle());
            this.negotiationList.patchValue({ "negotiationStyleModels": this.negotiationStyle });
            this.headerDataSource = result.data.headerNegotiationStyleAccess;
            this.lineDataSource = result.data.linesNegotiationStyleAccess;
            this.validateNegotiationStyleInput();
        });
    }

    SetIsChecked(row, event) {
        row.isChecked = event.checked;
        this.validateNegotiationStyleInput();
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        let negotiationStyleSearchModel: NegotiationStyleSearchModel = new NegotiationStyleSearchModel();
        negotiationStyleSearchModel = Object.assign(negotiationStyleSearchModel, form);
        negotiationStyleSearchModel.negotiationStyleModels[0].negotiationStyleAccessModels = [];

        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
            negotiationStyleSearchModel.negotiationStyleModels[0].id = this.negotiationStyle[0].id;
        }
        for (var k = 0; k < this.headerDataSource.length; k++) {
            if (this.headerDataSource[k].isChecked == true) {
                negotiationStyleSearchModel.negotiationStyleModels[0].negotiationStyleAccessModels.push({ "sectionAccessId": this.headerDataSource[k].id });
            }
        }
        for (var k = 0; k < this.lineDataSource.length; k++) {
            if (this.lineDataSource[k].isChecked == true) {
                negotiationStyleSearchModel.negotiationStyleModels[0].negotiationStyleAccessModels.push({ "sectionAccessId": this.lineDataSource[k].id });
            }
        }

        this.negotiationStyleService.createEditNegotiationStyle(negotiationStyleSearchModel.negotiationStyleModels).subscribe(result => {

            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: this.neweditText,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            negotiationStyleSearchModel.negotiationStyleModels = result;
            this.isSaved = false;
            this.dialogRef.close();
        });
    }

    cancel() {
        this.dialogRef.close();
    }

    validateNegotiationStyleInput() {
        if (this.validateSingleSource(this.headerDataSource) || this.validateSingleSource(this.lineDataSource)) {
            this.isButtonDisabled = false;
        }
    }

    validateSingleSource(dataSource) {
        if (dataSource.length > 0) {
            for (var k = 0; k < dataSource.length; k++) {
                let element = dataSource[k];
                if (element.isChecked) {
                    return true;
                }
            }
        }
        return false;
    }

    getDefault() {
        this.negotiationStyleService.getDefault().subscribe(result => {
            this.negotiationStyleDefault = result.data;
        });
    }

    getOverrideDefault(event: MatCheckboxChange) {
        this.isOverrideDefault = event.checked;
    }
}