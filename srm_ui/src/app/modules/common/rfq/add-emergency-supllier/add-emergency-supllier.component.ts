/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SupplierViewModel } from 'app/main/Models/etendering/ViewModels/supplier-view-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-emergency-supllier',
  templateUrl: './add-emergency-supllier.component.html',
  styleUrls: ['./add-emergency-supllier.component.scss']
})
export class AddEmergencySupllierComponent implements OnInit {

  supplierForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private rfqSupplierService: RfqSupplierService,
    public dialogRef: MatDialogRef<AddEmergencySupllierComponent>) { }

  ngOnInit(): void {
    this.supplierForm = this._formBuilder.group({
      supplierName: ['', Validators.required],
      title: ['', Validators.required],
      supplierFirstName: ['', Validators.required],
      supplierLastName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
    });

  }

  get f() { return this.supplierForm.controls; }

  doAction() {
    this.dialogRef.close();
  }

  onFormSubmit(form): void {
    let supplierViewModel: SupplierViewModel = new SupplierViewModel();
    supplierViewModel = Object.assign(supplierViewModel, form);
    supplierViewModel.supplierStatus = 'Yet to be On-boarded';
    supplierViewModel.contactName = form.title + ' ' + form.supplierFirstName + ' ' + form.supplierLastName;
    supplierViewModel.title=form.title;
    supplierViewModel.firstName=form.supplierFirstName;
    supplierViewModel.lastName=form.supplierLastName;
    this.rfqSupplierService.saveEmergencySupplier(supplierViewModel).subscribe((result) => {
      if (result.data.isSuccess) {
        this.dialogRef.close(result.data);
      }
      else {
        Swal.fire({
          icon: 'warning',
          title: result.data.responseMessage,
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  };
}
