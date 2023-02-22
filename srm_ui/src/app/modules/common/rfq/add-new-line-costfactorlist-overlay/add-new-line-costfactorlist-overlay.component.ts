import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { RFQPartLineCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-line-cost-factor-model';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import { RfqPartLineCostFactorService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-cost-factor.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RfqCostFactorsComponent } from '../Lines/rfq-Part-Line/rfq-cost-factors/rfq-cost-factors.component';
import { AddNewLineCostfactorOverlayComponent } from '../add-new-line-costfactor-overlay/add-new-line-costfactor-overlay.component';
import { AddLineCostfactorItemOverlayComponent } from '../add-line-costfactor-item-overlay/add-line-costfactor-item-overlay.component';
@Component({
    selector: 'add-new-line-costactorlist-overlay',
    templateUrl: './add-new-line-costfactorlist-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewLineCostfactorlistOverlayComponent {
    parentComponent: RfqCostFactorsComponent;
    rfqId: string;
    costFactorGroupId: string;
    title: any;
    name: any;
    costFactorGroupList: any = [];
    frmCostFactorGroup: FormGroup;
    costFactorModel: any;
    isEditOperation: boolean = false;
    rFQPartLineList: any[];
    rfqPartlineId: any;
    rFQPartLineCostFactor: RFQPartLineCostFactorModel[] = [];
    costTypeList: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    formFieldHelpers: string[] = [''];
    registrationDetails2 = new FormGroup({
        expirationdate: new FormControl(new Date())
    });
    labelstring:string="New "
    isAttributeVisibile:boolean=false;
    NewGroupId="";
    SaveResult:any;
    names:any[];
    EditedName:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddNewLineCostfactorlistOverlayComponent>,
        public dialog: MatDialog, private costFactorGroupService: CostFactorGroupService, private fb: FormBuilder
        , private rfqPartLineService: RfqPartLineService, private rfqPartLineCostFactorService: RfqPartLineCostFactorService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.rfqPartlineId=data.rfqPartlineId;
        this.isEditOperation = data.editOperation;
        this.costTypeList = data.costTypeList;
        if (this.isEditOperation) {
            this.costFactorGroupId = data.CostFactorgroupId;
            this.labelstring="Edit "
        }

        this.frmCostFactorGroup = this.fb.group({
            'title': [null, Validators.required],
            'name': [null, Validators.required],
            'rfqPartlineId': [this.rfqPartlineId], 
            'rfqId': "00000000-0000-0000-0000-000000000000",
        });
    }

    ngOnInit() {
        this.LoadNames();
        if (this.isEditOperation) {
            let costFactorGroup: CostFactorGroupViewModel = new CostFactorGroupViewModel();
            this.rfqPartLineCostFactorService.getRFQPartCostFactorByGroupId(this.costFactorGroupId).subscribe(result => {
                this.rFQPartLineCostFactor = result.data;
                costFactorGroup.title = this.rFQPartLineCostFactor[0].lineCostFactorGroupName;
                costFactorGroup.name = this.rFQPartLineCostFactor[0].lineCostFactorGroupDescription;
                this.rfqPartlineId = this.rFQPartLineCostFactor[0].rFQPartLineId;

                if (costFactorGroup != null) {
                    this.frmCostFactorGroup.patchValue(costFactorGroup);
                }
                if(costFactorGroup.title!=null){
                    this.EditedName=costFactorGroup.title
                  }
            });
        }

       /*  this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
            this.rFQPartLineList = result.data;
        }); */
    }

    onFormSubmit(form: NgForm) {
        this.isSaved=true;
        if (this.frmCostFactorGroup.valid) {
        let costFactorGroup: CostFactorGroupViewModel = new CostFactorGroupViewModel();
        costFactorGroup = Object.assign(costFactorGroup, form);
        if (this.isEditOperation) {
            for (var k = 0; k < this.rFQPartLineCostFactor.length; k++) {
                this.rFQPartLineCostFactor[k].lineCostFactorGroupName =  costFactorGroup.title;
                this.rFQPartLineCostFactor[k].lineCostFactorGroupDescription = costFactorGroup.name;
                this.rFQPartLineCostFactor[k].costFactor = null;
                this.rFQPartLineCostFactor[k].isCostFactorGroupDataSave = true;
            }

            this.rfqPartLineCostFactorService.SaveRFQPartLine(this.rFQPartLineCostFactor).subscribe(result => {
                this.isSaved=false;
                this.dialogRef.close();
                this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
                this.parentComponent.Message = "Updated";
                this.parentComponent.show("successerror");
                setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
            });
        }
        else {
            costFactorGroup.rfqId = this.rfqId;
            this.costFactorGroupList.push(costFactorGroup);
            this.costFactorGroupService.SaveCostFactorGroup([costFactorGroup]).subscribe(result => {
                this.isSaved=false;
                this.isAttributeVisibile=true;
                //console.log(result.data[0].id);
                this.NewGroupId=result.data[0].id;
                this.SaveResult=result.data[0];
                /* this.dialogRef.close();
                this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);

                if (costFactorGroup.id == "00000000-0000-0000-0000-000000000000") {
                    this.parentComponent.Message = "Added";
                    this.parentComponent.show("successerror");
                    setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
                } else {
                    this.parentComponent.Message = "Updated";
                    this.parentComponent.show("successerror");
                    setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
                } */
            });
        }
    }
    else{
        this.isSaved=false;
    }
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
    addNewCostFactorItem() {
        this.dialogRef.close();
        const dialogRef1 = this.dialog.open(AddNewLineCostfactorOverlayComponent, { data: { "rfqId": this.rfqId, "CostFactorComponent": this.parentComponent, "costTypeList": this.costTypeList, "NewList" :this.SaveResult,"rfqPartlineId": this.rfqPartlineId} });
        dialogRef1.addPanelClass('inline-md-overlay');
        dialogRef1.disableClose = true;
        dialogRef1.afterClosed().subscribe(result => {
        });
    
      }
    
      
      addCostFactorItem() {
        this.dialogRef.close();
        const dialogRef1 = this.dialog.open(AddLineCostfactorItemOverlayComponent, { data: { "rfqId": this.rfqId, "CostFactorComponent": this.parentComponent,"NewListId" :this.NewGroupId,"rfqPartlineId": this.rfqPartlineId } });

        dialogRef1.addPanelClass('inline-md-overlay');
        dialogRef1.disableClose = true;
        dialogRef1.afterClosed().subscribe(result => {
        });
      }
      onNameInput(name: string) {
      
       
     
        if(this.EditedName==name){
          return;
        }
        if(name.trim().length==0){
            this.frmCostFactorGroup.get('title').setErrors({ invalid: true });
          }
      if (this.names.includes(name)) {
        
       
        this.frmCostFactorGroup.get('title').setErrors({ duplicate: true });
         
          }
       
         
      }
    
      LoadNames(){
        this.costFactorGroupService.GetCostfactorGroupNameList().subscribe(result => {
          this.names = result.data;
      });
    }
}
