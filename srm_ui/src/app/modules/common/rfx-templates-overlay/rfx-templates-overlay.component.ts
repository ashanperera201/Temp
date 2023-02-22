import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQTemplateViewModel } from 'app/main/Models/etendering/ViewModels/rfq-template-view-model';
import { RFXService } from 'app/shared/Services/etendering/rfx.service';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'rfx-templates-overlay',
    templateUrl: './rfx-templates-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RfxTemplatesOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    frmRfxTemplate: FormGroup;
    dataId: any = "";
    issuccess = false;
    iserror = false;
    rfqId: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<RfxTemplatesOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private rfqService: RFXService
    ) {
        this.dataId = data.id;
        this.rfqId = data.rfqId;

        this.frmRfxTemplate = this.fb.group({
            'templateName': [null, Validators.required]
        })
    }

    onFormSubmit(form: NgForm) {

        let rfqTemplateModel: RFQTemplateViewModel = new RFQTemplateViewModel();
        rfqTemplateModel = Object.assign(rfqTemplateModel, form);
        rfqTemplateModel.rfqId = this.rfqId;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
      
        this.rfqService.SaveRFQTemplate(rfqTemplateModel).subscribe(result => {
            refference.close();
            if(result.data.isSuccess==true)
            {
                Swal.fire({
                    icon: 'success',
                    position: "center",
                    title: 'Success',
                    html: result.data.responseMessage,
                }).then((result) => {
                    debugger;
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.dialogRef.close();

                    }
                });
                
            }
            else
            {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    html: result.data.responseMessage,
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
            }
            
        });

    }

    cancel() {
        this.dialogRef.close();
    }

}