import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { RFAQAgreementInformationModel } from 'app/main/Models/etendering/ViewModels/rfaq-agreement-information-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';


interface AgreementTypes {
  value: string;
  viewValue: string;
}
interface Priorities {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-agreement-info-dialog',
  templateUrl: './agreement-info-dialog.component.html',
  styleUrls: ['./agreement-info-dialog.component.scss']
})
export class AgreementInfoDialogComponent implements OnInit {

  // agreementInfo = this.fb.group({
  //   purchaseType: [''],
  //   purchaseTypeDescription: [''],
  //   priority: [''],
  //   stepPricingBasis: [''],
  //   contractTitle: [''],
  //   contractRevNo: [''],
  //   signDate: new Date(),
  //   reviewDate: new Date(),
  //   validFromDate: new Date(),
  //   validToDate: new Date(),
  //   agreementGroup: [''],
  //   agreementGroupDescription: [''],
  //   agreementType: [''],
  //   maxAmountOption: [''],
  //   maxAmount: [''],
  //   terminationCondition: [''],
  //   groupAgreement: true,
  //   activeChangeAgreementExists: true,
  // });



  agreementTypes: AgreementTypes[] = [
    { value: 'one', viewValue: 'one' },
    { value: 'two', viewValue: 'two' },
    { value: 'three', viewValue: 'three' },
  ];

  priorities: Priorities[] = [
    { value: 'one', viewValue: 'one' },
    { value: 'two', viewValue: 'two' },
    { value: 'three', viewValue: 'three' },
  ];

  
  agreementInfo: any;
  rfqId: any = "";
  supplierId: any = "";
  agreementGroupTypes: any[]; 
  

  constructor(@Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private rfqService: RfqService,
    public dialogRef: MatDialogRef<AgreementInfoDialogComponent>) {
      this.rfqId = data.rfqId;
      this.supplierId = data.supplierId;
     }

  ngOnInit(){
    this.FetchAgreementInformation();
  }

  beforecontractSignDate:Date;
  beforereviewDate:Date;
  beforevalidFromDate:Date;
  beforevalidToDate:Date;

  FetchAgreementInformation() {
    //debugger;
    this.rfqService.GetAgreementInformationByRFQId(this.rfqId,this.supplierId).subscribe((result) => {
      this.agreementInfo = result.data[0];     
     if(this.agreementInfo)
     {
      this.agreementGroupTypes = this.agreementInfo.agreementGroupTypes;  
        
        this.beforecontractSignDate = this.agreementInfo.contractSignDate;
        this.beforereviewDate = this.agreementInfo.reviewDate;
        this.beforevalidFromDate = this.agreementInfo.validFromDate;
        this.beforevalidToDate = this.agreementInfo.validToDate;       
     }
         
    });
    
  }

  
  UpdateAgreementInformation(issubmit) {       

    this.agreementInfo.rFQId = this.rfqId;
   this.agreementInfo.isAgreementSubmitted=issubmit;
    if(this.beforecontractSignDate != this.agreementInfo.contractSignDate){
      this.agreementInfo.contractSignDate.setMinutes(this.agreementInfo.contractSignDate.getMinutes() - this.agreementInfo.contractSignDate.getTimezoneOffset())
    }
    
    if(this.beforereviewDate != this.agreementInfo.reviewDate){
      this.agreementInfo.reviewDate.setMinutes(this.agreementInfo.reviewDate.getMinutes() - this.agreementInfo.reviewDate.getTimezoneOffset())
    }

    if(this.beforevalidFromDate != this.agreementInfo.validFromDate){
      this.agreementInfo.validFromDate.setMinutes(this.agreementInfo.validFromDate.getMinutes() - this.agreementInfo.validFromDate.getTimezoneOffset())
    }

    if(this.beforevalidToDate != this.agreementInfo.validToDate){
      this.agreementInfo.validToDate.setMinutes(this.agreementInfo.validToDate.getMinutes() - this.agreementInfo.validToDate.getTimezoneOffset())
    }
    let submittedText="Saved";
    if(issubmit)
    {
      submittedText="Submitted";
    }
    this.rfqService.SaveAgreementInformation(this.agreementInfo).subscribe(result => {    
      Swal.fire(
        submittedText,
        'Record '+submittedText+' successfully.',
        'success'
    ).then((result) => {
      this.dialogRef.close();      
    });
      
    });
  }

  onFormSubmit(form: NgForm) {
    console.log(this.agreementInfo);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
