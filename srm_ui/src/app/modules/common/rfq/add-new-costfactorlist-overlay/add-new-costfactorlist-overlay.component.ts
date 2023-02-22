import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { CostFactorsComponent } from 'app/modules/common/rfq/header-component/cost-factors/cost-factors.component';
import { AddCostfactorItemOverlayComponent } from '../add-costfactor-item-overlay/add-costfactor-item-overlay.component';
import { AddNewCostfactorOverlayComponent } from '../add-new-costfactor-overlay/add-new-costfactor-overlay.component';
@Component({
    selector: 'add-new-costactorlist-overlay',
    templateUrl: './add-new-costfactorlist-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewCostfactorlistOverlayComponent {
    parentComponent: CostFactorsComponent;
    rfqId: string;
    costFactorGroupId: string;
    title: any;
    name: any;
    costFactorGroupList: any = [];
    frmCostFactorGroup: FormGroup;
    costFactorModel: any;
    isEditOperation: boolean = false;
    rFQHeaderCostFactor: RFQHeaderCostFactorModel[] = [];
    costTypeList: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    labelstring:string="New "
    isAttributeVisibile:boolean=false;
    NewGroupId="";
    SaveResult:any;
    names:any[];
    EditedName:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddNewCostfactorlistOverlayComponent>,
        public dialog: MatDialog, private costFactorGroupService: CostFactorGroupService, private fb: FormBuilder
        , private rfqHeaderCostFactorService: RfqHeaderCostFactorService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.costTypeList = data.costTypeList;
        this.isEditOperation = data.editOperation;
        if (this.isEditOperation) {
            this.labelstring="Edit "
            this.costFactorGroupId = data.CostFactorGroupId;
        }
        this.frmCostFactorGroup = this.fb.group({
            'title': [null, Validators.required],
            'name': [null, Validators.required],
            'rfqId': "00000000-0000-0000-0000-000000000000",
        });
    }

    ngOnInit() {
        this.LoadNames();
        if (this.isEditOperation) {
            let costFactorGroup: CostFactorGroupViewModel = new CostFactorGroupViewModel();
            this.rfqHeaderCostFactorService.getRFQHeaderCostFactorByGroupId(this.costFactorGroupId).subscribe(result => {
                this.rFQHeaderCostFactor = result.data;
                costFactorGroup.name = this.rFQHeaderCostFactor[0].headerCostFactorGroupDescription;
                costFactorGroup.title = this.rFQHeaderCostFactor[0].headerCostFactorGroupName;

                if (costFactorGroup != null) {
                    this.frmCostFactorGroup.patchValue(costFactorGroup);
                }
               if(costFactorGroup.title!=null){
                    this.EditedName=costFactorGroup.title
                  }
            });
        }
    }


    onFormSubmit(form: NgForm) {
        this.isSaved=true;
        if (this.frmCostFactorGroup.valid) {
        let costFactorGroup: CostFactorGroupViewModel = new CostFactorGroupViewModel();
        costFactorGroup = Object.assign(costFactorGroup, form);
        if (this.isEditOperation) {
            costFactorGroup.id = this.costFactorGroupId;
            for (var k = 0; k < this.rFQHeaderCostFactor.length; k++) {
                this.rFQHeaderCostFactor[k].headerCostFactorGroupName = costFactorGroup.title;
                this.rFQHeaderCostFactor[k].headerCostFactorGroupDescription = costFactorGroup.name;
                this.rFQHeaderCostFactor[k].costFactor = null;
                this.rFQHeaderCostFactor[k].isCostFactorGroupDataSave = true;
            }           
            this.rfqHeaderCostFactorService.SaveRFQHeader(this.rFQHeaderCostFactor).subscribe(result => {
                this.isSaved=false;
                this.dialogRef.close();
                this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
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
                this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);

                if (costFactorGroup.id == "00000000-0000-0000-0000-000000000000") {
                    this.parentComponent.Message = "Added";
                    this.parentComponent.show("successerror");
                    setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);

                } else {
                    this.parentComponent.Message = "Added";
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

    addTemplate(item, event) {
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
    addNewCostFactorItem() {
        this.dialogRef.close();
        const dialogRef1 = this.dialog.open(AddNewCostfactorOverlayComponent, { data: { "rfqId": this.rfqId, "CostFactorComponent": this.parentComponent, "costTypeList": this.costTypeList, "NewList" :this.SaveResult} });
        dialogRef1.addPanelClass('inline-md-overlay');
        dialogRef1.disableClose = true;
        dialogRef1.afterClosed().subscribe(result => {
        });
      }
    
      
      addCostFactorItem() {
        this.dialogRef.close();
        const dialogRef1 = this.dialog.open(AddCostfactorItemOverlayComponent, { data: { "rfqId": this.rfqId, "CostFactorComponent": this.parentComponent,"NewListId" :this.NewGroupId } });
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