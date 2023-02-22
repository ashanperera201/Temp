import { Component, Inject, ViewChild, ViewEncapsulation,ElementRef } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NegotiationStyleService } from 'app/shared/Services/etendering/negotiation-style.service';
import { NegotiationStyleSearchModel } from 'app/main/Models/etendering/negotiation-style-search-model';
import { NegotiationStyleViewModel } from 'app/main/Models/etendering/ViewModels/negotiation-style-view-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';
import { RFQExportModel,RFQLineExportModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';

// import jspdf from 'jspdf';
import { read, utils, writeFile } from 'xlsx';

export interface RowData {
    id: string;
    group: string;
    objKey: string;
    visibility: string;
}

export class CsvData {
    public Award_Date    : any;
    public Award_Date_Time: any;
    public Bid_Closing_Date_Time: any;
    public City: any;
    public CsvLineData:any[];
}


export class CsvLineData {
    public Line_No    : any;
    public PR_No: any;
    public Part_ID: any;
    public UoM: any;
}

@Component({
    selector: 'add-csv-overlay',
    templateUrl: './add-csv-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddCsvOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'group', 'visibility'];

    headerDataSource: any=[];
    lineDataSource: any=[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('file')
    fileImport: ElementRef;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
       isDelete = false;
    negotiationList : FormGroup;
    negotiationStyle: NegotiationStyleViewModel[];
    bidingStyles: any[];
    dataId: any = "";
    fileToUpload: any;
    headerMap = new Map();
    lineMap = new Map();
    rfqId: string;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddCsvOverlayComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private negotiationStyleService: NegotiationStyleService,
    private rfqService: RfqService
    ) {
        this.negotiationList = this.fb.group({  
            negotiationStyleModels: this.fb.array([])
          });  
          this.dataId = this.data.id;
    }

    ngOnInit() {
        
    }
    public records: any[] = [];
    check(file) {
        return (file.name.indexOf('xls') > -1 || file.name.indexOf('xlsx') > -1 || file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }

    public uploadFile = ($event) => {
        
        if($event.currentTarget.files)
        {
            if($event.currentTarget.files.length>0)
            {
                if (this.check(<File>$event.currentTarget.files[0])) //check is you function to check extension 
                { 
                    Swal.fire({
                        icon: 'success',
                        position:"center",
                        title: 'success',
                        html: "success"
                    }).then((result) => {
                        
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            const file = $event.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event: any) => {
                                const wb = read(event.target.result);
                                const sheets = wb.SheetNames;

                                if (sheets.length) {
                                    debugger;
                                    let rfqInformationRows:any = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                                    let structuredRFQInformation:any=[];
                                    for (var i = 0; i < rfqInformationRows.length; i++) {
                                        let rfqViewModel:RFQExportModel=new RFQExportModel();
                                        rfqViewModel.rfqName=rfqInformationRows[i]["Name"];
                                        rfqViewModel.awardedOn=new Date(rfqInformationRows[i]["Award Date Time"]);
                                        rfqViewModel.eventOnAwardDate=new Date(rfqInformationRows[i]["Award Date"]);
                                        rfqViewModel.bidClosingDate=new Date(rfqInformationRows[i]["Bid Closing Date Time"]);
                                        rfqViewModel.bidOpeningDate=new Date(rfqInformationRows[i]["Bid Opening Date Time"]);
                                        rfqViewModel.biddingStyleName=rfqInformationRows[i]["Bidding Style"];
                                        rfqViewModel.cityName=rfqInformationRows[i]["City"];
                                        rfqViewModel.countryName=rfqInformationRows[i]["Country"];
                                        rfqViewModel.deliveryAddressID=rfqInformationRows[i]["Delivery Address"];
                                        rfqViewModel.deliveryTermsName=rfqInformationRows[i]["Delivery Terms"];
                                        rfqViewModel.rfqDescription=rfqInformationRows[i]["Description"];
                                        rfqViewModel.estimatedAmount=rfqInformationRows[i]["Estimated Amount"];
                                        rfqViewModel.negotiationStyleName=rfqInformationRows[i]["Negotiation Style"];
                                        rfqViewModel.outcomeName=rfqInformationRows[i]["Outcome"];

                                        rfqViewModel.paymentTermName=rfqInformationRows[i]["Payment Term"];
                                        rfqViewModel.previewDate=new Date(rfqInformationRows[i]["Preview Date"]);
                                        rfqViewModel.programIDName=rfqInformationRows[i]["Program ID"];
                                        rfqViewModel.projectName=rfqInformationRows[i]["Project Code"];
                                        rfqViewModel.projectTypeName=rfqInformationRows[i]["Project Type"];
                                        rfqViewModel.publishDate ==new Date(rfqInformationRows[i]["Publish Date Time"]);
                                        rfqViewModel.shipViaCodeName=rfqInformationRows[i]["Ship Via Code"];
                                        rfqViewModel.siteName =rfqInformationRows[i]["Site"];
                                        rfqViewModel.timeZoneName=rfqInformationRows[i]["Time Zone"];
                                        structuredRFQInformation.push(rfqViewModel);
                                       
                                    }
                                    // rfqInformationRows["Lines"]=[];
                                   console.log(rfqInformationRows);
                                   if(rfqInformationRows.length && sheets.length>1)
                                   {
                                    const linesRows = utils.sheet_to_json(wb.Sheets[sheets[1]]);
                                    for (var i = 0; i < structuredRFQInformation.length; i++) {
                                        let newArray:any[] = linesRows.filter(function (el)
                                        {
                                        return el["RFQ Name"] ==structuredRFQInformation[i].rfqName;
                                        }
                                        );
                                        if(newArray)
                                        {
                                            let structuredRFQLineInformation:any=[];
                                            for (var k = 0; k < newArray.length; k++) {
                                                let rfqLineModel:RFQLineExportModel=new RFQLineExportModel();
                                                rfqLineModel.rfqName=newArray[k]["RFQ Name"];
                                                rfqLineModel.LineNo=newArray[k]["Line No"];
                                                rfqLineModel.PRNo=newArray[k]["PR No"];
                                                rfqLineModel.PartID=newArray[k]["Part ID"];
                                                rfqLineModel.SubProjectCode=newArray[k]["Sub Project Code"];
                                                rfqLineModel.Activity =newArray[k]["Activity"];
                                                rfqLineModel.PartDescription=newArray[k]["Part Description"];
                                                rfqLineModel.Quantity =newArray[k]["Quantity"];
                                                rfqLineModel.IFSReferncePrice=newArray[k]["IFS Refernce Price"];

                                                rfqLineModel.TargetPrice =newArray[k]["Target Price"];
                                                rfqLineModel.UoM=newArray[k]["UoM"];
                                                rfqLineModel.NeedByDate =new Date(newArray[k]["Need By Date"]);
                                                rfqLineModel.ShowPrices=newArray[k]["Show Prices"];
                                                structuredRFQLineInformation.push(rfqLineModel);
                                            }
                                            structuredRFQInformation[i].Lines=structuredRFQLineInformation;
                                        }
                                        console.log(newArray);
                                        structuredRFQInformation[i].Lines=newArray;
                                    }
                                    console.log(rfqInformationRows);
this.rfqService.validateRFQ(structuredRFQInformation).subscribe((response) => {
    debugger;
});;
                                   }
                                    
                                }
                            }
                            reader.readAsArrayBuffer(file);
                        } 
                      });
                 }
                else { 
                    
                    Swal.fire({
                        icon: 'error',
                        position:"center",
                        title: 'Error',
                        html: "Invalid file type"
                    }).then((result) => {
                        debugger;
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            this.resetUpload();
                        } 
                      });
                 }
            }
        }
    }
    getHeaderArray(csvRecordsArr: any) {
        let headers = (csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
          headerArray.push(headers[j]);
        }
        return headerArray;
      }
      getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];
    //csvRecordsArray.length
        // for (let i = 1; i < 30; i++) {
        //   let curruntRecord = (csvRecordsArray[i]).split(',');
        //   if (curruntRecord.length == headerLength) {
        //     let csvRecord: CsvData = new CsvData();
        //     csvRecord.id = curruntRecord[0].trim();
        //     csvRecord.min = curruntRecord[1].trim();
        //     csvRecord.max = curruntRecord[2].trim();
        //     csvRecord.score = curruntRecord[3].trim();
        //     csvArr.push(csvRecord);
        //   }
        // }
        return csvArr;
      }

    resetUpload() {
        console.log(this.fileImport.nativeElement.files);
        this.fileImport.nativeElement.value = "";
        console.log(this.fileImport.nativeElement.files);
    }

    uploadDocument(){
        this.rfqService.uploadAssetList(this.fileToUpload).subscribe((id) =>{
            this.rfqId = id;
           this.dialogRef.close(this.rfqId);
        }, error => {
            console.log(error);
           this.dialogRef.close(null);

        });
    }
    doAction() {
        this.dialogRef.close(this.rfqId);
    }
    

}