import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CollaborationTeamSearchModel } from 'app/main/Models/etendering/collaboration-team-search-model';
import { CollaborationTeamService } from 'app/shared/Services/etendering/collaboration-team.service';
import { CollaborationTeamTextViewModel } from 'app/main/Models/etendering/ViewModels/collaboration-team-view-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'add-edit-overlay',
  templateUrl: '../add-edit-overlay/add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddEditOverlayComponent {

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  issuccess = false;
  iserror = false;
  teamList: FormGroup;
  isDelete = false;
  dataId: any = "";
  collaborationTeam: CollaborationTeamTextViewModel[];
  neweditText: string = "Collaboration Team('s) saved successfully";
  isNew: boolean = true;
  overlayTxt = "";
  addNew: boolean = true;
  EditedName:string="";
  names:any[];
  isSaved:boolean =false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog, private fb: FormBuilder, private collaborationTeamService: CollaborationTeamService) {
    this.teamList = this.fb.group({
      collaborationTeamTextViewModels: this.fb.array([])
    });

    this.dataId = this.data.id;
    this.overlayTxt = this.data.overlayTxt;
    this.addNew = this.data.addNew;
  }

  get collaborationTeamTextViewModels(): FormArray {
    return this.teamList.get("collaborationTeamTextViewModels") as FormArray
  }

  newTeam(): FormGroup {
    return this.fb.group({
      'teamName': [null, Validators.required],
      'teamDescription': [null, Validators.required],
      'isPrivate': [null, Validators.required]
    })
  }

  addTeam() {
    if (this.teamList.get('collaborationTeamTextViewModels').invalid) {
      this.teamList.get('collaborationTeamTextViewModels').markAllAsTouched();
      return;
    }
    this.collaborationTeamTextViewModels.push(this.newTeam());
  }

  ngOnInit() {
    this.LoadNames();
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
      this.addTeam();
    }
    else {
      this.collaborationTeamService.getCTById(this.dataId).subscribe(result => {
        this.isDelete = true;
        this.collaborationTeam = [];
        this.collaborationTeam.push(result.data);
        const linesFormArray = this.teamList.get("collaborationTeamTextViewModels") as FormArray;
        linesFormArray.push(this.newTeam());
        this.teamList.patchValue({ "collaborationTeamTextViewModels": this.collaborationTeam });
        if(this.collaborationTeam[0].teamName!=null){
          this.EditedName=this.collaborationTeam[0].teamName
        }
      });
    }
  }

  onFormSubmit(form: NgForm) {
    this.isSaved=true;
    let collaborationTeamSearchModel: CollaborationTeamSearchModel = new CollaborationTeamSearchModel();
    collaborationTeamSearchModel = Object.assign(collaborationTeamSearchModel, form);
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      collaborationTeamSearchModel.collaborationTeamTextViewModels[0].id = this.collaborationTeam[0].id;
    }
    if (!this.isNew) {
      this.neweditText = "Colloboration Team updated successfully";
    }

    this.collaborationTeamService.createEditTeam(collaborationTeamSearchModel.collaborationTeamTextViewModels).subscribe(result => {
      if (result.success == true) {
        Swal.fire({
          icon: 'success',
          title: this.neweditText,
          showConfirmButton: false,
          timer: 1000
        })
      } else {
        Swal.fire({
          title: 'Duplicate Team Names cannot be added',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        })
      }
      this.isSaved=false;
      collaborationTeamSearchModel.collaborationTeamTextViewModels = result;
      this.dialogRef.close();
    });
  }
  

  removeValueAt(index){
    this.collaborationTeamTextViewModels.removeAt(index);
  }


  onFormSubmitt(form: NgForm) {
    let collaborationTeamSearchModel: CollaborationTeamSearchModel = new CollaborationTeamSearchModel();
    collaborationTeamSearchModel = Object.assign(collaborationTeamSearchModel, form);
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      collaborationTeamSearchModel.collaborationTeamTextViewModels[0].id = this.collaborationTeam[0].id;
    }
    this.collaborationTeamService.createEditTeam(collaborationTeamSearchModel.collaborationTeamTextViewModels).subscribe(result => {
      collaborationTeamSearchModel.collaborationTeamTextViewModels = result;
      this.dialogRef.close();
    });
  }

  selectedFormat(event) {
    this.collaborationTeam[0].isPrivate = event.value;
    //this.collaborationTeam[0].attributeValues = this.teamList.get('attributeValues').value;
    this.teamList.patchValue(this.collaborationTeam[0]);
  }

  doAction() {
    this.dialogRef.close();
    // window.location.reload() ;
  }
  onNameInput(name: string,item,) {
      
    if(this.EditedName==name){
      return;
    }

  if (this.names.includes(name)) {
    
    item.get('teamName').setErrors({ duplicate: true });
     
      }
   
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
   let attrcnt=this.collaborationTeamTextViewModels.value.filter(i=>i.teamName==name);
   if(attrcnt.length>1){
    item.get('teamName').setErrors({ duplicate: true });
   }
      }
  }

  LoadNames(){
    this.collaborationTeamService.GetColloborationTeamNameList().subscribe(result => {
      this.names = result.data;
  });
  }
}