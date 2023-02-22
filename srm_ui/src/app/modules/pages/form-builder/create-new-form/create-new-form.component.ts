/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, HostListener, OnDestroy, ViewEncapsulation } from '@angular/core';
//import { NgxSurveyComponent } from './ngx-surveys/public-api';
import { NgxSurveyComponent } from 'app/modules/pages/form-builder/ngx-survey/public-api';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { FileItem, FileUploader } from 'ng2-file-upload';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import domtoimage from 'dom-to-image';
import { NgxSurveyService } from '../ngx-survey/ngx-survey.service';
import { MatDialog } from '@angular/material/dialog';
import { XitriconPdfPrinterComponent } from '../../../../modules/xitricon-pdf-printer/xitricon-pdf-printer.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CommonService } from 'app/shared/Services/common.service';
import { LocalStorageService } from '../../../../shared/Services/local-storage.service'; //'app/shared/Services/local-storage.service';
import { ReviewFormService } from 'app/shared/Services/review-form.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators'
import html2canvas from 'html2canvas';
import { SupplierReviewConstants } from '../../supplier-reviews/supplier-review-constants';

const ReviewerDetails = [
  { title: 'Reviewer Name', value: '------' },
  { title: 'Role', value: '------' },
  { title: 'Supplier Name', value: '------' },
  { title: 'Review Timeline', value: '------' },
  { title: 'Requested By', value: '------' },
  { title: 'Assigned Date', value: '------' },
];

@Component({
  selector: 'create-new-form',
  templateUrl: './create-new-form.html',
  styleUrls: ['./create-new-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateNewFormComponent implements OnInit, OnDestroy {

  @ViewChild('printRef1') printComponent!: XitriconPdfPrinterComponent;
  @ViewChild('printRef2') printComponent2!: XitriconPdfPrinterComponent;

  @ViewChild('survey', { static: false }) public survey: NgxSurveyComponent;

  nameFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  formTypeFormControl = new FormControl('', [Validators.required]);
  subTitleFormControl = new FormControl('');
  roleFormControl = new FormControl('');
  statusFormControl = new FormControl('');
  createdByFormControl = new FormControl('');
  submittedDateFormControl = new FormControl('');
  requiredBasicData = new FormControl('');

  // PRINT RELATED STUFF.
  printCSS: string[] = ['https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.2.5/angular-material.min.css'];
  printStyle!: string;


  public form: any = [];
  public model = {};
  public formName: string;
  public formType: string;
  public status: string = 'Created';
  public role: string;
  public createdBy: string;
  public submittedDate: string;
  formId: number;
  formData: any = {};
  public logoFileUploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadInviteFiles' });
  logoFileName: string;
  UnSupportFormatLogo: boolean;
  emptyFileLogo: boolean;
  iserror = false;
  errormessage = 'Selection is required';

  public bannerFileUploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadInviteFiles' });
  bannerFileName: string;
  UnSupportFormatBanner: boolean;
  emptyFileBanner: boolean;

  public logoUrl: string;
  public isFormIdFromRoute: boolean;
  autoSaveStatus: string;
  save: any;
  view: boolean = false;
  viewCreate: boolean = true;
  materialTypeForm = SupplierReviewConstants.materialTypeForm;
  serviceTypeForm = SupplierReviewConstants.serviceTypeForm;
  commonTypeForm = SupplierReviewConstants.commonTypeForm;

  services: string[] = [this.materialTypeForm, this.serviceTypeForm, this.commonTypeForm];
  selectedService: string;
  loadingData: any;
  disableForm: boolean = false;
  selectedIndex: number = 0;
  serviceResult: any;
  isActive: any;
  numberOfApprovelsRequired: any;
  disabledSave: boolean = false;


  destroy$ = new Subject<boolean>();

  constructor(
    public service: NgxSurveyService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private elRef: ElementRef,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private reviewFormService: ReviewFormService) {
    route.params.subscribe((params) => {
      this.formId = Number(params['id']);
      this.isFormIdFromRoute = true;
    });
  }

  onFileClick(event) {
    event.target.value = '';
  }

  ngOnInit(): void {
    this.formData.logoUrl = this.service.defaultLogo;
    this.formData.bannerUrl = this.service.defaultBanner;
    this.fetchRecord();
  }

  fetchRecord = () => {
    if (!this.formId) {
      this.formId = JSON.parse(this.localStorageService.getLocalMemory('formId'));
    }

    if (this.formId) {
      this.http.get<any>(environment.nodeurl + '/api/supplier/reviewForm?formId=' + this.formId)
        .subscribe((data) => {
          if (data) {
            this.serviceResult = data;
            this.loadingData = data;
            this.formName = data.name;
            this.role = data.createdUserRole;
            this.status = data.status;
            this.disableForm = this.status === 'Published' ? true : false;
            this.createdBy = data.createdUser;
            this.submittedDate = data.submittedDate;
            this.formType = data.formType;
            this.form = JSON.parse(data.form);

            this.formData.formTitle = data.title;
            this.formData.formSubTitle = data.subtitle;
            this.logoFileName = data.logo;
            this.bannerFileName = data.banner;
            this.formData.logoUrl = this.logoFileName
              ? this.service.fileDownloadUrl + '?fileName=' + this.formId + '_logo_' + this.logoFileName
              : this.service.defaultLogo;
            this.formData.bannerUrl = this.bannerFileName
              ? this.service.fileDownloadUrl + '?fileName=' + this.formId + '_banner_' + this.bannerFileName
              : this.service.defaultBanner;

            this.save = this.status === 'Published' ? true : false;
            this.isActive = data.isActive;
            this.numberOfApprovelsRequired = data.numberOfApprovelsRequired;

          }
        });
    } else {
      this.fetchExistsRecord();
    }
    this.formData.ReviewerDetails = ReviewerDetails;
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    this.autoSave();
  }

  sendApprovel = (status: string) => {
    if (this.serviceResult && this.serviceResult.id) {
      // TODO : WILL INTEGRATE IFS INTEGRATION LATER.
      this.serviceResult.status = status;
      this.serviceResult.numberOfApprovelsRequired = 3;
      this.serviceResult.approvelsReferences = "[\r\n  {\r\n    approverId: 1002,\r\n    approverName: \"Nimal\",\r\n    outcomeId: \"\",\r\n    status: \"\",\r\n    stepNo: 20,\r\n    role: \"Functional Head\",\r\n    type: \"individual\",\r\n    email: \"zauxuquosoigro-8196@yopmail.com\"\r\n  },\r\n  {\r\n    approverId: 1003,\r\n    approverName: \"admin\",\r\n    outcomeId: \"\",\r\n    status: \"\",\r\n    stepNo: 30,\r\n    role: \"SRM Analyst\",\r\n    type: \"individual\",\r\n    email: \"admin@aspnetboilerplate.com\"\r\n  },\r\n  {\r\n    approverId: 1001,\r\n    approverName: \"Nadun\",\r\n    outcomeId: \"\",\r\n    status: \"\",\r\n    stepNo: 10,\r\n    role: \"Supervisor\",\r\n    type: \"individual\",\r\n    email: \"fritomunnera-4349@yopmail.com\"\r\n  }\r\n]";

      this.http.post<any>(environment.nodeurl + '/api/supplier/SaveReviewForm', this.serviceResult).subscribe({
        next: (serviceResult: any) => {
          if (serviceResult) {
            this.formId = this.serviceResult.formId;
            this.pushnotification();
            this.fetchRecord();
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }


  pushnotification = () => {
    let evaluationName = '';
    let createdDate = '';
    let createdUser = 'zauxuquosoigro-8196@yopmail.com';

    evaluationName = 'Form is approved successfully.';
    createdUser = 'Created by: ' + createdUser;
    createdDate = 'Created date: ' + new Date().toDateString();
    var secondcontent = createdUser + ' | ' + createdDate;
    var actionurl = environment.clientUrl + '/supplier-reviews';
    const url = 'https://api.magicbell.com/notifications';

    var body = '';

    body = '{"notification": {"title":"' + evaluationName + '","content": "' + secondcontent + '","category": "new_message","action_url": "' + actionurl + '","recipients": [{"email": "bilal.rifas@gmail.com"}],"custom_attributes": {"order": {"id": "1202983","title": "A title you can use in your templates"}}}}'
    // body = '{"name":"' + this.newRoleFormControl.value + '","description":"' + this.newRoleFormControl.value + '"}';


    let headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'X-MAGICBELL-API-SECRET': 'Kmzcj/AlT6oN8yGjXO6UMeJCdhxIpNyers8zqp6T',
      'X-MAGICBELL-API-KEY': 'e47fd0f1737dffcc6a9c96a4371b642c8ffae8ba'
    });
    let options = { headers: headers };

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log('Here is the Push data');
        console.log(data);

      });
  }


  formItemListeners = () => {
    const reviewForm = {
      'Id': this.formId ? this.formId : 0,
      'name': this.formName,
      'title': this.formData.formTitle,
      'subTitle': this.formData.formSubTitle,
      'form': JSON.stringify(this.form),
      'logo': this.logoFileName,
      'banner': this.bannerFileName,
      'formType': this.formType
    };
    this.localStorageService.storeData('builder-form', JSON.stringify(reviewForm));
  };

  fetchExistsRecord = () => {
    const localMemory = this.localStorageService.getLocalMemory('form-builder-data');
    const reviewForm: any = JSON.parse(this.localStorageService.getLocalMemory('builder-form'));
    if (localMemory && reviewForm) {
      this.form = JSON.parse(localMemory);
      this.formId = reviewForm['Id'];
      this.formName = reviewForm['name'];
      this.formType = reviewForm['formType'];
      this.formData.formTitle = reviewForm['title'];
      this.formData.formSubTitle = reviewForm['subTitle'];
      this.logoFileName = reviewForm['logo'];
      this.bannerFileName = reviewForm['banner'];

    }
  };

  onFormSubmit(value): void {
    alert(JSON.stringify(value, null, 2));
  };

  printComplete() {
    // IF NEEDED PLEASE USE THIS HOOK
  }

  customPrint(print: string) {
    const printHTML: HTMLElement = this.elRef.nativeElement.childNodes[0];
    if (print === 'printRef1') {
      this.printComponent.print(printHTML);
    } else if (print === 'printRef1') {
      this.printComponent2.print();
    }
  }

  setupStylesForPrinter = () => {
    this.printStyle =
      `
    th,
    td {
        color: blue !important;
    }

    h1{
        font-size: 3rem !important;
    }
    `;
  };

  onChange(value): void {
    if (value && value.length > 0) {
      this.form = value;
      this.localStorageService.storeData('form-builder-data', JSON.stringify(this.form));
    } else {
      this.commonService.onFormPass.emit(this.form);
    }
  }

  onChangeEvent(event: MouseEvent): void {
  }

  onValueChange(value: boolean): void {
  }

  saveForm = (status: string) => {
    this.disabledSave = true;
    if (this.formTypeFormControl.valid) {
      this.iserror = false;
      if (this.form[0].title === undefined && status !== 'Created') {
        const data: [] = [];

        data['title'] = 'Error';
        data['message'] = 'Section title can\'t be empty';
        data['dismissible'] = true;
        data['color'] = 'warn';
        data['icon'] = 'heroicons_outline:exclamation';
        this.showPopup(data);
        this.disabledSave = false;
        return;
      }

      this.form.forEach((section) => {
        section.items?.forEach((q) => {
          q.value = '';
        });
      });

      const reviewForm = {
        'Id': this.formId ? this.formId : 0,
        'name': this.formName,
        'title': this.formData.formTitle,
        'subTitle': this.formData.formSubTitle,
        'status': status,
        'form': JSON.stringify(this.form),
        'logo': this.logoFileName,
        'banner': this.bannerFileName,
        'formType': this.formTypeFormControl.value
      };

      this.autoSaveStatus = status;
      const itemWeightage = (JSON.parse(reviewForm.form)).flatMap(x => x.items).flatMap(x => x?.Weightage).filter(Boolean).reduce((x, y) => (+x) + (+y), 0);
      let scoredSections = false;

      JSON.parse(reviewForm.form).forEach((section) => {
        if (section['enableScore']) {
          scoredSections = true;
          return;
        }
      });

      if (itemWeightage != 100 && scoredSections && status !== 'Created') {
        const data: [] = [];
        data['title'] = 'Error';
        data['message'] = 'The sum of weightages must be equal to 100';
        data['dismissible'] = true;
        data['color'] = 'warn';
        data['icon'] = 'heroicons_outline:exclamation';
        this.showPopup(data);
        this.selectedIndex = 0;
        this.disabledSave = false;
        return;
      } else {
        // UDPATE HANDLER
        if (reviewForm && reviewForm.Id) {
          return this.reviewFormService.saveReviewForm(reviewForm).subscribe({
            next: async (data) => {
              this.disabledSave = false;
              await this.onSave(data);
            }
          })
        } else {
          // SAVE HANDLER
          this.reviewFormService.fetchExistsReviewForm(this.formName).pipe(switchMap(existsResult => {
            if (existsResult) {
              const data: [] = [];
              data['title'] = 'Error';
              data['message'] = 'This form already exists in the system';
              data['dismissible'] = true;
              data['color'] = 'warn';
              data['icon'] = 'heroicons_outline:exclamation';
              this.showPopup(data);
              this.removeLocalData();
              this.disabledSave = false;
              return;
            } else {
              return this.reviewFormService.saveReviewForm(reviewForm);
            }
          })).pipe(takeUntil(this.destroy$))
            .subscribe({
              next: async (data) => {
                this.disabledSave = false;
                await this.onSave(data);
              }
            });
        }
      }
    } else {
      this.iserror = true;
    }
  };

  removeLocalData = (): void => {
    this.localStorageService.removeItem('form-builder-data');
    this.localStorageService.removeItem('builder-form');
  }


  onSave = async (data): Promise<void> => {
    this.fetchRecord();
    this.save = true;
    this.formId = data;
    this.logoFileUploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('formId', data);
      form.append('type', 'logo');
      fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
    };
    for (const fileItem of this.logoFileUploader.queue) {
      if (fileItem.file.name !== this.logoFileName) {
        this.logoFileUploader.removeFromQueue(fileItem);
      }
    }
    await this.logoFileUploader.uploadAll();
    this.bannerFileUploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('formId', data);
      form.append('type', 'banner');
      fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
    };
    for (const fileItem of this.bannerFileUploader.queue) {
      if (fileItem.file.name !== this.bannerFileName) {
        this.logoFileUploader.removeFromQueue(fileItem);
      }
    }
    await this.bannerFileUploader.uploadAll();
    this.localStorageService.removeItem('form-builder-data');

    if (this.autoSaveStatus === 'Created' || this.autoSaveStatus === 'Save') {

      const dataPop: [] = [];

      dataPop['title'] = this.autoSaveStatus === 'Created' ? 'Save as draft' : 'Form saved.';
      dataPop['message'] = this.autoSaveStatus === 'Created' ? 'This form successfully saved as draft' : 'This form successfully saved.';
      dataPop['dismissible'] = true;
      dataPop['color'] = 'primary';
      dataPop['icon'] = 'heroicons_outline:check-circle';
      this.showPopup(dataPop);
    }

    if (this.autoSaveStatus === 'Published') {
      const dataPop: [] = [];
      dataPop['title'] = 'Form published';
      dataPop['message'] = 'Form has been successfully published';
      dataPop['dismissible'] = true;
      dataPop['color'] = 'primary';
      dataPop['icon'] = 'heroicons_outline:check-circle';
      this.showPopup(dataPop);
    }
  }

  toPdf() {
    const dashboard: any = document.getElementById('dashboard');
    const dashboardHeight = dashboard.scrollHeight;
    const dashboardWidth = dashboard.scrollWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };
    html2canvas(dashboard).then((imgData: any) => {
      const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('Form.pdf');
    });
  }

  goBack() {
    this.router.navigate(['/form-builder']);
  }

  downloadAttachment(type: string, input) {
    let fileURL = '';
    const link = document.createElement('a');
    if (input.files.length === 1 && (type === 'logo' && this.logoFileUploader.queue.length > 0)) {
      fileURL = URL.createObjectURL(input.files[0]);
      link.href = fileURL;
      link.download = this.logoFileName;
      link.click();
    } else if (input.files.length === 1 && (type === 'banner' && this.bannerFileUploader.queue.length > 0)) {
      fileURL = URL.createObjectURL(input.files[0]);
      link.href = fileURL;
      link.download = this.bannerFileName;
      link.click();
    } else if (type === 'logo' && this.logoFileName) {
      this.downloadFromServer(this.formId + '_logo_' + this.logoFileName);
    } else if (type === 'banner' && this.bannerFileName) {
      this.downloadFromServer(this.formId + '_banner_' + this.bannerFileName);
    }
  }

  onAttachment = (event, input): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        if (input === 'logo') {
          this.logoFileName = file.name;
          this.reviewFormService.logoUploadChange.emit(reader.result);
        }
        if (input === 'banner') {
          this.bannerFileName = file.name;
          this.reviewFormService.bannerUploadChange.emit(reader.result);
        }
      }
    }
  }

  removeFile(type) {
    if (type === 'logo') {
      this.logoFileName = '';
      this.logoFileUploader.clearQueue();
      this.formData.logoUrl = this.service.defaultLogo;
    } else if (type === 'banner') {
      this.bannerFileName = '';
      this.bannerFileUploader.clearQueue();
      this.formData.bannerUrl = this.service.defaultBanner;
    }
  }

  public downloadFromServer(fileName: string) {
    window.location.href = this.service.fileDownloadUrl + '?fileName=' + fileName;
  }

  ngOnDestroy(): void {
    if (!this.save && this.status !== 'Published') {
      this.autoSave();
      this.save = false;
    }

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  autoSave = () => {
    const currentData = this.getFormValues();
    if (this.loadingData !== currentData && this.serviceResult?.status !== 'Published') {
      this.reviewFormService.fetchExistsReviewForm(this.formName).pipe(switchMap(existingResult => {
        if (existingResult) {
          currentData.Id = existingResult.id;
          return this.reviewFormService.updateReviewForm(currentData);
        } else {
          return this.http.post<any>(environment.nodeurl + '/api/supplier/SaveReviewForm', currentData);
        }
      }))
        .subscribe({
          next: (async (serviceRes) => {
            this.localStorageService.storeData('formId', serviceRes);

            this.logoFileUploader.onBuildItemForm = (fileItem: any, form: any) => {
              form.append('formId', serviceRes);
              form.append('type', 'logo');
              fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
            };

            for (const fileItem of this.logoFileUploader.queue) {
              if (fileItem.file.name !== this.logoFileName) {
                this.logoFileUploader.removeFromQueue(fileItem);
              }
            }

            await this.logoFileUploader.uploadAll();
            this.bannerFileUploader.onBuildItemForm = (fileItem: any, form: any) => {
              form.append('formId', serviceRes);
              form.append('type', 'banner');
              fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
            };

            for (const fileItem of this.bannerFileUploader.queue) {
              if (fileItem.file.name !== this.bannerFileName) {
                this.logoFileUploader.removeFromQueue(fileItem);
              }
            }
            await this.bannerFileUploader.uploadAll();
            this.fetchRecord();
          }),
          error: (e) => {
            console.log(e);
          }
        });
    }
  };


  getFormValues = () => {
    return {
      'Id': this.formId ? this.formId : 0,
      'name': this.nameFormControl.value,
      'title': this.titleFormControl.value,
      'subTitle': this.subTitleFormControl.value,
      'status': this.serviceResult ? this.serviceResult.status : 'Created',
      'form': JSON.stringify(this.form),
      'logo': this.logoFileName,
      'banner': this.bannerFileName,
      'formType': this.formTypeFormControl.value,
      'createdUser': this.createdBy,
      'createdUserRole': this.role,
      'isActive': this.isActive,
      'numberOfApprovelsRequired': this.numberOfApprovelsRequired,
      'submittedDate': this.submittedDate,
    };
  };

  showPopup(data) {
    const dialogRef = this._fuseConfirmationService.open({
      title: data.title,
      message:
        data.message,
      icon: {
        show: true,
        name: data.icon,
        color: data.color,
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ok',
          color: data.color,
        },
        cancel: {
          show: false,
          label: 'No',
        },
      },
      dismissible: data.dismissible,
    });
  }

  showPreview(): void {
    this.selectedIndex = 1;
  }

  onTabChanged = (event): void => {
    this.selectedIndex = event.index;
  }
};

