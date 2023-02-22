/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';


interface Generals {
  title: string;
  value: string;
  formName: string;
}

export interface ReviewData {
  supplier: string;
  reviewerName: string;
  finalScore: string;
}

export interface Questions {
  no: string;
  questions: string;
  name1: string;
  name2: string;
  name3: string;
  average: string;
  score: string;
}

export interface BlockSupplier {
  supplierName: string;
  supplierID: string;
  reason: string;
}

export interface Approvals {
  authorizerID: string;
  authorizerName: string;
  email: string;
  approvalStatus: string;
  authorizationRules: string;
}

export interface ApprovalHistory {
  formID: string;
  formName: string;
  approverName: string;
  status: string;
  dateTimestamp: string;
  comments: string;
}

const REVIEWDATA: ReviewData[] = [
  { reviewerName: 'John Doe', supplier: 'ZXY Corporation', finalScore: '73%' },
  { reviewerName: 'M Sheshad', supplier: 'ZXY Corporation', finalScore: '46%' },
  { reviewerName: 'M Felix', supplier: 'ZXY Corporation', finalScore: '30%' },
];

const QUESTIONDATA: Questions[] = [
  { no: '1', questions: 'Management & Administration (Communication and Interaction)', name1: '5', name2: '5', name3: '5', average: '5', score: '4' },
  { no: '2', questions: 'Project Controls (Achieving deliverables in timely manner)', name1: '4', name2: '4', name3: '4', average: '4', score: '3' },
  { no: '3', questions: 'Human Resources (Adequate and competent manpower). ', name1: '3', name2: '3', name3: '3', average: '3', score: '3' },
  { no: '4', questions: 'Equipment & Facility. ', name1: '4', name2: '4', name3: '4', average: '4', score: '5' },
  { no: '5', questions: 'Safety ', name1: '4', name2: '4', name3: '4', average: '4', score: '5' },
  { no: '6', questions: 'Quality ', name1: '4', name2: '4', name3: '4', average: '4', score: '5' },

];

const BLOCKSUPPLIERDATA: BlockSupplier[] = [
  { supplierName: 'ZXY Corporation', supplierID: 'SID1', reason: 'Low Score' },
  { supplierName: ' 2. ABC Corporation', supplierID: 'SID1', reason: 'Low Score' },
];

const APPROVALSDATA: Approvals[] = [
  { authorizerID: 'ID 01', authorizerName: 'Manager01', email: 'managaer01@gmail.com', approvalStatus: 'Approved', authorizationRules: 'R2' },
  { authorizerID: 'ID 02', authorizerName: 'Manager02', email: 'managaer02@gmail.com', approvalStatus: 'Approved', authorizationRules: 'R2' },
  { authorizerID: 'ID 03', authorizerName: 'Manager03', email: 'managaer03@gmail.com', approvalStatus: 'Approved', authorizationRules: 'R2' },
  { authorizerID: 'ID 04', authorizerName: 'Manager04', email: 'managaer04@gmail.com', approvalStatus: 'Approvals Pending', authorizationRules: 'R2' },

];

const APPROVALSHISTORYDATA: ApprovalHistory[] = [
  { formID: 'ID 01', formName: 'SR review form', approverName: 'Manager01', status: 'Approved', dateTimestamp: 'R2', comments: 'Ok' },
  { formID: 'ID 02', formName: 'SR review form', approverName: 'Manager02', status: 'Approved', dateTimestamp: 'R2', comments: 'OK and Please Proceed' },
  { formID: 'ID 03', formName: 'SR review form', approverName: 'Manager03', status: 'Approved', dateTimestamp: 'R2', comments: 'Approved' },
  { formID: 'ID 04', formName: 'SR review form', approverName: 'Manager04', status: 'Review', dateTimestamp: 'R2', comments: '' },

];

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  colors: string[];
  states: ApexStates;
  data: any;
};

@Component({
  selector: 'app-performance-evaluation',
  templateUrl: './performance-evaluation.component.html',
  styleUrls: ['./performance-evaluation.component.scss']
})
export class PerformanceEvaluationComponent implements OnInit {

  types: any[] = ['1', '2'];
  generals: Generals[] = [
    { title: 'Evaluation ID', value: 'EID 165347', formName: 'evaluationID' },
    { title: 'Evaluation Name', value: 'FID 0123456', formName: 'evaluationName' },
    { title: 'Requested By', value: 'Draft', formName: 'requestedBy' },
    { title: 'Initiation Date', value: '23/12/2021', formName: 'initiationDate' },
    { title: 'Publish Date', value: '23/12/2021', formName: 'publishDate' },
  ];

  selectedSupplier: string = 'ZXY Corporation';
  timePeriod: string = '2021 Second Half ( Jul - Dec)';
  userForm: FormGroup;

  columns = [
    {
      columnDef: 'reviewerName',
      header: 'Reviewer name',
      cell: (element: ReviewData) => `${element.reviewerName}`,
    },
    {
      columnDef: 'supplier',
      header: 'Supplier',
      cell: (element: ReviewData) => `${element.supplier}`,
    },
    {
      columnDef: 'finalScore',
      header: 'Final Score',
      cell: (element: ReviewData) => `${element.finalScore}`,
    }
  ];
  dataSource = REVIEWDATA;
  displayedColumns = this.columns.map(c => c.columnDef);

  questionColumns = [
    {
      columnDef: 'no',
      header: '',
      cell: (element: Questions) => `${element.no}`,
    },
    {
      columnDef: 'questions',
      header: 'Questions',
      cell: (element: Questions) => `${element.questions}`,
    },
    {
      columnDef: 'name1',
      header: 'John Doe',
      cell: (element: Questions) => `${element.name1}`,
    },
    {
      columnDef: 'name2',
      header: 'M Sheshad',
      cell: (element: Questions) => `${element.name2}`,
    },
    {
      columnDef: 'name3',
      header: 'M Felix',
      cell: (element: Questions) => `${element.name3}`,
    },
    {
      columnDef: 'average',
      header: 'Average',
      cell: (element: Questions) => `${element.average}`,
    },
    {
      columnDef: 'score',
      header: 'SRM Analyst Score',
      cell: (element: Questions) => `${element.score}`,
    },
  ];
  questionSource = QUESTIONDATA;
  displayedQuestionColumns = this.questionColumns.map(c => c.columnDef);

  blockSupplierColumns = [
    {
      columnDef: 'supplierName',
      header: 'Supplier name',
      cell: (element: BlockSupplier) => `${element.supplierName}`,
    },
    {
      columnDef: 'supplierID',
      header: 'Supplier ID',
      cell: (element: BlockSupplier) => `${element.supplierID}`,
    },
    {
      columnDef: 'reason',
      header: 'Reason',
      cell: (element: BlockSupplier) => `${element.reason}`,
    }
  ];
  blockSupplierSource = BLOCKSUPPLIERDATA;
  displayedBlockSupplierColumns = this.blockSupplierColumns.map(c => c.columnDef);

  approvalsColumns = [
    {
      columnDef: 'authorizerID',
      header: 'Authorizer ID',
      cell: (element: Approvals) => `${element.authorizerID}`,
    },
    {
      columnDef: 'authorizerName',
      header: 'Authorizer Name',
      cell: (element: Approvals) => `${element.authorizerName}`,
    },
    {
      columnDef: 'email',
      header: 'Email Address',
      cell: (element: Approvals) => `${element.email}`,
    },
    {
      columnDef: 'approvalStatus',
      header: 'Approval Status',
      cell: (element: Approvals) => `${element.approvalStatus}`,
    },
    {
      columnDef: 'authorizationRules',
      header: 'Authorization Rules',
      cell: (element: Approvals) => `${element.authorizationRules}`,
    }
  ];
  approvalsSource = APPROVALSDATA;
  displayedApprovalsColumns = this.approvalsColumns.map(c => c.columnDef);

  approvalHistoryColumns = [
    {
      columnDef: 'formID',
      header: 'Form ID',
      cell: (element: ApprovalHistory) => `${element.formID}`,
    },
    {
      columnDef: 'formName',
      header: 'Form Name',
      cell: (element: ApprovalHistory) => `${element.formName}`,
    },
    {
      columnDef: 'approverName',
      header: 'Approver Name',
      cell: (element: ApprovalHistory) => `${element.approverName}`,
    },
    {
      columnDef: 'status',
      header: 'Status',
      cell: (element: ApprovalHistory) => `${element.status}`,
    },
    {
      columnDef: 'dateTimestamp',
      header: 'Authorization Rules',
      cell: (element: ApprovalHistory) => `${element.dateTimestamp}`,
    },
    {
      columnDef: 'comments',
      header: 'Comments',
      cell: (element: ApprovalHistory) => `${element.comments}`,
    }
  ];
  approvalHistorySource = APPROVALSHISTORYDATA;
  displayedApprovalHistoryColumns = this.approvalHistoryColumns.map(c => c.columnDef);

  headers = ['Recommendations', 'John Doe', 'M Sheshad', 'M Felix', 'Average'];
  contents = [
    {
      questions: '1. I strongly endorse this contractor for future work', data: [
        { status: 'yes', recommended: 'Recommended' },
        { status: 'yes', recommended: 'Recommended' },
        { status: 'yes', recommended: 'Recommended' },
        { status: '03-yes', recommended: '00-No' },
      ]
    },
    {
      questions: '2. I would accept this contractor for future work', data: [
        { status: 'yes', recommended: 'Recommended' },
        { status: 'yes', recommended: 'Recommended' },
        { status: 'yes', recommended: 'Recommended' },
        { status: '03-yes', recommended: '00-No' },
      ]
    },
  ];

  public chartOptionsRanks: Partial<ChartOptions>;
  public charts: Partial<ChartOptions>;
  xData: number[] = [30.222222222, 40, 35, 50, 49, 60, 70, 91, 125];
  yData: number[] = [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];

  questionCharts: any[] = [
    {
      question: 'Question 01', data: [{ name: 'John doe1', value: 1001.1111111 }, { name: 'M Sheshad1', value: 2001 }, { name: 'M flex1', value: 3001 }]
    },
    {
      question: 'Question 02', data: [{ name: 'John doe2', value: 1002 }, { name: 'M Sheshad2', value: 2002 }, { name: 'M flex2', value: 3002 }]
    },
    {
      question: 'Question 03', data: [{ name: 'John doe3', value: 1003 }, { name: 'M Sheshad3', value: 2003 }, { name: 'M flex3', value: 3003 }]
    },
    {
      question: 'Question 04', data: [{ name: 'John doe4', value: 1004 }, { name: 'M Sheshad4', value: 2004 }, { name: 'M flex4', value: 3004 }]
    },
    {
      question: 'Question 05', data: [{ name: 'John doe5', value: 1005 }, { name: 'M Sheshad5', value: 2005 }, { name: 'M flex5', value: 3005 }]
    },
    {
      question: 'Question 06', data: [{ name: 'John doe6', value: 1006 }, { name: 'M Sheshad6', value: 2006 }, { name: 'M flex6', value: 3006 }]
    },
    {
      question: 'Question 07', data: [{ name: 'John doe7', value: 1007 }, { name: 'M Sheshad7', value: 2007 }, { name: 'M flex7', value: 3007 }]
    },

  ];

  chart: any = [];
  chartValue: any = [];
  question: any = [];
  allCharts: any = [];

  apps = ['SRM Analyst', 'HSEQ Officer', 'General Manager', 'Vice President'];
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {

    this.userForm = new FormGroup({});
    this.generals.forEach((element): void => {
      this.userForm.addControl(element.formName.toString(), new FormControl());
    });
    console.log(this.userForm.value);

    let chart = [];
    let chartValue = [];
    const question = [];
    const filter = [];
    this.questionCharts.forEach((element, i) => {

      filter[i] = element.data;

      question.push(element?.question);
      this.question = question;
    });

    for (let index = 0; index < filter.length; index++) {
      const el = filter[index];

      for (let i = 0; i < el.length; i++) {
        chart.push(el[i].name);
        chartValue.push(el[i].value);
      }

      this.chart[index] = chart;
      this.chartValue[index] = chartValue;

      chart = [];
      chartValue = [];

    }

    for (let index = 0; index < this.questionCharts.length; index++) {
      this.charts = {
        states: {
          normal: {
            filter: {
              type: 'none',
              value: 0,
            }
          },
          hover: {
            filter: {
              type: 'darken',
              value: 0.2,
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none',
              value: 0,
            }
          },
        },
        series: [
          {
            name: 'Total Score',
            data: this.chartValue[index]
          },
        ],
        chart: {
          height: 300,
          type: 'bar',
          toolbar: {
            show: false
          },
          animations: {
            enabled: false
          }
        },
        fill: {
          type: 'solid',
          opacity: 1,
          colors: [
            '#0FA60C',
            '#438AFE',
            '#958F02',
          ],
        },

        plotOptions: {
          bar: {
            columnWidth: '40%',
            distributed: true,
            dataLabels: {
              position: 'top' // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + '';
          },
          offsetY: -20,
          offsetX: 0,
          style: {
            fontSize: '12px',
            colors: ['#464A53']
          }
        },
        legend: {
          show: false
        },
        grid: {
          show: false
        },
        yaxis: {
          title: {
            text: 'Total Score'
          }
        },
        xaxis: {
          categories: this.chart[index],
          title: {
            text: this.question[index],
          },
          labels: {
            style: {
              colors: [
                '#464A53',
              ],
              fontSize: '12px'
            }
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + '';
            }
          }
        }
      };

      this.allCharts.push(this.charts);
    }


    this.chartOptionsRanks = {
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'darken',
            value: 0.2,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          }
        },
      },
      series: [
        {
          name: 'Total Score',
          data: this.xData
        },
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: {
          show: false
        },
        animations: {
          enabled: false
        }
      },
      fill: {
        type: 'solid',
        opacity: 1,
        colors: [
          '#0FA60C',
          '#438AFE',
          '#958F02',
        ],
      },

      plotOptions: {
        bar: {
          columnWidth: '40%',
          distributed: true,
          dataLabels: {
            position: 'top' // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '';
        },
        offsetY: -20,
        offsetX: 0,
        style: {
          fontSize: '12px',
          colors: ['#464A53']
        }
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      yaxis: {
        title: {
          text: 'Total Score'
        }
      },
      xaxis: {
        categories: this.yData,
        title: {
          text: '% of Returns'
        },
        labels: {
          style: {
            colors: [
              '#464A53',
            ],
            fontSize: '12px'
          }
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      }
    };

    this.userForm.disable();
  }

  ngOnInit(): void {

  }

  onSubmit(): void { }
}
