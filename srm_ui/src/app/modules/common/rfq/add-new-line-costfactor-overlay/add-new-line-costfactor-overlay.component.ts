import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import { RFQPartLineCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-line-cost-factor-model';
import { CostFactorService } from 'app/shared/Services/etendering/cost-factor.service';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { RfqPartLineCostFactorService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-cost-factor.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RfqCostFactorsComponent } from '../Lines/rfq-Part-Line/rfq-cost-factors/rfq-cost-factors.component';
import { AddLineCostfactorNewListOverlayComponent } from '../add-line-costfactor-new-list-overlay/add-line-costfactor-new-list-overlay.component';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';

@Component({
    selector: 'add-new-line-costfactor-overlay',
    templateUrl: './add-new-line-costfactor-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddNewLineCostfactorOverlayComponent {
    parentComponent: RfqCostFactorsComponent;
    rfqId: string;
    CostFactorId: string;
    costTypeList: any = [];
    rFQPartLineList: any[];
    rfqPartlineId: any;
    validateNumberFormat: boolean = true;
    submitValidation: boolean = true;
    rFQPartLineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();

    costFactorModel: any;
    isEditOperation: boolean = false;

    costFactorList: any ;
    frmCostFactor: FormGroup;
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    cfnewlist:any;
    isEditable:boolean=false
    labelstring:string="Add New "
    NewListId:boolean=false;
    names:any[];
    EditedName:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddNewLineCostfactorOverlayComponent>, private rfqHeaderCostFactorService: RfqHeaderCostFactorService,
        public dialog: MatDialog, private costFactorService: CostFactorService, private fb: FormBuilder, private rfqPartLineService: RfqPartLineService
        , private rfqPartLineCostFactorService: RfqPartLineCostFactorService,private costFactorGroupService: CostFactorGroupService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.rfqPartlineId = data.rfqPartlineId;
      
        this.costTypeList = data.costTypeList;
        this.isEditOperation = data.editOperation;
        if(data.NewList!=null){
            //this.NewListId=data.NewListId;
            this.cfnewlist=data.NewList
            this.NewListId=true
        }
       // console.log(this.rfqPartlineId);
        if (this.isEditOperation) {
            this.CostFactorId = data.CostFactorId;
            this.labelstring="Edit "
            if(this.parentComponent.costFactorModelTemp.rfq==null){
                this.isEditable=true;
                //console.log(this.isEditable);
            }
            
        }
        if (this.isEditOperation) {
        this.frmCostFactor = this.fb.group({
            'cfName': [null, Validators.required],
            'cfDescription': [null, Validators.required],
            'cfTypeId': [null],
            'rfqPartlineId': [this.rfqPartlineId],
            'expectedValue': [null,Validators.required],
            'rfqId': "00000000-0000-0000-0000-000000000000",
            'newcflist': [null],
        });
    }
    else{
        this.frmCostFactor = this.fb.group({
            'cfName': [null, Validators.required],
            'cfDescription': [null, Validators.required],
            'cfTypeId': [null,Validators.required],
            'rfqPartlineId': [this.rfqPartlineId],
            'expectedValue': [null],
            'rfqId': "00000000-0000-0000-0000-000000000000",
            'newcflist': [null],
        });
    }
    if(this.NewListId){
        let grptitle=this.cfnewlist.title;
        this.frmCostFactor.patchValue({newcflist:grptitle})
    }
    }

    ngOnInit() {
        this.LoadNames();
        if (!this.costTypeList) {
            this.costFactorService.getCFById("00000000-0000-0000-0000-000000000000").subscribe(result => {
                this.costTypeList = result.data.cfTypes;
            });
        }

        if (this.isEditOperation) {

            let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            this.rfqPartLineCostFactorService.getRFQPartCostFactorById(this.CostFactorId).subscribe(result => {
                this.rFQPartLineCostFactor = result.data;
                this.costFactorModel = result.data;
                costFactor.cfName = result.data.costFactorName;
                costFactor.cfDescription = result.data.description;
                costFactor.expectedValue = result.data.expectedValue;
                costFactor.rfqPartlineId=result.data.rfqPartLineId
                //console.log(result);
                if (this.costFactorModel != null) {
                    this.frmCostFactor.patchValue(costFactor);
                }
            });
        }

       /*  this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
            this.rFQPartLineList = result.data;
        }); */
    }

    isExpectedValueValid(item) {

        this.validateNumberFormat = true;

        if (!Number.isInteger(item) && item.includes('.')) {
            var code, i, len;
            for (i = 0, len = item.length; i < len; i++) {
                code = item.charCodeAt(i);
                if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123) ||
                    (code == 46)) { // lower alpha (a-z)     
                }
            }
            if ((item.slice(item.indexOf(".") + 1).length != 2)) {
                this.validateNumberFormat = false;
            }

        } else {
            this.validateNumberFormat = false;
        }
        //console.log(2);
    }

    keyPressNumbersWithDecimal() {
        this.validateNumberFormat = true;
        this.validateNumberFormat = true;
    }

    onFormSubmit(form: NgForm) {
        this.isSaved=true;
        if (this.frmCostFactor.valid) { 
        if (this.isEditOperation) {
            let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            costFactor = Object.assign(costFactor, form);
            if (costFactor.expectedValue != null) {
                //console.log(1);
                this.isExpectedValueValid(costFactor.expectedValue);
            }
            if (this.validateNumberFormat) {
                let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
                this.rFQPartLineCostFactor.costFactorName = costFactor.cfName;
                this.rFQPartLineCostFactor.description = costFactor.cfDescription;
                this.rFQPartLineCostFactor.expectedValue = costFactor.expectedValue;
                this.rFQPartLineCostFactor.isCostFactorBasicDataSave = true;

                rfqLineCostFactors.push(this.rFQPartLineCostFactor);

                this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
                    this.isSaved=false;
                    this.dialogRef.close();
                    this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
                    this.parentComponent.Message = "Updated";
                    this.parentComponent.show("successerror");
                    setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);

                });
            } else {
                this.submitValidation = false;
                this.isSaved=false;
            }
        } else {
            let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            costFactor = Object.assign(costFactor, form);
            costFactor.rfqId = this.rfqId;
            costFactor.rfqPartlineId = this.rfqPartlineId;
            //console.log(costFactor);
            if(this.cfnewlist==null)
            {   
                this.costFactorService.SaveCostFactor(costFactor).subscribe(result => {
                    //console.log(result.data);
                    this.saveRFQHeaderNoList(result.data)
                        
                
                }); 
            }
            else{
                costFactor.costFactorGroupId= this.cfnewlist.id;
                this.costFactorGroupService.SaveRFQCFGroupMapping(costFactor).subscribe(

                    result => {
                      //  console.log(result);
                        this.saveRFQHeaderList(result.data)
                    
                    });
            }
            /* let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            costFactor = Object.assign(costFactor, form);
            costFactor.rfqId = this.rfqId;

            this.costFactorList.push(costFactor);
            this.costFactorService.SaveCF(this.costFactorList).subscribe(result => {
                this.dialogRef.close();
                this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
                this.parentComponent.Message = "Added";
                this.parentComponent.show("successerror");
            }); */
        }
        }
        else{
            this.isSaved=false;
        }
    }

    addList(){
        if(!this.NewListId){
        const dialogRef = this.dialog.open(AddLineCostfactorNewListOverlayComponent, { data: { "rfqId": this.rfqId ,"rfqPartLineId":this.rfqPartlineId} });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            //console.log(result);
            if(result){
                this.cfnewlist=result;
                this.frmCostFactor.patchValue({newcflist:result.title})
            }
           
            //name setValue({name: ‘abc’, age: ‘25’});
        }); 
    }
    }
    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
    saveRFQHeaderNoList(cfresult) {
       
        let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
        let rfqPartlineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
        rfqPartlineCostFactor.costFactorId = cfresult.id;
        rfqPartlineCostFactor.costTypeId = cfresult.cfTypeId;
        rfqPartlineCostFactor.rFQId = cfresult.rfqId;
        rfqPartlineCostFactor.rFQPartLineId = this.rfqPartlineId;
        rfqLineCostFactors.push(rfqPartlineCostFactor);
        //console.log(rfqHeaderCostFactors);
        this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
            this.isSaved=false;
            this.dialogRef.close();
            this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
            this.parentComponent.Message = "Added";
            this.parentComponent.show("successerror");
            setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
           
        }); 
    }
    saveRFQHeaderList(cfresult) {
        let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
        let rfqPartlineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
        rfqPartlineCostFactor.costFactorId = cfresult.id;
        rfqPartlineCostFactor.costTypeId = cfresult.cfTypeId;
        rfqPartlineCostFactor.rFQId = cfresult.rfqId;
        rfqPartlineCostFactor.rFQPartLineId = this.rfqPartlineId;
        rfqPartlineCostFactor.costFactorGroupId = cfresult.costFactorGroupId;
        
        rfqLineCostFactors.push(rfqPartlineCostFactor);
       // console.log(rfqHeaderCostFactors);
       this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
        this.isSaved=false;
            this.dialogRef.close();
            this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
            this.parentComponent.Message = "Added";
            this.parentComponent.show("successerror");
            setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
            
        }); 
    }
 onNameInput(name: string) {
      
       
     
        if(this.EditedName==name){
          return;
        }
        if(name.trim().length==0){
            this.frmCostFactor.get('cfName').setErrors({ invalid: true });
          }
      if (this.names.includes(name)) {
        
       
        this.frmCostFactor.get('cfName').setErrors({ duplicate: true });
         
          }
       
         
      }
    
      LoadNames(){
        this.costFactorService.GetCostfactorNameList().subscribe(result => {
          this.names = result.data;
      });
    }
}
