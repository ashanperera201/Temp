import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { CostFactorService } from 'app/shared/Services/etendering/cost-factor.service';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { CostFactorsComponent } from 'app/modules/common/rfq/header-component/cost-factors/cost-factors.component';
import { AddCostfactorNewListOverlayComponent } from '../add-costfactor-new-list-overlay/add-costfactor-new-list-overlay.component';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';


@Component({
    selector: 'add-new-costfactor-overlay',
    templateUrl: './add-new-costfactor-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewCostfactorOverlayComponent {
    parentComponent: CostFactorsComponent;
    rfqId: string;
    CostFactorId: string;
    costTypeList: any = [];
    rfqHeaderCostFactors: any = [];

    costFactorModel: any;
    isEditOperation: boolean = false;

    costFactorList: any ;
    frmCostFactor: FormGroup;
    rFQHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();

    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    templateData: any = [];
    useremail: string = '';
    validateNumberFormat: boolean = true;
    submitValidation: boolean = true;

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
    //isduplicateError:false;
    editedname:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddNewCostfactorOverlayComponent>, private rfqHeaderCostFactorService: RfqHeaderCostFactorService,
        public dialog: MatDialog, private costFactorService: CostFactorService, private fb: FormBuilder,private costFactorGroupService: CostFactorGroupService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.costTypeList = data.costTypeList;
        this.isEditOperation = data.editOperation;
        if(data.NewList!=null){
            //this.NewListId=data.NewListId;
            this.cfnewlist=data.NewList
            this.NewListId=true
        }
        if (this.isEditOperation) {
            this.CostFactorId = data.CostFactorId;
            this.labelstring="Edit "
            if(this.parentComponent.costFactorModelTemp.rfq==null){
                this.isEditable=true;
                //console.log(this.isEditable);
            }
            //this.isEditable=true;
        }
        if (this.isEditOperation) {
            this.frmCostFactor = this.fb.group({
                'cfName': [null, Validators.required],
                'cfDescription': [null, Validators.required],
                'cfTypeId': [null],
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
            this.costFactorService.getCFById("00000000-0000-0000-0000-000000000000").subscribe(result => {//your service call here
                this.costTypeList = result.data.cfTypes;
            });
        }

        if (this.isEditOperation) {
            let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            this.rfqHeaderCostFactorService.getRFQHeaderCostFactorById(this.CostFactorId).subscribe(result => {
                this.rFQHeaderCostFactor = result.data;
                this.costFactorModel = result.data;
                costFactor.cfName = result.data.costFactorName;
                costFactor.cfDescription = result.data.description;
                costFactor.expectedValue = result.data.expectedValue;

                if (this.costFactorModel != null) {
                    this.frmCostFactor.patchValue(costFactor);
                }
                if(costFactor.cfName!=null){
                    this.editedname=costFactor.cfName
                  }
            });
        }
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
                this.isExpectedValueValid(costFactor.expectedValue);
            }
            if (this.validateNumberFormat) {
                let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
                this.rFQHeaderCostFactor.costFactorName = costFactor.cfName;
                this.rFQHeaderCostFactor.description = costFactor.cfDescription;
                this.rFQHeaderCostFactor.expectedValue = costFactor.expectedValue;
                this.rFQHeaderCostFactor.isCostFactorBasicDataSave = true;

                rfqHeaderCostFactors.push(this.rFQHeaderCostFactor);
               
                this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
                    this.isSaved=false;
                    this.dialogRef.close();
                    this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
                    this.parentComponent.Message = "Added";
                    this.parentComponent.show("successerror");
                    setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
                });
            } else {
                this.isSaved=false;
                this.submitValidation = false;
            }

        } else {
            let costFactor: CostFactorTextViewModel = new CostFactorTextViewModel();
            costFactor = Object.assign(costFactor, form);
            costFactor.rfqId = this.rfqId;
          
            console.log(costFactor);
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
                       // console.log(result);
                        this.saveRFQHeaderList(result.data)
                    
                    });
            }
            /* this.costFactorService.SaveCF(this.costFactorList).subscribe(result => {
                
                this.dialogRef.close();
                this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
                this.parentComponent.Message = "Added";
                setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
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
        const dialogRef = this.dialog.open(AddCostfactorNewListOverlayComponent, { data: { "rfqId": this.rfqId } });
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
       
        let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
        let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
        rfqHeaderCostFactor.costFactorId = cfresult.id;
        rfqHeaderCostFactor.costTypeId = cfresult.cfTypeId;
        rfqHeaderCostFactor.rFQId = cfresult.rfqId;
        rfqHeaderCostFactors.push(rfqHeaderCostFactor);
        //console.log(rfqHeaderCostFactors);
        this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
            this.isSaved=false;
            this.dialogRef.close();
            this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
            this.parentComponent.Message = "Added";
            
            this.parentComponent.show("successerror");
            setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
        }); 
    }
    saveRFQHeaderList(cfresult) {
        let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
        let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
        rfqHeaderCostFactor.costFactorId = cfresult.id;
        rfqHeaderCostFactor.costTypeId = cfresult.cfTypeId;
        rfqHeaderCostFactor.rFQId = cfresult.rfqId;
        rfqHeaderCostFactor.costFactorGroupId = cfresult.costFactorGroupId;
        rfqHeaderCostFactors.push(rfqHeaderCostFactor);
       // console.log(rfqHeaderCostFactors);
        this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
            this.isSaved=false;
            this.dialogRef.close();
            this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
            this.parentComponent.Message = "Added";
           
            this.parentComponent.show("successerror");
            setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
        }); 
    }
    onNameInput(name: string) {
      
       
     
        if(this.editedname==name){
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
