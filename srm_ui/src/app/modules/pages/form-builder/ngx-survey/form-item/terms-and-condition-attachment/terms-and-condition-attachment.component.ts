import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { FileUploader } from 'ng2-file-upload';
import { FormControl } from '@angular/forms';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NgxSurveyService } from '../../ngx-survey.service';
import { UtilService } from 'app/shared/Services/util.service';
import { FormItem } from '../form-item';

export class TermsAndConditionAttachment extends FormItem {
    value: string;
}

@Component({
    selector: 'app-terms-and-condition-attachment',
    templateUrl: './terms-and-condition-attachment.component.html',
    styleUrls: ['./terms-and-condition-attachment.component.scss']
})
export class TermsAndConditionAttachmentComponent implements OnInit, OnDestroy {


    @Input() item: TermsAndConditionAttachment;
    @Input() editable: boolean = true;
    @Output() changes = new EventEmitter<TermsAndConditionAttachment>();
    @Input() enableFileUpload: boolean = false;
    @Input() view: boolean = false;

    @ViewChild('logoFileInput') logoFileInput;

    requiredBasicData = new FormControl('');
    formId: any;

    public fileUploader: FileUploader = new FileUploader({});
    fileName: string;
    UnSupportFormatLogo: boolean;
    emptyFileLogo: boolean;
    destroy$ = new Subject<boolean>();

    constructor(public service: NgxSurveyService, private utilService: UtilService) { }

    ngOnInit() {
        console.log('FROM XXXXXXXXXXXXX', this.item.value);

        this.fileName = this.item.value;
    }

    onAfterAddingFile = async (event: any): Promise<void> => {
        if (event && event.target && event.target.files) {
            const file = event.target.files[0];
            this.fileUploader.queue = [];
            this.fileUploader.queue.push(file);

            this.fileName = file.name;
            const inputBase64ConvertedFile = await this.utilService.convertFileIntoBase64Async(file);
            this.item.value = JSON.stringify({ fileName: this.fileName, base64: inputBase64ConvertedFile.toString() });

            if (this.enableFileUpload) {
                this.service.fileUploadObservable.pipe(
                    skip(1),
                    takeUntil(this.destroy$))
                    .subscribe({
                        next: (resonse) => {
                            this.formId = resonse;
                            this.uploadAttachment();
                        }
                    })
            }
            this.changes.emit(this.item);
        }
    }



    uploadAttachment = (): void => {
        this.fileUploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('formId', this.formId);
            form.append('type', 'attachment');
            fileItem.url = environment.nodeurl + '/api/file/uploadFormBuilderFiles';
        };
        this.fileUploader.uploadAll();
    }

    downloadAttachment = (type: string, input): void => {
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

    onRemove = (): void => {
        this.item.value = '';
        this.fileName = '';
        this.fileUploader.queue = [];
        if (this.logoFileInput && this.logoFileInput.nativeElement) {
            this.logoFileInput.nativeElement.value = ''
        }
        this.fileUploader.clearQueue();
    }

    downloadFromServer = (fileName: string): void => {
        const baseUrl = `${environment.nodeurl}/api/file/formBuilderFile`;
        window.location.href = `${baseUrl}?fileName=${fileName}`;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
