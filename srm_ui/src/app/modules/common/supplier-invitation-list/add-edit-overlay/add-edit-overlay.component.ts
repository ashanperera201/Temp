import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { SupplierInvitationListService } from 'app/shared/Services/etendering/supplier-invitation-list.service';
import { SupplierGroupViewModel } from 'app/main/Models/etendering/ViewModels/supplier-group-view-model';

@Component({
  selector: 'att-list-add-edit-overlay',
  templateUrl: './add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddEditOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  templateData: any = [];
  useremail: string = '';

  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  frmSupplierGroup: FormGroup;
  isDelete = false;
  dataId: any = "";
  supplierGroupViewModel: SupplierGroupViewModel[];
  names: string[];
  editTitle: string = '';
  OverlayText: string = "Add New ";
  isAddNew = true;
  isSaved: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog, private fb: FormBuilder, private supplierInvitationListService: SupplierInvitationListService
  ) {
    this.frmSupplierGroup = this.fb.group({
      'title': [null, Validators.required],
      'name': [null, Validators.required],
      'isPrivate': [null, Validators.required],
      'isActive': [null, Validators.required]
    })
    this.frmSupplierGroup = this.fb.group({
      supplierGroupViewModels: this.fb.array([])
    });
    this.dataId = data.id;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.OverlayText = "Edit ";
      this.isAddNew = false;
    }
    this.names = data.supplierGroupModels.map(x => x.title.toLowerCase().trim());
  }

  get supplierGroupViewModels(): FormArray {
    return this.frmSupplierGroup.get("supplierGroupViewModels") as FormArray
  }

  newSupplierList(): FormGroup {
    return this.fb.group({
      'title': [null, Validators.required],
      'name': [null, Validators.required],
      'isPrivate': [null, Validators.required],
      'isActive': [null, Validators.required]
    })
  }

  addSupplierList() {
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
      if (this.frmSupplierGroup.get('supplierGroupViewModels').invalid) {
        this.frmSupplierGroup.get('supplierGroupViewModels').markAllAsTouched();
        // return;
      }
      this.supplierGroupViewModels.push(this.newSupplierList());
    }
  }

  ngOnInit() {
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
      this.addSupplierList();
    }
    else {
      this.supplierInvitationListService.GetSupplierGroupByID(this.dataId).subscribe(result => {
        this.isDelete = true;
        this.supplierGroupViewModel = [];
        this.supplierGroupViewModel.push(result.data);
        this.editTitle = result.data.title;
        const linesFormArray = this.frmSupplierGroup.get("supplierGroupViewModels") as FormArray;
        linesFormArray.push(this.newSupplierList());
        this.frmSupplierGroup.patchValue({ "supplierGroupViewModels": this.supplierGroupViewModel });
      });

    }
  }

  onNameInput(name: string, supplierGroupForm) {
    if (!this.isAddNew && name != this.editTitle) {
      if (this.names.includes(name.toLowerCase().trim())) {
        supplierGroupForm.get('title').setErrors({ duplicate: true });
      }
    }
    else if (this.isAddNew) {
      if (this.names.includes(name.toLowerCase().trim())) {
        supplierGroupForm.get('title').setErrors({ duplicate: true });
      }
      else {
        this.supplierGroupViewModels.controls.forEach(item => {
          if (item != supplierGroupForm && item.get('title').value == name) {
            supplierGroupForm.get('title').setErrors({ duplicate: true });
            return;
          }
        });
      }
      for (const control of this.supplierGroupViewModels.controls) {
        if (control != supplierGroupForm && control.get('title').hasError('duplicate')) {
          control.get('title').setErrors(null);
          this.supplierGroupViewModels.controls.forEach(item => {
            if (item != supplierGroupForm && item != control && item.get('title').value == control.get('title').value) {
              control.get('title').setErrors({ duplicate: true });
              return;
            }
          });
        }
      }
    }
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    if (this.frmSupplierGroup.get('supplierGroupViewModels').invalid) {
      this.frmSupplierGroup.get('supplierGroupViewModels').markAllAsTouched();
      return;
    }
    let supplierGroupSearchModel: SupplierGroupSearchModel = new SupplierGroupSearchModel();
    supplierGroupSearchModel = Object.assign(supplierGroupSearchModel, form);
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      supplierGroupSearchModel.supplierGroupViewModels[0].id = this.supplierGroupViewModel[0].id;
    }
    this.supplierInvitationListService.SaveSupplierGroup(supplierGroupSearchModel.supplierGroupViewModels).subscribe(result => {
      supplierGroupSearchModel.supplierGroupViewModels = result;
      this.isSaved = false;
      this.dialogRef.close("Saved");
    });
  }

  doAction() {
    this.dialogRef.close("Cancelled");
  }

  removeValueAt(index: number): void {
    this.supplierGroupViewModels.removeAt(index);
  }

}