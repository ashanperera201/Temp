import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RFQAttributeItemsComponent } from '../Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { AddLineAttributeItemOverlayComponent } from '../add-line-attribute-item-overlay/add-line-attribute-item-overlay.component';
import { AddNewLineAttributeOverlayComponent } from '../add-new-line-attribute-overlay/add-new-line-attribute-overlay.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'add-att-list-overlay',
    templateUrl: './add-new-line-attribute-list-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewLineAttributeListOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    dataAttrList: any;
    rfqId: string;
    partLineId: string = "";
    frmAttributeGroup: FormGroup;
    attributeGroupList: any = [];
    context: RFQAttributeItemsComponent;
    rfqPartLines: any[];
    labelstring:string;
    isAttributeVisibile:boolean=false;
    NewGroupId="";
    SaveResult:any;
    names:any[];
    isduplicateError:false;
    editedname:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddNewLineAttributeListOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private attributeGroupService: AttributeGroupService,
        private rfqPartLineService: RfqPartLineService,
        private rfqPartLineAttributeService: RfqPartLineAttributeService
    ) {
        this.dataAttrList = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;
        this.partLineId = data.partLineId;
        this.labelstring=data.label;
        this.frmAttributeGroup = this.fb.group({
            'title': [this.dataAttrList ? this.dataAttrList.title : null, Validators.required],
            'name': [this.dataAttrList ? this.dataAttrList.name : null, Validators.required],
            'groupName': [this.dataAttrList ? this.dataAttrList.group : null, Validators.required],
            'rfqId': this.dataAttrList ? this.dataAttrList.rfqLineAttributeModels[0].rfqId : this.rfqId,
            'rfqPartLineId': this.partLineId,
        });
        if(data==null){
            this.editedname=this.dataAttrList.title;
        } 
        this.LoadNames();
    }

    /* fetchRfqPartLineData(rfqId: string) {
        this.rfqId = rfqId;
        this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
            this.rfqPartLines = result.data;
        });
    } */

    ngOnInit(): void {
        //this.fetchRfqPartLineData(this.rfqId);
    }

    onFormSubmit(form: NgForm) {
        this.isSaved=true;
        if (this.frmAttributeGroup.valid) {
        let attributeGroup: AttributeGroupViewModel = new AttributeGroupViewModel();
        attributeGroup = Object.assign(attributeGroup, form);

        attributeGroup.rfqId = this.dataAttrList ? this.dataAttrList.rfqLineAttributeModels[0].rfqId : this.rfqId;
        attributeGroup.rfqPartLineId = this.frmAttributeGroup.get('rfqPartLineId').value;
        attributeGroup.id = this.dataAttrList ? this.dataAttrList.attributeGroupId : '00000000-0000-0000-0000-000000000000';

        this.attributeGroupList.push(attributeGroup);

        if (attributeGroup.id == "00000000-0000-0000-0000-000000000000") {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.attributeGroupService.SaveAttributeGroup([attributeGroup]).subscribe(result => {
                refference.close();
                this.isSaved=false;
                this.isAttributeVisibile=true;
                //console.log(result.data[0].id);
                this.NewGroupId=result.data[0].id;
                this.SaveResult=result.data[0];
                /* this.dialogRef.close();
                this.context && this.context.fetchRfqPartLineAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000); */
            });
        }

        else {
            for (var k = 0; k < this.dataAttrList.rfqLineAttributeModels.length; k++) {
                this.dataAttrList.rfqLineAttributeModels[k].lineAttributeTitle = attributeGroup.title;
                this.dataAttrList.rfqLineAttributeModels[k].lineAttributeName = attributeGroup.name;
                this.dataAttrList.rfqLineAttributeModels[k].lineAttributeGroupName = attributeGroup.groupName;
                this.dataAttrList.rfqLineAttributeModels[k].isAttributeGroupBasicDataSave = true;
            }
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.rfqPartLineAttributeService.savePartLineAttribute(this.dataAttrList.rfqLineAttributeModels).subscribe(result => {
               refference.close();
               this.isSaved=false;
                this.dialogRef.close();
                this.context && this.context.fetchRfqPartLineAttributeData(this.rfqId);
                this.context.message = "Updated";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
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
//
addAttributeItem(){
    this.dialogRef.close();
    //const dialogRef1 = this.dialog.open(AddLineAttributeItemOverlayComponent, { data: { "context": this.context, "rfqId": this.rfqId,"NewListId" :this.NewGroupId } });
    const dialogRef1 = this.dialog.open(AddLineAttributeItemOverlayComponent, { data: { "context": this.context, "rfqId": this.rfqId, partLineId: this.partLineId,NewListId :this.NewGroupId } });
    dialogRef1.addPanelClass('inline-md-overlay');
    dialogRef1.disableClose = true;
    dialogRef1.afterClosed().subscribe(result => {
    });
}
addNewAttributeItem(){
    this.dialogRef.close();
    //const dialogRef1 = this.dialog.open(AddNewLineAttributeOverlayComponent, { data: { "rfqId": this.rfqId, "context": this.context,"NewList" :this.SaveResult} });
    const dialogRef1 = this.dialog.open(AddNewLineAttributeOverlayComponent, { data: { "rfqId": this.rfqId, "context": this.context, rfqPartLineId: this.partLineId ,"NewList" :this.SaveResult} });
    dialogRef1.addPanelClass('inline-md-overlay');
    dialogRef1.disableClose = true;
    dialogRef1.afterClosed().subscribe(result => {
      
    });
}
onNameInput(name: string) {
      
    if(this.editedname==name){
        return;
    }
if (this.names.includes(name)) {
  
    this.frmAttributeGroup.get('title').setErrors({ duplicate: true });
   
    }
 
}

LoadNames(){
  this.attributeGroupService.GetAttributGroupNameList().subscribe(result => {
    this.names = result.data;
});
}
//
}