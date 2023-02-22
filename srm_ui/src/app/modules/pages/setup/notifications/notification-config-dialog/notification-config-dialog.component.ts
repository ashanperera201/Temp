/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

interface SpecificSections {
  viewValue: string; value: string;
}
interface OpenDates {
  viewValue: string; value: string;
}
interface NotificationTrigger {
  viewValue: string; value: string;
}
interface NotificationsSelect {
  viewValue: string; value: string;
}

@Component({
  selector: 'app-notification-config-dialog',
  templateUrl: './notification-config-dialog.component.html',
  styleUrls: ['./notification-config-dialog.component.scss']
})
export class NotificationConfigDialogComponent implements OnInit {

  userForm: FormGroup;
  types: string[] = ['System Notification', 'Email Notification', 'System & Email Notification'];
  mainCategories: string[] = ['RFQ', 'RFAQ', 'SR Form', 'Form Editability', 'PO', 'Receipt', 'ASN', 'Invoice', 'Contract', 'Supplier Performance', 'Form Builder'];
  times: string[] = ['Post', 'Pre', 'Immediate'];
  showPreview: boolean = false;

  /* dropdown inside the form - specific values */
  specificSections: SpecificSections[] = [
    { viewValue: 'Main Section Modules 01', value: 'sainSectionModules01' },
    { viewValue: 'Main Section Modules 02', value: 'sainSectionModules02' },
    { viewValue: 'Main Section Modules 03', value: 'sainSectionModules03' },
  ];

  /* dropdown inside the form - specific values */
  openDates: OpenDates[] = [
    { viewValue: 'Mins', value: 'mins' },
    { viewValue: 'Hours', value: 'hours' },
    { viewValue: 'Days', value: 'days' },
    { viewValue: 'Weeks', value: 'weeks' },
  ];

  /* dropdown inside the form - specific values */
  notificationTrigger: NotificationTrigger[] = [
    { viewValue: 'Bid Open Date', value: 'bidOpenDate' },
    { viewValue: 'Bid Closing Date', value: 'bidClosingDate' },
    { viewValue: 'Event Published Date', value: 'eventPublishedDate' },
    { viewValue: 'Response Received Date', value: 'responseReceivedDate' },
    { viewValue: 'Tech Evaluation Completion', value: 'techEvaluationCompletion' },
    { viewValue: 'Com Evaluation Completion', value: 'comEvaluationCompletion' },
    { viewValue: 'Authorization', value: 'authorization' },
    { viewValue: 'Change Order Approval', value: 'changeOrderApproval' },
    { viewValue: 'Award', value: 'award' },
    { viewValue: 'Now', value: 'now' },
    { viewValue: 'Change Approval ', value: 'changeApproval ' },
    { viewValue: 'Evaluation Approval', value: 'evaluationApproval' },
  ];

  /* dropdown inside the form - specific values */
  notificationsSelect: NotificationsSelect[] = [
    { viewValue: 'Notification tem01', value: 'notificationTemp01' },
    { viewValue: 'Notification tem02', value: 'notificationTemp02' },
    { viewValue: 'Notification tem03', value: 'notificationTemp03' },
    { viewValue: 'Notification tem04', value: 'notificationTemp04' },

  ];


  templateList: any = [
    {
      'templateName': 'notificationTemp01',
      'template':
        { title: 'Reminder on Submission', content: 'Hi Supplier,\nEvent closes in 24 hrs. A gentle reminder to submit the proposal. This is a system generated email and please ignore if already have submitted.' }
    },
    {
      'templateName': 'notificationTemp02',
      'template':
        { title: 'CC02', content: 'DD' }
    },
    {
      'templateName': 'notificationTemp03',
      'template':
        { title: 'EE03', content: 'FF' }
    },
    {
      'templateName': 'notificationTemp04',
      'template':
        { title: 'GG04', content: 'HH' }
    }
  ];
  selectedTemplate: any;
  editBtn: boolean = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
    const type = this.activatedRoute.snapshot.queryParamMap.get('type');
    const user = localStorage.getItem('userfullname') || '';
    this.initializeForm(user);

    if (type === 'view') {
      this.userForm.patchValue({
        notificationName: 'ttt',
        description: 'qwer',
        status: true,
        intendedParty: true,
        types: 'System Notification',
        mainCategory: 'RFQ',
        notificationTriggers: 'authorization',
        timeDue: 'Pre',
        timeDuration: '10',
        timeDurationSelect: 'days',
        recurrance: true,
        recurranceDuration: '5',
        recurranceSelect: 'hours',
        suppliers: true,
        evaluators: false,
        approvers: false,
        collaborationTeam: true,
        sRTeam: true,
        financeTeam: false,
        aPTeam: true,
        notificationType: 'customTitle',
        templateSelect: 'notificationTemp01',
        notificationTitle: 'notificationTemp01',
        notificationContent: 'notification Content test',
        senderName: 'Aruna',
      });
      this.editBtn = true;

      this.userForm.disable();
    } else {

      this.initializeForm(user);
    }


  }

  ngOnInit(): void {

  }

  /* initiating the user form */
  initializeForm(user): void {
    this.userForm = this.fb.group({
      notificationName: [''],
      description: [''],
      status: [false],
      intendedParty: [false],
      types: [],
      mainCategory: [],
      notificationTriggers: [''],
      specificSection: [''],
      timeDue: [''],
      timeDuration: [''],
      timeDurationSelect: [''],
      recurrance: [false],
      recurranceDuration: [''],
      recurranceSelect: [''],
      suppliers: [''],
      evaluators: [''],
      approvers: [''],
      collaborationTeam: [''],
      sRTeam: [''],
      financeTeam: [''],
      aPTeam: [''],
      notificationType: [''],
      templateSelect: [''],
      notificationTitle: [''],
      notificationContent: [''],
      senderName: [user],
    });

    this.userForm.controls['recurranceDuration'].disable();
    this.userForm.controls['recurranceSelect'].disable();
  }

  /* form submit */
  onSubmit(): void {
    console.log(this.userForm.value);
    this.showPreview = true;
  }

  /* form submit */
  goToPreview(): void {
    this.showPreview = true;
  }

  goToNotification(): void {
    const queryParams: any = {};

    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/notifications-config'], navigationExtras);
  }
  goBack(): void {
    this.showPreview = false;
  }


  templateSelected(tempName): void {


    this.selectedTemplate = this.templateList.find((data: any) => data.templateName === tempName);

    this.userForm.patchValue({
      notificationTitle: this.selectedTemplate.template.title,
      notificationContent: this.selectedTemplate.template.content,
    });
  }

  editForm(): void {
    this.userForm.enable();
    this.editBtn = false;
  }

  disabledRecurrance($event): void {
    if ($event.checked) {
      this.userForm.controls['recurranceDuration'].enable();
      this.userForm.controls['recurranceSelect'].enable();
    } else {
      this.userForm.controls['recurranceDuration'].disable();
      this.userForm.controls['recurranceSelect'].disable();
    }
  }
}
