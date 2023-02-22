import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-rfq-part-line-overlay',
  templateUrl: './edit-rfq-part-line-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EditRfqPartLineOverlayComponent implements OnInit {

  dataId: any = "";
  partLineForm: FormGroup;
  partLine: any;
  subProjects: any[] = [];
  activities: any[] = [];
  isAdded;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditRfqPartLineOverlayComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private rfqPartLineService: RfqPartLineService) {

    this.partLineForm = this.fb.group({
      targetPrice: [null],
      showPriceToSuppliers: [false],
    });

    this.dataId = data.id;
  }

  ngOnInit(): void {
    this.isAdded = false;
    this.rfqPartLineService.getPartLineById(this.dataId).subscribe(result => {
      this.partLine = result.data;
      this.subProjects = this.partLine.subProjects;
        this.activities = this.partLine.activities;
      this.partLineForm.patchValue(this.partLine);
    });
  }

  onFormSubmit(form: NgForm) {
    console.log(form);
    this.partLine = Object.assign(this.partLine, form);

    this.rfqPartLineService.SaveRFQPartLine(this.partLine).subscribe(result => {
      this.dialogRef.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Part line updated successfully",
        showConfirmButton: false,
        timer: 1000
      })
      this.isAdded = true;
    });
  }

  doAction() {
    this.dialogRef.close();
  }

  getSubProject(subProjectId: string) {
    let name = subProjectId;
    this.subProjects.forEach(element => {
      if (element.id == subProjectId) {
        name = element.name;
        return name;
      }
    });
    return name;
  }

  getActivity(activityId: string) {
    let activity = activityId;
    this.activities.forEach(element => {
      if (element.id == activityId) {
        activity = element.text;
        return activity;
      }
    });
    return activity;
  }

}
