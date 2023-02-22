import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-responces',
  templateUrl: './responces.component.html',
  styleUrls: ['./responces.component.scss']
})
export class ResponcesComponent implements OnInit {

  @Input() data_SampleAttribute;
  @Input() data_SampleCostFactors;
  @Input() data_SamplePaymentSchedule;
  @Input() columns_Attributes;
  @Input() columns_AttributeItem;
  @Input() columns_SupplierResponces;
  @Input() displayedColumns_AttributeItem;
  @Input() displayedColumns_Attributes;
  @Input() displayedColumns_SupplierResponces;
  @Input() columns_CostFactors;
  @Input() displayedColumns_CostFactors;
  @Input() columns_CostFactorItems;
  @Input() displayedColumns_CostFactorItems;
  @Input() columns_CostFactorbySuppliers;
  @Input() displayedColumns_columns_CostFactorbySuppliers;
  @Input() columns_SupplierResponces1;
  @Input() displayedColumns_SupplierResponces1;
  @Input() columns_SupplierResponces2;
  @Input() displayedColumns_SupplierResponces2;
  @Input() displayedColumns_PaymentSchedule;
  @Input() columns_PaymentSchedulebySuppliers;
  @Input() columns_PaymentSchedule;
  @Input() displayedColumns_PaymentSchedulebySuppliers;
  @Input() displayedColumns_Responces1;
  @Input() displayedColumns_Responces2;
  @Input() columns_Responces1;
  @Input() columns_Responces2;
  @Input() data_SampleAttachments;
  @Input() data_SampleDocument;
  @Input() data_SampleNotes;
  @Input() displayedColumns_Attachments;
  @Input() columns_Attachments;
  @Input() displayedColumns_AttachmentResponces;
  @Input() columns_AttachmentResponces;
  @Input() displayedColumns_Documents;
  @Input() columns_Document;
  @Input() displayedColumns_DocumentResponces;
  @Input() columns_DocumentResponces;
  @Input() displayedColumns_Notes;
  @Input() columns_Notes;
  @Input() displayedColumns_NotesResponces;
  @Input() columns_NotesResponces;
  @Input() data_SampleDeliverables;
  @Input() displayedColumns_Deliverables;
  @Input() columns_Deliverables;
  @Input() displayedColumns_DeliverablesbySuppliers;
  @Input() columns_DeliverablesbySuppliers;
  @Input() displayedColumns_DeliverableResponces1;
  @Input() columns_DeliverableResponces1;
  @Input() displayedColumns_DeliverableResponces2;
  @Input() columns_DeliverableResponces2;
  @Input() Supplier_Responses_data;
 
  constructor() {
   }

  ngOnInit(): void {
  
  }

}
