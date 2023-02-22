import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RFXRulesViewModel } from 'app/main/Models/etendering/ViewModels/rfx-rules-view-model';
import { RulesService } from 'app/shared/Services/etendering/RFQ/rules.service';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
  selector: 'app-rules-view',
  templateUrl: './rules-view.component.html',
  styleUrls: ['./rules-view.component.scss']
})
export class RulesViewComponent implements OnInit, OnDestroy {

  @Input() displayedColumn14: string[] = ['id', 'headerRules', 'headerTechnical', 'headerCommercial'];
  @Input() displayedColumn15: string[] = ['id', 'group', 'headerTechnical2', 'headerCommercial2'];
  @Input() displayedColumn16: string[] = ['id', 'resRules'];

  @Output() newRulesItemEvent = new EventEmitter<any>();
  @Input() RFQID: any;
  @Input() RFQModel: RFQViewModel;

  rfxRulesViewModel: RFXRulesViewModel;
  actualrfxRulesModels: any = [];

  isChanged = false;

  scoringTabToSuppliers = false;
  showScoringWeightToSuppliers = true;
  showScoringCriteriaToSuppliers = true;

  headerScoringlist = true;
  lineScoringlist = true;

  isTechnicalScoring = true;
  isCommercialScoring = true;

  headerTechnicalScoringlist = true;
  headerCommercialScoringlist = true;

  linesTechnicalScoringlist = true;
  linesCommercialScoringlist = true;

  constructor(public dialog: MatDialog,
    private rulesService: RulesService,
    private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit(): void {
    this.fetchRfqRulesData(this.RFQID);
  }

  ngOnDestroy(): void {
    if (this.RFQModel.isSaveAsDraft && this.isChanged) {
      Swal.fire({
        title: 'You will lose the Unsaved Rule changes',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Ignore changes',
        confirmButtonText: 'Save & Continue',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.SaveRules();
        }
      });
    }
  }

  fetchRfqRulesData(id: string) {
    this.RFQID = id;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
   
    this.rulesService.getRFQHeaderNoteById(this.RFQID).subscribe(result => {
      refference.close();
      this.rfxRulesViewModel = result.data;

      this.isTechnicalScoring = !(this.rfxRulesViewModel.headerScoring);
      this.isCommercialScoring = !(this.rfxRulesViewModel.headerScoring);
      this.headerScoringlist = !(this.rfxRulesViewModel.headerScoring);
      this.lineScoringlist = !(this.rfxRulesViewModel.linesScoring);
      this.headerTechnicalScoringlist = !(this.rfxRulesViewModel.isTechnicalScoring) || !(this.rfxRulesViewModel.headerScoring);
      this.headerCommercialScoringlist = !(this.rfxRulesViewModel.isCommercialScoring) || !(this.rfxRulesViewModel.headerScoring);
      this.linesTechnicalScoringlist = !(this.rfxRulesViewModel.isTechnicalScoring) || !(this.rfxRulesViewModel.linesScoring);
      this.linesCommercialScoringlist = !(this.rfxRulesViewModel.isCommercialScoring) || !(this.rfxRulesViewModel.linesScoring);

      this.showScoringWeightToSuppliers = !(this.rfxRulesViewModel.scoringTabToSuppliers);
      this.showScoringCriteriaToSuppliers = !(this.rfxRulesViewModel.scoringTabToSuppliers);

      this.fireEvent();
    });
  }

  onChange() {
    this.isChanged = true;
    this.fireEvent();
  }

  fireEvent() {
    this.newRulesItemEvent.emit(this.rfxRulesViewModel);
  }

  EnableScoringHeader() {
    if (this.rfxRulesViewModel.headerScoring == true) {
      this.isTechnicalScoring = false;
      this.isCommercialScoring = false;
      this.headerScoringlist = false;
      this.headerCommercialScoringlist = true;
      this.headerTechnicalScoringlist = true;

      if (this.rfxRulesViewModel.isCommercialScoring == true) {
        this.headerCommercialScoringlist = false;
      }
      if (this.rfxRulesViewModel.isTechnicalScoring == true) {
        this.headerTechnicalScoringlist = false;
      }
    } else {
      this.headerScoringlist = true;
      this.headerTechnicalScoringlist = true;
      this.headerCommercialScoringlist = true;

      if (this.rfxRulesViewModel.linesScoring == false) {
        this.isTechnicalScoring = true;
        this.isCommercialScoring = true;
        this.rfxRulesViewModel.isTechnicalScoring = false;
        this.rfxRulesViewModel.isCommercialScoring = false;
      }
    }
    this.isChanged = true;
    this.fireEvent();
  }

  EnableScoringLines() {
    if (this.rfxRulesViewModel.linesScoring == true) {
      this.isTechnicalScoring = false;
      this.isCommercialScoring = false;
      this.lineScoringlist = false;
      this.linesTechnicalScoringlist = true;
      this.linesCommercialScoringlist = true;
      if (this.rfxRulesViewModel.isCommercialScoring == true) {
        this.linesCommercialScoringlist = false;
      }
      if (this.rfxRulesViewModel.isTechnicalScoring == true) {
        this.linesTechnicalScoringlist = false;
      }
    } else {
      this.lineScoringlist = true;
      this.linesTechnicalScoringlist = true;
      this.linesCommercialScoringlist = true;

      if (this.rfxRulesViewModel.headerScoring == false) {
        this.isTechnicalScoring = true;
        this.isCommercialScoring = true;
        this.rfxRulesViewModel.isTechnicalScoring = false;
        this.rfxRulesViewModel.isCommercialScoring = false;
      }
    }
    this.isChanged = true;
    this.fireEvent();
  }

  HeaderTechnical() {
    if (this.rfxRulesViewModel.isTechnicalScoring == false) {
      this.headerTechnicalScoringlist = true;
      this.linesTechnicalScoringlist = true;
    } else {
      if (this.rfxRulesViewModel.headerScoring == true) {
        this.headerTechnicalScoringlist = false;
      }
      if (this.rfxRulesViewModel.linesScoring == true) {
        this.linesTechnicalScoringlist = false;
      }
    }
    this.isChanged = true;
    this.fireEvent();
  }

  HeaderCommercial() {
    if (this.rfxRulesViewModel.isCommercialScoring == false) {
      this.headerCommercialScoringlist = true;
      this.linesCommercialScoringlist = true;
    } else {
      if (this.rfxRulesViewModel.headerScoring == true) {
        this.headerCommercialScoringlist = false;
      }

      if (this.rfxRulesViewModel.linesScoring == true) {
        this.linesCommercialScoringlist = false;
      }
    }
    this.isChanged = true;
    this.fireEvent();
  }

  EnableScoringTab() {
    if (this.rfxRulesViewModel.scoringTabToSuppliers == true) {
      this.showScoringWeightToSuppliers = false;
      this.showScoringCriteriaToSuppliers = false;
    } else {
      this.showScoringWeightToSuppliers = true;
      this.showScoringCriteriaToSuppliers = true;
      this.rfxRulesViewModel.showScoringCriteriaToSuppliers = false;
      this.rfxRulesViewModel.showScoringWeightToSuppliers = false;
    }

    this.isChanged = true;
    this.fireEvent();
  }

  SaveRules() {
    this.rulesService.SaveRules(this.rfxRulesViewModel).subscribe(result => {
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: "Changes saved successfully",
        showConfirmButton: false,
        timer: 1000
      })
      this.isChanged = false;
    });
  }

}
