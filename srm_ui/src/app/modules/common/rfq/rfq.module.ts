import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../common/datatable/datatable.module';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { DrawerMiniModule } from '../../common/drawer-mini/drawer-mini.module';
import { RfqComponent } from './rfq.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddCurrencyOverlayComponent } from './add-currency-overlay/add-currency-overlay.component';
import { AddNewAttributeListOverlayComponent } from './add-new-attributelist-overlay/add-new-attribute-list-overlay.component';
import { AddReusableAttributeOverlayComponent } from './add-reusable-attribute-overlay/add-reusable-attribute-overlay.component';
import { AddAttributeItemOverlayComponent } from './add-attribute-item-overlay/add-attribute-item-overlay.component';
import { AddNewAttributeOverlayComponent } from './add-new-attribute-overlay/add-new-attribute-overlay.component';
import { AddNewAttributeOverlay2Component } from './add-new-attribute-overlay2/add-new-attribute-overlay2.component';
import { AddNewAttributeOverlay3Component } from './add-new-attribute-overlay3/add-new-attribute-overlay3.component';
import { AddReusableCostfactorOverlayComponent } from './add-reusable-costfactor-overlay/add-reusable-costfactor-overlay.component';
import { AddNewCostfactorlistOverlayComponent } from './add-new-costfactorlist-overlay/add-new-costfactorlist-overlay.component';
import { AddNewCostfactorOverlayComponent } from './add-new-costfactor-overlay/add-new-costfactor-overlay.component';
import { AddCostfactorItemOverlayComponent } from './add-costfactor-item-overlay/add-costfactor-item-overlay.component';
import { AddNewPaymentschedulesOverlayComponent } from './add-new-paymentschedules-overlay/add-new-paymentschedules-overlay.component';
import { AddTermsOverlayComponent } from './add-terms-overlay/add-terms-overlay.component';
import { AddNewAttachmentOverlayComponent } from './add-new-attachment-overlay/add-new-attachment-overlay.component';
import { AddNewLineAttachmentOverlayComponent } from './add-new-line-attachment-overlay/add-new-line-attachment-overlay.component';
import { AddNewDocumenttextOverlayComponent } from './add-new-documenttext-overlay/add-new-documenttext-overlay.component';
import { AddNewNoteOverlayComponent } from './add-new-note-overlay/add-new-note-overlay.component';
import { AddNewDeliverableOverlayComponent } from './add-new-deliverable-overlay/add-new-deliverable-overlay.component';
import { AddSurveyOverlayComponent } from './add-survey-overlay/add-survey-overlay.component';
import { AddSurveyQuestionOverlayComponent } from './add-survey-question-overlay/add-survey-question-overlay.component';
import { CreateSurveyQuestionOverlayComponent } from './create-survey-question-overlay/create-survey-question-overlay.component';
import { AddSupplierOverlayComponent } from './add-supplier-overlay/add-supplier-overlay.component';
import { AddTeamOverlayComponent } from './add-team-overlay/add-team-overlay.component';
import { AddEditShippingOverlayComponent } from './add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { CopyToLinesOverlayComponent } from './copy-to-lines-overlay/copy-to-lines-overlay.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AwardSelectedOverlayComponent } from './award-selected-overlay/award-selected-overlay.component';
import { AwardRecommendOverlayComponent } from './award-recommend-overlay/award-recommend-overlay.component';
import { RfqPartLineComponent } from './Lines/rfq-part-line/rfq-part-line.component';
import { RFQAttributeItemsComponent } from './Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { RfqCostFactorsComponent } from './Lines/rfq-Part-Line/rfq-cost-factors/rfq-cost-factors.component';
import { RfqPaymentSchedulesComponent } from './Lines/rfq-Part-Line/rfq-payment-schedules/rfq-payment-schedules.component';
import { RfqAttachmentsComponent } from './Lines/rfq-Part-Line/rfq-attachments/rfq-attachments.component';
import { RfqDocumentTextComponent } from './Lines/rfq-Part-Line/rfq-document-text/rfq-document-text.component';
import { RfqNotesComponent } from './Lines/rfq-Part-Line/rfq-notes/rfq-notes.component';
import { RfqDeliverablesComponent } from './Lines/rfq-Part-Line/rfq-deliverables/rfq-deliverables.component';
import { AttributeItemComponent } from './header-component/attribute-item/attribute-item.component';
import { CostFactorsComponent } from './header-component/cost-factors/cost-factors.component';
import { PaymentSchedulesComponent } from './header-component/payment-schedules/payment-schedules.component';
import { TermConditionComponent } from './header-component/term-condition/term-condition.component';
import { AttachmentsComponent } from './header-component/attachments/attachments.component';
import { DocumentTextComponent } from './header-component/document-text/document-text.component';
import { NotesComponent } from './header-component/notes/notes.component';
import { DeliverablesComponent } from './header-component/deliverables/deliverables.component';
import { SurveyFormsComponent } from './header-component/survey-forms/survey-forms.component';
import { SuppliersViewComponent } from './suppliers-view/suppliers-view.component';
import { CollaborationTeamViewComponent } from './collaboration-team-view/collaboration-team-view.component';
import { RulesViewComponent } from './rules-view/rules-view.component';
import { RfqScoringComponent } from './rfq-scoring/rfq-scoring.component';
import { SupplierResponseViewComponent } from './responses/supplier-response-view/supplier-response-view.component';
import { SupplierResponseHeaderViewComponent } from './responses/supplier-response-header-view/supplier-response-header-view.component';
import { SupplierResponseLineViewComponent } from './responses/supplier-response-line-view/supplier-response-line-view.component';
import { SurrogateResponseViewComponent } from './responses/surrogate-response-view/surrogate-response-view.component';
import { SurrogateResponseHeaderViewComponent } from './responses/surrogate-response-header-view/surrogate-response-header-view.component';
import { SurrogateResponseLinesViewComponent } from './responses/surrogate-response-lines-view/surrogate-response-lines-view.component';
import { TechnicalBidEvaluationViewComponent } from './evaluations/technical-bid-evaluation-view/technical-bid-evaluation-view.component';
import { TechnicalBidEvaluationHeaderViewComponent } from './evaluations/technical-bid-evaluation-header-view/technical-bid-evaluation-header-view.component';
import { TechnicalBidEvaluationLineViewComponent } from './evaluations/technical-bid-evaluation-line-view/technical-bid-evaluation-line-view.component';
import { CommercialBidEvaluationViewComponent } from './evaluations/commercial-bid-evaluation-view/commercial-bid-evaluation-view.component';
import { CommercialBidEvaluationHeaderViewComponent } from './evaluations/commercial-bid-evaluation-header-view/commercial-bid-evaluation-header-view.component';
import { CommercialBidEvaluationLineViewComponent } from './evaluations/commercial-bid-evaluation-line-view/commercial-bid-evaluation-line-view.component';
import { ComperativeBidAnalysisComponent } from './evaluations/comperative-bid-analysis/comperative-bid-analysis.component';
import { RfxSummaryComponent } from './evaluations/rfx-summary/rfx-summary.component';
import { RecommendationAwardComponent } from './evaluations/recommendation-award/recommendation-award.component';
import { AddLineReusableCostfactorOverlayComponent } from './add-line-reusable-costfactor-overlay/add-line-reusable-costfactor-overlay.component';
import { AddNewLineCostfactorlistOverlayComponent } from './add-new-line-costfactorlist-overlay/add-new-line-costfactorlist-overlay.component';
import { AddNewLineCostfactorOverlayComponent } from './add-new-line-costfactor-overlay/add-new-line-costfactor-overlay.component';
import { AddLineCostfactorItemOverlayComponent } from './add-line-costfactor-item-overlay/add-line-costfactor-item-overlay.component';
import { AddNewLineDeliverableOverlayComponent } from './add-new-line-deliverable-overlay/add-new-line-deliverable-overlay.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AddNewAttributeOverlay4Component } from './add-new-attribute-overlay4/add-new-attribute-overlay4.component';
import { QuillModule } from 'ngx-quill';
import { AddNewLinePaymentschedulesOverlayComponent } from './add-new-line-paymentschedules-overlay/add-new-line-paymentschedules-overlay.component';
import { AddNewLineDocumenttextOverlayComponent } from './add-new-linedocumenttext-overlay/add-new-linedocumenttext-overlay.component';
import { AddNewPartLineNoteOverlayComponent } from './add-new-part-line-note-overlay/add-new-part-line-note-overlay.component';
import { SignupRoutingModule } from 'app/modules/signup/signup-routing.module';
import { AddLineAttributeItemOverlayComponent } from './add-line-attribute-item-overlay/add-line-attribute-item-overlay.component';
import { AddNewLineAttributeListOverlayComponent } from './add-new-line-attributelist-overlay/add-new-line-attribute-list-overlay.component';
import { AddNewLineAttributeOverlay2Component } from './add-new-line-attribute-overlay2/add-new-line-attribute-overlay2.component';
import { AddNewLineAttributeOverlay3Component } from './add-new-line-attribute-overlay3/add-new-line-attribute-overlay3.component';
import { AddNewLineAttributeOverlay4Component } from './add-new-line-attribute-overlay4/add-new-line-attribute-overlay4.component';
import { AddNewLineAttributeOverlayComponent } from './add-new-line-attribute-overlay/add-new-line-attribute-overlay.component';
import { AddReusableLineAttributeOverlayComponent } from './add-reusable-line-attribute-overlay/add-reusable-line-attribute-overlay.component';
import { EditNewLineAttributeOverlayComponent } from './edit-new-line-attribute-overlay/edit-new-line-attribute-overlay.component';
import { EditNewAttributeOverlayComponent } from './edit-new-attribute-overlay/edit-new-attribute-overlay.component';
import { AddCsvOverlayComponent } from './add-csv-overlay/add-csv-overlay.component';
import { ChatsComponent } from '../../common/chats/chats.component';
import { ApprovalConfirmationOverlayComponent } from './approval-confirmation-overlay/approval-confirmation-overlay.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RejectionConfirmationOverlayComponent } from './rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { AgreementInfoDialogComponent } from 'app/modules/common/rfq/agreement-info-dialog/agreement-info-dialog.component';
import { AddAttrlistItemOverlayComponent } from './add-attrlist-item-overlay/add-atttrlist-item-overlay.component';
import { AddAttrlinelistItemOverlayComponent } from './add-attrlist-line-item-overlay/add-atttrlist-line-item-overlay.component';
import { AddCostfactorNewListOverlayComponent } from './add-costfactor-new-list-overlay/add-costfactor-new-list-overlay.component';
import { ReassignOwnerDialogComponent } from './reassign-owner-dialog/reassign-owner-dialog.component';
import { EditRfqPartLineOverlayComponent } from './Lines/rfq-part-line/edit-rfq-part-line-overlay/edit-rfq-part-line-overlay.component';
import { AddLineCostfactorNewListOverlayComponent } from './add-line-costfactor-new-list-overlay/add-line-costfactor-new-list-overlay.component';
import { RfxTemplatesOverlayComponent } from '../rfx-templates-overlay/rfx-templates-overlay.component';
import { AddCollaborationTeamOverlayComponent } from './add-collabteam-overlay/add-collabteam-overlay.component';
import { AddSupplierListOverlayComponent } from './add-supplier-list-overlay/add-supplier-list-overlay.component';
import { AddEmergencySupllierComponent } from './add-emergency-supllier/add-emergency-supllier.component';
import { ComponentsModule } from 'app/shared/components/components.module';

import { AddAttrHdrItemOverlayComponent } from './add-attr-hdr-item-overlay/add-attr-hdr-item-overlay.component';
import { AddAttrHdrItemOverlay2Component } from './add-attr-hdr-item-overlay2/add-attr-hdr-item-overlay2.component';
import { AddAttrLineItemOverlayComponent } from './add-attr-line-item-overlay/add-attr-line-item-overlay.component';
import { AddAttrLineItemOverlay2Component } from './add-attr-line-item-overlay2/add-attr-line-item-overlay2.component';
import { AddNewLineOverlayComponent } from './add-new-line-overlay/add-new-line-overlay.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AmendBidCloseOverlayComponent } from './amend-bidclose-overlay/amend-bidclose-overlay.component';
const collaborationRoutes: Route[] = [
    {
        path: '',
        component: RfqComponent
    }
];

@NgModule({
    declarations: [
        ChatsComponent,
        AgreementInfoDialogComponent,
        SuppliersViewComponent,
        RfqComponent,
        AddCurrencyOverlayComponent,
        AddNewAttributeListOverlayComponent,
        AddReusableAttributeOverlayComponent,
        AddAttributeItemOverlayComponent,
        AddNewAttributeOverlayComponent,
        AddNewAttributeOverlay2Component,
        AddNewAttributeOverlay3Component,
        AddNewAttributeOverlay4Component,
        AddReusableCostfactorOverlayComponent,
        AddNewCostfactorlistOverlayComponent,
        AddNewCostfactorOverlayComponent,
        AddCostfactorItemOverlayComponent,
        AddNewPaymentschedulesOverlayComponent,
        AddTermsOverlayComponent,
        AddNewAttachmentOverlayComponent,
        AddNewLineAttachmentOverlayComponent,
        AddNewDocumenttextOverlayComponent,
        AddNewLineDocumenttextOverlayComponent,
        AddNewNoteOverlayComponent,
        AddNewDeliverableOverlayComponent,
        AddSurveyOverlayComponent,
        AddSurveyQuestionOverlayComponent,
        CreateSurveyQuestionOverlayComponent,
        AddSupplierOverlayComponent,
        AddTeamOverlayComponent,
        AddEditShippingOverlayComponent,
        CopyToLinesOverlayComponent,
        AwardSelectedOverlayComponent,
        AwardRecommendOverlayComponent,
        RfqPartLineComponent,
        RFQAttributeItemsComponent,
        RfqCostFactorsComponent,
        RfqPaymentSchedulesComponent,
        RfqAttachmentsComponent,
        RfqDocumentTextComponent,
        RfqNotesComponent,
        RfqDeliverablesComponent,
        AwardRecommendOverlayComponent,
        AttributeItemComponent,
        CostFactorsComponent,
        PaymentSchedulesComponent,
        TermConditionComponent,
        AttachmentsComponent,
        DocumentTextComponent,
        NotesComponent,
        DeliverablesComponent,
        SurveyFormsComponent,
        CollaborationTeamViewComponent,
        RulesViewComponent,
        RfqScoringComponent,
        SupplierResponseViewComponent,
        SupplierResponseHeaderViewComponent,
        SupplierResponseLineViewComponent,
        SurrogateResponseViewComponent,
        SurrogateResponseHeaderViewComponent,
        SurrogateResponseLinesViewComponent,
        TechnicalBidEvaluationViewComponent,
        TechnicalBidEvaluationHeaderViewComponent,
        TechnicalBidEvaluationLineViewComponent,
        CommercialBidEvaluationViewComponent,
        CommercialBidEvaluationHeaderViewComponent,
        CommercialBidEvaluationLineViewComponent,
        ComperativeBidAnalysisComponent,
        RfxSummaryComponent,
        RecommendationAwardComponent,
        AddNewLinePaymentschedulesOverlayComponent,
        AddNewLineAttributeListOverlayComponent,
        AddReusableLineAttributeOverlayComponent,
        AddLineAttributeItemOverlayComponent,
        AddNewLineAttributeOverlayComponent,
        AddNewLineAttributeOverlay2Component,
        AddNewLineAttributeOverlay3Component,
        AddNewLineAttributeOverlay4Component,
        EditNewLineAttributeOverlayComponent,
        AddLineReusableCostfactorOverlayComponent,
        AddNewLineCostfactorlistOverlayComponent,
        AddNewLineCostfactorOverlayComponent,
        AddLineCostfactorItemOverlayComponent,
        AddNewLineDeliverableOverlayComponent,
        AddNewLinePaymentschedulesOverlayComponent,
        AddNewPartLineNoteOverlayComponent,
        EditNewAttributeOverlayComponent,
        AddCsvOverlayComponent,
        ApprovalConfirmationOverlayComponent,
        RejectionConfirmationOverlayComponent,
        AddAttrlistItemOverlayComponent,
        AddAttrlinelistItemOverlayComponent,
        ReassignOwnerDialogComponent,
        AddCostfactorNewListOverlayComponent,
        AddLineCostfactorNewListOverlayComponent,
        RfxTemplatesOverlayComponent,
        EditRfqPartLineOverlayComponent,
        AddCollaborationTeamOverlayComponent,
        AddSupplierListOverlayComponent,
        AddEmergencySupllierComponent,
        AddAttrHdrItemOverlayComponent,
        AddAttrHdrItemOverlay2Component,
        AddAttrLineItemOverlayComponent,
        AddAttrLineItemOverlay2Component,
        AddNewLineOverlayComponent,
        AmendBidCloseOverlayComponent
        // ,ChatsComponent
    ],
    imports: [
        RouterModule.forChild(collaborationRoutes),
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatExpansionModule,
        DatatableModule,
        MatIconModule,
        CommonModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        TagsOverlayModule,
        DrawerMiniModule,
        MatDialogModule,
        MatChipsModule,
        MatDatepickerModule,
        MatTabsModule,
        MatRadioModule,
        MatDividerModule,
        MatStepperModule,
        MatSlideToggleModule,
        NgApexchartsModule,
        FuseAlertModule,
        FuseConfirmationModule,
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        SignupRoutingModule,
        MatProgressSpinnerModule,
        QuillModule.forRoot(),
        ComponentsModule,
        MatSnackBarModule
    ],
    providers: [
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}
      ]
})
export class RfqModule {
}
