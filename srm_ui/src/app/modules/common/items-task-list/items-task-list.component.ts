import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PagedRequestDto } from 'app/shared/paged-listing-component-base';
import { DocumentServiceProxy, PagedResultDtoOfDocumentDto, TaskDto, WorkflowHistoryDto, WorkflowSchemeServiceProxy } from 'app/shared/Services/service-proxies';
import { environment } from 'environments/environment.prod';
import moment from 'moment';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface DashboardElement {
  title: string;
  description: string;
  creationTime: string;
  state: string;
  scheme: string;
  processId: number;
  id: number;
}

export interface HistoryElement {
  executorIdentityName: string;
  triggerName: string;
  transitionTime: string;
  from: string;
  to: string;
}


const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];
const ELEMENT_DATA_WORKFLOW: HistoryElement[] = [];

@Component({
  selector: 'items-task_list',
  templateUrl: './items-task-list.component.html',
  styleUrls: ['./items-task-list.component.scss'],
  providers: [
    DatePipe
  ]
})
export class ItemsTaskListComponent implements OnInit {
  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild('tableOneTwoPaginator', { read: MatPaginator }) tableOneTwoPaginator: MatPaginator;
  employees: any[];
  selectedValue: string = 'all';

  dataSource = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  dataSourceHistory = new MatTableDataSource(ELEMENT_DATA_WORKFLOW);
  displayedColumns: string[] = ['title', 'description', 'scheme', 'state'];
  columnsToDisplayDesc: string[] =  ['Supplier Code', 'Supplier Name', 'Criticality', 'Workflow State'];

  displayedHisColumns: string[] = ['executorIdentityName', 'triggerName', 'transitionTime', 'from','to'];
  history: WorkflowHistoryDto[];
  dataSourceDashboardList: any = [];

  code = undefined;
  processid = '';
  apiurl = environment.workflowApiUrl + '/designer/api';
  contentWindow: any;
  wfdesigner: any;
  offsetY = 160;
  documentId: number = null;
  taskTitle: string;
  tasksState: string;
  taskDescription: string;
  hideData: boolean = true;
  tempData: DashboardElement[] = [];

  constructor(private router: Router, private _documentService: DocumentServiceProxy, private datePipe: DatePipe,private _workflowService: WorkflowSchemeServiceProxy) {
  }

  ngOnInit(): void {
    this.list();
    var me = this;
    me.contentWindow = window.frames["designer"].contentWindow;
    me.contentWindow.onload = () => {
      me.wfdesignerRedraw();
      window.onresize = function (event) {
        setTimeout(() => {
          if (me != undefined && me.wfdesigner != undefined) {
            me.wfdesignerRedraw();
          }
        }, 500);
      };
    }

    //this.refresh();
  }


  filltabledata(data: any) {
    if (data) {
      this.dataSourceDashboardList = [];
      for (let element of data)
        this.dataSourceDashboardList.push({
          title: element.title,
          description: element.description,
          creationTime: this.datePipe.transform(element.creationTime, "dd-MMM-yyyy HH:mm"),
          state: element.state,
          scheme: element.scheme,
          processId: element.processId,
          id: element.id
        });

      this.dataSource = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
      this.dataSource.paginator = this.tableOnePaginator;
      this.tempData = this.dataSource.data;
    }
  }

  fillHistorytabledata(data: any) {
    if (data) {
      this.dataSourceDashboardList = [];
      data=data.sort((a,b) => moment(a.transitionTime).valueOf() - moment(b.transitionTime).valueOf())
      for (let element of data)
        this.dataSourceDashboardList.push({
          executorIdentityName: element.executorIdentityName,
          triggerName: element.triggerName,
          transitionTime: this.datePipe.transform(element.transitionTime, "dd-MMM-yyyy HH:mm"),
          from: element.from,
          to: element.to
        });

      this.dataSourceHistory = new MatTableDataSource<HistoryElement>(this.dataSourceDashboardList);
      this.dataSourceHistory.paginator = this.tableOneTwoPaginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.selectedValue == 'all') {
      this.dataSource.data = this.tempData;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource.data = this.tempData;
      var type = this.selectedValue;

      const temp = this.dataSource.data.filter(function (d) {
        var result;
        if(type != "Criticality"){
          if (type == "Supplier Code") { result = d.title.toString(); }
          else if (type == "Supplier Name") { result = d.description.toString(); }
          else if (type == "Workflow State") { result = d.state.toString(); }
          return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue || result.toLowerCase().includes(filterValue);
        }else{
          if (type == "Criticality") { result = d.scheme.toString(); }
          return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue;
        }
       
      });
      this.dataSource.data = temp;
    }
  }

  openRowInfo(selectedDocument) {
    this.processid = selectedDocument.processId;

    this.documentId = selectedDocument.id;

    let data = undefined;
    if (this.wfdesigner != undefined) {
      data = this.wfdesigner.data;
      this.wfdesigner.destroy();
    }

    var designerFrame = document.getElementById("designer");
    if (designerFrame != undefined) {
      designerFrame.style.height = window.innerHeight - this.offsetY + "px";
    }

    this.wfdesigner = new this.contentWindow["WorkflowDesigner"]({
      name: 'simpledesigner',
      apiurl: this.apiurl,
      renderTo: 'wfdesigner',
      imagefolder: '/assets/workflow/images/',
      graphwidth: this.contentWindow.innerWidth,
      graphheight: this.contentWindow.innerHeight
    });

    this._workflowService.getHistories(this.processid).subscribe((result3) => { this.fillHistorytabledata(result3); });


    let isreadonly = false;
    if (this.processid != undefined && this.processid != '')
      isreadonly = true;

    let p = { schemecode: this.code, processid: this.processid, readonly: isreadonly };

    if (this.wfdesigner.exists(p))
      this.wfdesigner.load(p);
    else
      this.wfdesigner.create();

    //this.refresh();
    this.hideData = false;
    this.taskTitle = selectedDocument.title;
    this.tasksState = selectedDocument.state;
    this.taskDescription = selectedDocument.description;

    document.getElementById("designerdiv").scrollIntoView();
  }

  protected list(): void {
    this._documentService.getAll(undefined, undefined, undefined, undefined, 1000)
      .pipe(finalize(() => {
      }))
      .subscribe((result: PagedResultDtoOfDocumentDto) => {
        result.items=result.items.sort((a,b)=>(a.id<b.id)?1:-1)
        this.filltabledata(result.items);
      });
  }

  wfdesignerRedraw() {
    let data = undefined;
    if (this.wfdesigner != undefined) {
      data = this.wfdesigner.data;
      this.wfdesigner.destroy();
    }

    var designerFrame = document.getElementById("designer");
    if (designerFrame != undefined) {
      designerFrame.style.height = window.innerHeight - this.offsetY + "px";
    }

    this.wfdesigner = new this.contentWindow["WorkflowDesigner"]({
      name: 'simpledesigner',
      apiurl: this.apiurl,
      renderTo: 'wfdesigner',
      imagefolder: '/assets/workflow/images/',
      graphwidth: this.contentWindow.innerWidth,
      graphheight: this.contentWindow.innerHeight
    });

    if (data == undefined) {
      let isreadonly = false;
      if (this.processid != undefined && this.processid != '')
        isreadonly = true;

      let p = { schemecode: this.code, processid: this.processid, readonly: isreadonly };

      if (this.wfdesigner.exists(p))
        this.wfdesigner.load(p);
      else
        this.wfdesigner.create();
    }
    else {
      this.wfdesigner.data = data;
      this.wfdesigner.render();
    }
  }
}
