import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormItem, FormItemOptionItem, FormItemWidget } from '../form-item';
import { environment } from 'environments/environment.prod';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { FormControl } from '@angular/forms';
import { NgxSurveyService } from '../../ngx-survey.service';
import { skip } from 'rxjs/operators';

export class FormItemAttachment extends FormItem {
  value: string;
}

const fileDownloadUrl = environment.nodeurl + '/api/file/formBuilderFile';

@Component({
  selector: 'form-item-attachment',
  templateUrl: './form-item-attachment.component.html',
  styleUrls: ['./form-item-attachment.component.scss']
})
export class FormItemAttrachmentComponent implements FormItemWidget, OnInit {

  @Input() item: FormItemAttachment;
  @Input() editable: boolean = true;
  @Output() changes = new EventEmitter<FormItemAttachment>();
  @Input() enableFileUpload: boolean = false;
  @Input() view: boolean = false;

  @ViewChild('logoFileInput') logoFileInput;

  requiredBasicData = new FormControl('');
  formId: any;

  public fileUploader: FileUploader = new FileUploader({});
  fileName: string;
  UnSupportFormatLogo: boolean;
  emptyFileLogo: boolean;
  subcription: any;

  constructor(public service: NgxSurveyService) { }

  ngOnInit() {
    this.fileName = this.item.value;
  }

  onAfterAddingFile(event: any) {
    if(event && event.target && event.target.files) {
      const file = event.target.files[0];
      this.fileUploader.queue = [];
      this.fileUploader.queue.push(file);
  
      this.fileName = file.name;
      this.item.value = this.fileName;
  
      if (this.enableFileUpload) {
        this.subcription?.unsubscribe();
        this.subcription = this.service.fileUploadObservable.pipe(skip(1)).subscribe(async res => {
          if (res) {
            this.formId = res;
            this.uploadAttachment();
            this.subcription.unsubscribe();
          }
        })
      }
      this.changes.emit(this.item);
    }
  }

  uploadAttachment() {
    this.fileUploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('formId', this.formId);
      form.append('type', 'attachment');
      fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
    };
    this.fileUploader.uploadAll();
  }

  downloadAttachment(type: string, input) {
    var fileURL = "";
    var link = document.createElement('a');

    if (input.files.length == 1 && this.fileUploader.queue.length > 0) {
      fileURL = URL.createObjectURL(input.files[0]);
      link.href = fileURL;
      link.download = this.fileName;
      link.click();
    } else if (this.fileName && this.service.reviewResponseId) {
      this.downloadFromServer(this.service.reviewResponseId + "_attachment_" + this.fileName);
    }
  }

  onRemove = () => {
    this.item.value = '';
    this.fileName = '';
    this.fileUploader.queue = [];
    if (this.logoFileInput && this.logoFileInput.nativeElement) {
      this.logoFileInput.nativeElement.value = ''
    }
    this.fileUploader.clearQueue();
  }

  downloadFromServer(fileName: string) {
    window.location.href = fileDownloadUrl + '?fileName=' + fileName;
  }
}
