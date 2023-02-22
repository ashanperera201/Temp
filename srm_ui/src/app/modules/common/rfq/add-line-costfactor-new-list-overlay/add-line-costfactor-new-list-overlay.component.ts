import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { RFQCostFactorGroupModel } from 'app/main/Models/etendering/rfq-cost-factor-group-model';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { CostFactorsComponent } from 'app/modules/common/rfq/header-component/cost-factors/cost-factors.component';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';

@Component({
    selector: 'add-line-costfactor-new-list-overlay',
    templateUrl: './add-line-costfactor-new-list-overlay.component.html',
  
    encapsulation: ViewEncapsulation.None
})
export class AddLineCostfactorNewListOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    rfqCostFactorGroupModel: RFQCostFactorGroupModel[];

    parentComponent: CostFactorsComponent;
    costFactorGroupModel: CostFactorGroupViewModel[];
    cfGroupList: any = [];
    costFactorGroupSearchModel: CostFactorGroupSearchModel = new CostFactorGroupSearchModel();
    descriptions: any;
    name: any;

    rfqId: string;
    rfqPartLineId: string;

    displayedColumns: string[] = [ 'name', 'title'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

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
    result:any={};
    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddLineCostfactorNewListOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderCostFactorService: RfqHeaderCostFactorService,private costFactorGroupService: CostFactorGroupService,
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.rfqPartLineId=data.rfqPartLineId;
    }

    FetchCostFactorList(rfqId: string) {
        this.rfqId = rfqId;
        
        this.costFactorGroupSearchModel.rfqId = this.rfqId;
        this.costFactorGroupSearchModel.rfqPartLineId=this.rfqPartLineId;
        this.costFactorGroupService.getlineCFGroupSearch(this.costFactorGroupSearchModel).subscribe(result => {
            //console.log(result)
            this.costFactorGroupModel = result.costFactorGroupModels;
           
        });
    }

    ngOnInit() {
        this.FetchCostFactorList(this.rfqId);
    }

    searchGroup() {
        this.costFactorGroupSearchModel.cFGName = this.name;
        this.costFactorGroupSearchModel.cFGTitle = this.descriptions;
        this.FetchCostFactorList(this.rfqId);
    }


    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
    SelectList(row){
        this.result=row;
        this.dialogRef.close(this.result);
    }
}