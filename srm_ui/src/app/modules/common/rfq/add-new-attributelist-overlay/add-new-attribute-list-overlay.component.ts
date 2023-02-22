import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { AddAttributeItemOverlayComponent } from '../add-attribute-item-overlay/add-attribute-item-overlay.component';
import { AddNewAttributeOverlayComponent } from '../add-new-attribute-overlay/add-new-attribute-overlay.component';

@Component({
    selector: 'add-att-list-overlay',
    templateUrl: './add-new-attribute-list-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewAttributeListOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    dataAttrList: any;
    rfqId: string;
    frmAttributeGroup: FormGroup;
    attributeGroupList: any = [];
    context: AttributeItemComponent;
    labelstring:string;
    isAttributeVisibile:boolean=false;
    NewGroupId="";
    SaveResult:any;
    names:any[];
    isduplicateError:false;
    editedname:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddNewAttributeListOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private attributeGroupService: AttributeGroupService,
        private rfqHeaderAttributeService: RfqHeaderAttributeService
    ) {
        this.dataAttrList = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;
        this.labelstring=data.label;
      
        this.frmAttributeGroup = this.fb.group({
            'title': [this.dataAttrList ? this.dataAttrList.title : null, Validators.required],
            'name': [this.dataAttrList ? this.dataAttrList.name : null, Validators.required],
            'groupName': [this.dataAttrList ? this.dataAttrList.group : null, Validators.required],
            'rfqId': this.dataAttrList ? this.dataAttrList.rfqHeaderAttributeModels[0].rfxId : this.rfqId
        });
        //console.log(data)
         if(data==null){
            this.editedname=this.dataAttrList.title;
        } 
        this.LoadNames();
    }

    onFormSubmit(form: NgForm) {
        this.isSaved=true;
        if (this.frmAttributeGroup.valid) {
        let attributeGroup: AttributeGroupViewModel = new AttributeGroupViewModel();
        attributeGroup = Object.assign(attributeGroup, form);
        attributeGroup.rfqId = this.dataAttrList ? this.dataAttrList.rfqHeaderAttributeModels[0].rfxId : this.rfqId;
        attributeGroup.id = this.dataAttrList ? this.dataAttrList.attributeGroupId : '00000000-0000-0000-0000-000000000000';

        this.attributeGroupList.push(attributeGroup);

        if (attributeGroup.id == "00000000-0000-0000-0000-000000000000") {
           
            this.attributeGroupService.SaveAttributeGroup([attributeGroup]).subscribe(result => {
                this.isSaved=false;
                this.isAttributeVisibile=true;
                //console.log(result.data[0].id);
                this.NewGroupId=result.data[0].id;
                this.SaveResult=result.data[0];
                //this.dialogRef.close();
               /*  this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 1000); */
            });
        }

        else {
            for (var k = 0; k < this.dataAttrList.rfqHeaderAttributeModels.length; k++) {
                this.dataAttrList.rfqHeaderAttributeModels[k].headerAttributeTitle = attributeGroup.title;
                this.dataAttrList.rfqHeaderAttributeModels[k].headerAttributeName = attributeGroup.name;
                this.dataAttrList.rfqHeaderAttributeModels[k].headerAttributeGroupName = attributeGroup.groupName;
                this.dataAttrList.rfqHeaderAttributeModels[k].isAttributeGroupBasicDataSave = true;
            }
            //this.isSaved=true;
            this.rfqHeaderAttributeService.saveHeaderAttribute(this.dataAttrList.rfqHeaderAttributeModels).subscribe(result => {
                this.isSaved=false;
                this.dialogRef.close();
                this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Updated";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 1000);
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
        const dialogRef1 = this.dialog.open(AddAttributeItemOverlayComponent, { data: { "context": this.context, "rfqId": this.rfqId,"NewListId" :this.NewGroupId } });
        dialogRef1.addPanelClass('inline-md-overlay');
        dialogRef1.disableClose = true;
        dialogRef1.afterClosed().subscribe(result => {
        });
    }
    addNewAttributeItem(){
        this.dialogRef.close();
        const dialogRef1 = this.dialog.open(AddNewAttributeOverlayComponent, { data: { "rfqId": this.rfqId, "context": this.context,"NewList" :this.SaveResult} });
        dialogRef1.addPanelClass('inline-md-overlay');
        dialogRef1.disableClose = true;
        dialogRef1.afterClosed().subscribe(result => {
          
        });
    }
    //
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
}