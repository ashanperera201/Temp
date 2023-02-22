import { ChangeDetectorRef, OnDestroy } from '@angular/core'
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ScoringService } from 'app/shared/Services/etendering/RFQ/scoring.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';
export class ItemChangeModel {
  frm: FormGroup; model: any
}
@Component({
  selector: 'app-rfq-scoring',
  templateUrl: './rfq-scoring.component.html',
  styleUrls: ['./rfq-scoring.component.scss']
})
export class RfqScoringComponent implements OnInit, OnDestroy {
  @Output() newItemEvent = new EventEmitter<ItemChangeModel>();
  @Input() RFQID;
  @Input() RFQModel: RFQViewModel;

  HeaderScoreError:string="";
  LineScoreError:string="";;
  headerTotalPoints=0;
  headerTotalPercentage=0;
  partlineTotalPoints=0;
  partlineTotalPercentage=0;
  isChanged = false;
  constructor(public dialog: MatDialog,private scoringService: ScoringService,
    private formbuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef) {
    
  }
  detailsDisplayMap = new Map();
  toggleDisplay(obj: any) {
    obj.isShow = !obj.isShow;
    var existingVal = this.detailsDisplayMap.get(obj.id);
    if (existingVal) {
      this.detailsDisplayMap.set(obj.id, !existingVal)
    } else {
      this.detailsDisplayMap.set(obj.id, true)
    }
  }
  getActiveDetailsTab(id: string): boolean {
    return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
  }
  ngOnDestroy(): void {
     if (this.RFQModel.isSaveAsDraft && this.isChanged) {
      Swal.fire({
        title: 'You will lose the Unsaved Scoring changes',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Ignore changes',
        confirmButtonText: 'Save & Continue',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.SaveScoring();
        }
      });
    } 
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  scoringModel: any;
  
  

  ngOnInit(): void {
    this.GetScoring();
  }
GetScoring(){
  this.HeaderScoreError="";
    this.LineScoreError="";
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
  this.scoringService.getScorings(this.RFQID).subscribe(result => {
    refference.close();
    this.scoringModel = result.data;
  
      this.CalculateHeaderTotal();
      this.CalculatePartLineItemTotal();
      this.CalculatePartLineTotal();
      //console.log(this.scoringModel)
   if(this.scoringModel.isNew==true)
   {
    this.isChanged=true;
   }
  });
}
UpdateIsChange(){
  this.isChanged=true;
}
 UpdateHdrPointsandPercent(field,lbl){
  this.isChanged=true;
   if(lbl=="pts")
   {
    field.percentatge=field.points;
   }
   else if(lbl=="percent")
   {
    field.points=field.percentatge;
   }
   this.CalculateHeaderTotal();
 }
 UpdateHdrItemPointsandPercent(field,lbl){
  this.isChanged=true;
  if(lbl=="pts")
  {
   field.percentatge=field.points;
  }
  else if(lbl=="percent")
  {
   field.points=field.percentatge;
  }
  this.CalculatePartLineTotal();
}
UpdateHdrItemInnerPointsandPercent(field,lbl){
  this.isChanged=true;
  if(lbl=="pts")
  {
   field.percentatge=field.points;
  }
  else if(lbl=="percent")
  {
   field.points=field.percentatge;
  }
  this.CalculatePartLineItemTotal()
}
UpdateHdrItemInnerListPointsandPercent(field,lbl){
  this.isChanged=true;
  if(lbl=="pts")
  {
   field.weightInPercentage=field.weightInPoints;
  }
  else if(lbl=="percent")
  {
   field.weightInPoints=field.weightInPercentage;
  }
  //this.CalculatePartLineTotal();
}

UpdateHdrdetListPointsandPercent(field,lbl){
  this.isChanged=true;
  if(lbl=="pts")
  {
   field.weightInPercentage=field.weightInPoints;
  }
  else if(lbl=="percent")
  {
   field.weightInPoints=field.weightInPercentage;
  }
  //this.CalculatePartLineTotal();
}

CalculateHeaderTotal(){
  this.headerTotalPoints=this.scoringModel.rfqHeaderScoringCriterias.filter(item => item.points >0)
  .reduce((sum, current) => sum + current.points, 0);
  this.headerTotalPercentage=this.scoringModel.rfqHeaderScoringCriterias.filter(item => item.percentatge >0)
  .reduce((sum, current) => sum + current.percentatge, 0);
}
CalculatePartLineTotal(){
  this.partlineTotalPoints=this.scoringModel.rfqPartLineScoringCriterias.filter(item => item.points >0)
  .reduce((sum, current) => sum + current.points, 0);
  this.partlineTotalPercentage=this.scoringModel.rfqPartLineScoringCriterias.filter(item => item.percentatge >0)
  .reduce((sum, current) => sum + current.percentatge, 0);
}

CalculatePartLineItemTotal(){
  this.scoringModel.rfqPartLineScoringCriterias.filter(part=>{
    part.totalPoint=part.rfqLineScoringCriteriaModel.filter(item => item.points >0)
    .reduce((sum, current) => sum + current.points, 0);
  })
  this.scoringModel.rfqPartLineScoringCriterias.filter(part=>{
    part.totalPercent=part.rfqLineScoringCriteriaModel.filter(item => item.percentatge >0)
    .reduce((sum, current) => sum + current.percentatge, 0);
  })
}
 
  SaveScoring() {
    this.HeaderScoreError="";
    this.LineScoreError="";
    if(this.headerTotalPoints!=100 && this.headerTotalPercentage!=100) {
      this.HeaderScoreError="Max Score is 100 :";
      Swal.fire({
        icon: 'warning',
        title: 'Max Score is 100',
      })
      return;
    }
    let errorcount=0;
    if(this.scoringModel.rfqPartLineScoringCriterias.length>0){
      if(this.partlineTotalPoints!=100 && this.partlineTotalPercentage!=100) {
        this.LineScoreError="Max Score is 100 :";
        Swal.fire({
          icon: 'warning',
          title: 'Max Score is 100',
        })
        return;
      } 

    
    this.scoringModel.rfqPartLineScoringCriterias.filter(part=>{
      if(part.rfqLineScoringCriteriaModel.length>0){
      let percent=part.rfqLineScoringCriteriaModel.filter(i => i.percentatge >0)
      .reduce((sum, current) => sum + current.percentatge, 0);
      if(percent!=100){
        part.showError="Max Score is 100 :"
        Swal.fire({
          icon: 'warning',
          title: 'Max Score is 100',
        })
        errorcount=errorcount+1;
      }else{
        part.showError=""
      }
     return;
    }
      })
    }
   
    
    
  
    /*  let scoringmodel: any = { rfqScoringHeaderModel: {}, rfqScoringLineModel: {}, rfqHeaderLineScoringCriterias: [], rfqId: "", rfqHeaderScoringCriterias: [], rfqPartLineScoringCriterias: [], rfqLineScoringCriterias: [] };
    scoringmodel.rfqScoringHeaderModel = {
      rfqScoringHeaderAttachmentTextViewModels: [], rfqScoringHeaderAttributeTextViewModels: [], rfqScoringHeaderCostFactorTextViewModels: []
      , rfqScoringHeaderDeliverablesTextViewModels: [], rfqScoringHeaderDocumentTextTextViewModels: [], rfqScoringHeaderPaymentScheduleTextViewModels: []
      , rfqScoringHeaderTermsConditionTextViewModels: [], rfqScoringHeaderNoteViewModels: []
    };

    scoringmodel.rfqScoringLineModel = {
      rfqPartLineScoringModels: [], rfqScoringLineAttributeTextViewModels: [], rfqScoringLineCostFactorTextViewModels: []
      , rfqScoringLineAttachmentTextViewModels: [], rfqScoringLineDeliverableTextViewModels: [], rfqScoringLineDocumentTextTextViewModels: []
      , rfqScoringLinePaymentScheduleTextViewModels: [], rfqScoringLineNotes: []
    };
    scoringmodel.rfqHeaderLineScoringCriterias = [];

    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttachmentTextViewModels, this.scoringForm.value.scoringHeaderAttachments);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttributeTextViewModels, this.scoringForm.value.scoringHeaderAttributes);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderCostFactorTextViewModels, this.scoringForm.value.scoringHeaderCFs);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDeliverablesTextViewModels, this.scoringForm.value.scoringFeaderDeliveries);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDocumentTextTextViewModels, this.scoringForm.value.scoringHeaderDTs);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderPaymentScheduleTextViewModels, this.scoringForm.value.scoringHeaderPSs);
    Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderNoteViewModels, this.scoringForm.value.scoringHeaderNotes);
    Object.assign(scoringmodel.rfqScoringLineModel.rfqPartLineScoringModels, this.scoringForm.value.scoringPartLines);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineNotes, this.partLineModel.rfqScoringLineModel.rfqScoringLineNotes);
    // Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineNotes, this.partLineModel.rfqScoringLineModel.rfqScoringLineNotes);
    Object.assign(scoringmodel.rfqHeaderScoringCriterias, this.scoringForm.value.scoringHeaderCriteria);
    Object.assign(scoringmodel.rfqPartLineScoringCriterias, this.scoringForm.value.scoringPartLineCriteria);
    Object.assign(scoringmodel.rfqLineScoringCriterias, this.partLineModel.rfqLineScoringCriterias); */
    // Object.assign(scoringmodel.rfqHeaderLineScoringCriterias,this.frmScoring.value.scoringPartLines);
  if(errorcount==0){
    this.scoringModel.rfqId = this.RFQID;
    //console.log(this.scoringModel);
    this.scoringService.SaveScoringsRFQ(this.scoringModel).subscribe(result => {
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: "Changes saved successfully",
        showConfirmButton: false,
        timer: 1000
      })
      this.isChanged = false;
      this.GetScoring();
    }); 
  }
  }
}