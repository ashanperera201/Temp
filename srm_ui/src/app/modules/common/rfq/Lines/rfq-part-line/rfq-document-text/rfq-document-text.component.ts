import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AttributeCategory } from 'app/main/Models/etendering/AttributeCategory';
import { Type } from 'app/main/Models/etendering/enum';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { RfqPartLineDocumentTextService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-document-text.service';
import { AddNewLineDocumenttextOverlayComponent } from '../../../add-new-linedocumenttext-overlay/add-new-linedocumenttext-overlay.component';
import { RFQPartLineDocumentTextModel } from 'app/main/Models/etendering/RFQPartLineDocumentTextModel';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

export interface RowData7 {
  docsrno: string;
  outputtype: string;
  documentext: string;
}

@Component({
  selector: 'app-rfq-document-text',
  templateUrl: './rfq-document-text.component.html',
  styleUrls: ['./rfq-document-text.component.scss']
})

export class RfqDocumentTextComponent implements OnInit {
  dataSource7: MatTableDataSource<RowData7>;
  displayedColumn7: string[] = ['id', 'phraseId', 'outputType', 'documentText', 'type3', 'displayToSupplier'];
  attributecategoryData: AttributeCategory[];
  selected: any;
  @Input() RFQID: any;
  @Input() RFQModel: any;
  @Input() RFQPartLineID: any;

  constructor(public dialog: MatDialog, private rfqPartLineDocumentTextService: RfqPartLineDocumentTextService,
    private attributeService: AttributeService) {
  }

  ngOnInit(): void {
    this.getLinesDocumentTexts();
    this.getAttributeListData();
  }

  addDocumentText() {
    const dialogRef = this.dialog.open(AddNewLineDocumenttextOverlayComponent,
      {
        data: {
          type: Type.Lines,
          rfqId: this.RFQID,
          rfqPartLineId: this.RFQPartLineID
        }
      });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.getLinesDocumentTexts();
    });
  }

  editTextDocument(data) {
    const dialogRef = this.dialog.open(AddNewLineDocumenttextOverlayComponent, {
      data: {
        dataKey: data,
        type: Type.Lines,
        rfqId: this.RFQID,
        rfqPartLineId: this.RFQPartLineID
      }
    });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.getLinesDocumentTexts();
    });
  }

  getLinesDocumentTexts() {
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
    this.rfqPartLineDocumentTextService.getRFQPartLinesDocumentTextByRFQPartId(this.RFQID, this.RFQPartLineID).subscribe((data) => {
      refference.close();
      if (data.data.length > 0) {
        this.dataSource7 = data.data;

      } else if (data.data.length === 0) {
        this.dataSource7 = null;
      }
    }, error => {
      console.log(error);
    });
  }

  deleteTextDocument(id) {
    Swal.fire({
      title: 'Remove Document Text',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rfqPartLineDocumentTextService.deleteRFQPartLinesDocumentTexts(id).subscribe((data) => {
          this.getLinesDocumentTexts();
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          )
        });
      }
    })
  }

  getAttributeListData() {
    this.attributeService.getAttributeListData().subscribe((attributeCategory: AttributeCategory[]) => {
      this.attributecategoryData = attributeCategory;
      this.selected = attributeCategory[0].id;
    }, error => {
      console.log(error);
    });
  }

  updateRFQLineDocumentText(model: RFQPartLineDocumentTextModel, typevis) {
    if (typevis == "Cat") {
      model.isCategorySave = true;
    }
    else if (typevis == "Sup") {
      model.isVisibleToSupplierSave = true;
    }

    this.rfqPartLineDocumentTextService.saveLineDocumentText(model).subscribe(result => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1000
      })
    });
  }

}