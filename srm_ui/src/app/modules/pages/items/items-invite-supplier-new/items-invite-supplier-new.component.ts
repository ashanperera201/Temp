import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InviteSupplier } from '../../../Dto/InviteSupplier';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { IsExists } from 'app/main/Models/IsExists';
import { DeleteDraftSupplier } from 'app/modules/Dto/DeleteDraftSupplier';
import { ProcessConfiguratorService } from 'app/shared/Services/process-configurator.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'items-invite-supplier-new',
    templateUrl: './items-invite-supplier-new.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsInviteSupplierNewComponent implements OnInit, OnDestroy {

    @ViewChild('fileInput') myFileInput: ElementRef;
    @ViewChild('supplierName') supplierNameField: ElementRef;
    @ViewChild("supplierEmail") supplierEmailField: ElementRef;
    public uploaderFile: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadInviteFiles' });

    invite_by: any;
    invite_by_email: any;
    invite_by_role: any;
    inviteSupplier: any;

    files: any = [];
    titleList: string[] = ['Miss', 'Mr', 'Mrs'];

    firstFormGroup: FormGroup;
    supplier_id: number = 0;
    istemp: boolean = true;
    isnameexists: boolean = false;
    isemailexists: boolean = false;
    iscrnoexists: boolean = false;
    istempsave: boolean = false;

    userName: string;
    userEmail: string;
    userRole: string;

    UnSupportFormat: boolean;
    emptyBasicData: boolean;

    panelOpenState = false;

    configForm: FormGroup;
    title_: any;
    issuccess: boolean = false;
    submit_disable: boolean = false;
    isemailsuccess: boolean = false;
    isloading: boolean = false;
    fileName: string;
    output: any;



    destroy$ = new Subject<boolean>();

    constructor(private _formBuilder: FormBuilder, private _fuseConfirmationService: FuseConfirmationService, private http: HttpClient, private router: Router, private processConfiguratorService: ProcessConfiguratorService) {
        this.title_ = "Mr";
        this.loadCurrentUserData();
    }

    ngOnInit(): void {
        this.firstFormGroup = this._formBuilder.group({
            supplierNameFormControl: ['', Validators.required],
            titleFormControl: ['', Validators.required],
            firstNameFormControl: ['', Validators.required],
            lastNameFormControl: ['', Validators.required],
            emailFormControl: ['', [Validators.required]], //, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-z]{2,6})*$/) // Validators.email]],
            justificationFormControl: [''],
            requiredBasicData: ['']
        });
    }

    // Load Current User data
    public loadCurrentUserData() {
        this.invite_by = localStorage.getItem("username");
        this.invite_by_role = localStorage.getItem("userrole");
        this.invite_by_email = localStorage.getItem("useremail");
    }

    // create invite supplier
    public createInviteSupplier() {
        const check = this.firstFormGroup.valid;

        var CreatedDate = new Date().toISOString();
        var CreatedTime = new Date().toTimeString();
        var date_time_split = CreatedDate.split("T");
        var date = date_time_split[0];

        var time_split = CreatedTime.split(" ");
        var time = time_split[0] + "." + new Date().getMilliseconds();

        if (check) {
            this.isloading = true;
            var inviteSupplier: InviteSupplier = new InviteSupplier();
            inviteSupplier.invite_supplier_name = this.firstFormGroup.value.supplierNameFormControl.trim();
            inviteSupplier.email = this.firstFormGroup.value.emailFormControl.trim();
            inviteSupplier.title = this.firstFormGroup.value.titleFormControl;
            inviteSupplier.first_name = this.firstFormGroup.value.firstNameFormControl;
            inviteSupplier.last_name = this.firstFormGroup.value.lastNameFormControl;
            inviteSupplier.justification = this.firstFormGroup.value.justificationFormControl;
            inviteSupplier.create_date_time = date + " " + time;
            inviteSupplier.invite_by = this.invite_by;
            inviteSupplier.invite_by_email = this.invite_by_email;
            inviteSupplier.invite_by_role = this.invite_by_role;

            this.submit_disable = true;
            this.isloading = false;
            this.http.post<any>(environment.nodeurl + '/api/supplier/invite', inviteSupplier).subscribe(async data => {

                if (data > 0) {
                    this.issuccess = true;

                    var count = 0;
                    inviteSupplier.invite_supplier_id = data;

                    if (count == 0 && this.uploaderFile.queue.length != 0) {
                        this.uploaderFile.onBuildItemForm = (fileItem: any, form: any) => {
                            form.append('supplierid', inviteSupplier.invite_supplier_id);

                            fileItem.url = environment.nodeurl + '/api/file/uploadInviteFiles';
                        };

                        this.output = await this.uploaderFile.uploadAll();
                        count = 1;
                    }

                    if (count == 0 && this.uploaderFile.queue.length == 0) {
                        // await this.sleep(9000);

                        this.http.get<any>(environment.nodeurl + '/api/email?email=' + inviteSupplier.email + '&supplierid=' + data + '&content=' + inviteSupplier.justification + '&category=inv').subscribe(async data => {
                            if (data) {
                                this.isloading = false;
                                console.log("mail sent success");
                                // if (this.issuccess) {
                                //     location.replace('items/new-invite-supplier');
                                // }

                                var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                                deleteSupplier.supplier_name = this.firstFormGroup.value.supplierNameFormControl.trim();
                                deleteSupplier.supplier_email = this.firstFormGroup.value.emailFormControl.trim();
                                deleteSupplier.cr_no = "0";
                                deleteSupplier.type = "invite";

                                this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                    if (data2) {
                                        this.isemailsuccess = true;
                                        console.log("deletion success");
                                    }
                                });
                            }
                        })
                    }

                    if (count == 1) {
                        var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                        deleteSupplier.supplier_name = this.firstFormGroup.value.supplierNameFormControl.trim();
                        deleteSupplier.supplier_email = this.firstFormGroup.value.emailFormControl.trim();
                        deleteSupplier.cr_no = "0";
                        deleteSupplier.type = "invite";

                        this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                            if (data2) {
                                this.isemailsuccess = true;
                                console.log("deletion success");
                            }
                        });
                    }
                }
            })
        }
        else {
            this.firstFormGroup.markAllAsTouched();
        }
    }

    // Set waitng timout
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Validation for Supplier name and supplier email
    onKeySearch(event: any, cat: string) {
        if (this.supplier_id == 0) {
            if (cat == 'E') {
                var value = event.target.value;
                if (value != '') {
                    var emailvalue = value.toLowerCase().trim();
                    var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);
                    var res = pattern.test(emailvalue);
                    if (res) {
                        this.executeListing(event.target.value, cat);
                    } else {
                        console.log("invalid email ID");
                        this.firstFormGroup.get('emailFormControl').setErrors({ invalidpattern: true });
                    }
                } else {
                    this.firstFormGroup.get('emailFormControl').setErrors({ required: true });
                }
            }
            else if (cat == 'N') {
                this.executeListing(event.target.value, cat);
            }
        }
        else if (this.supplier_id > 0 && cat == 'E') {
            var value = event.target.value;
            if (value != '') {
                var emailvalue = value.toLowerCase().trim();
                var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);
                var res = pattern.test(emailvalue);
                if (res) {
                    if (this.inviteSupplier.email != this.firstFormGroup.getRawValue().emailFormControl) {
                        this.executeListing(event.target.value, cat);
                    } else {
                        this.firstFormGroup.get('emailFormControl').markAsUntouched();
                    }
                } else {
                    this.firstFormGroup.get('emailFormControl').setErrors({ invalidpattern: true });
                }
            } else {
                this.firstFormGroup.get('emailFormControl').setErrors({ required: true });
            }
        }
        else if (this.supplier_id > 0 && cat == 'N') {
            if (this.inviteSupplier.inviteSupplier_name != this.firstFormGroup.getRawValue().supplierNameFormControl) {
                this.executeListing(event.target.value, cat);
            } else {
                this.firstFormGroup.get('supplierNameFormControl').markAsUntouched();
            }
        }

        if (this.firstFormGroup.value.supplierNameFormControl != '' && this.firstFormGroup.value.emailFormControl != '' &&
            (this.firstFormGroup.controls.emailFormControl.status != 'INVALID' && this.firstFormGroup.controls.supplierNameFormControl.status != 'INVALID')) {

            this.istempsave = true;
        } else {
            this.istempsave = false;
        }
    }

    executeListing(val: string, category: string) {
        var value = val.toLowerCase().trim();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        let options = { headers: headers };
        var body = { value };

        if (value != '' && !(value == 'sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'nadun.ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com' || value == 'evon.reginold@xitricon.com')) {
            var isExist: IsExists = new IsExists();
            isExist.value = value;
            isExist.category = category;

            this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {

                if (data != null && data['status'] != 'Rejected' && data['status'] != 'Draft') {
                    if (category == 'N') {
                        this.isnameexists = true;
                        this.firstFormGroup.get('supplierNameFormControl').setErrors({ invalid: true });
                        // const ele = this.supplierNameField.nativeElement;
                        // if (ele) {
                        //   ele.focus();
                        //   console.log("ele focused");
                        // }
                    } else if (category == 'E') {
                        this.isemailexists = true;
                        this.firstFormGroup.get('emailFormControl').setErrors({ invalid: true });
                        // const ele = this.supplierEmailField.nativeElement;
                        // if (ele) {
                        //   ele.focus();
                        //   console.log("ele focused");
                        // }
                    }
                } else {
                    if (category == 'N') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'N', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.isnameexists = true;
                                this.firstFormGroup.get('supplierNameFormControl').setErrors({ invalid: true });
                                // const ele = this.supplierNameField.nativeElement;
                                // if (ele) {
                                //   ele.focus();
                                //   console.log("ele focused");
                                // }
                            } else {
                                this.isnameexists = false;
                                this.firstFormGroup.get('supplierNameFormControl').markAsUntouched();
                            }
                        });
                    } else if (category == 'E') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.isemailexists = true;
                                this.firstFormGroup.get('emailFormControl').setErrors({ invalid: true });
                                // const ele = this.supplierEmailField.nativeElement;
                                // if (ele) {
                                //   ele.focus();
                                //   console.log("ele focused");
                                // }
                            } else {
                                this.isemailexists = false;
                                this.firstFormGroup.get('emailFormControl').markAsUntouched();
                            }
                        });
                    }
                }
            });
        }
    }

    // Check file type
    onAttachment(event, category) {
        if (this.uploaderFile.queue.length > 1) {
            this.uploaderFile.queue[0].remove()
        }
        if (event.target.files && event.target.files[0]) {
            let type = category;
            var length = this.uploaderFile.queue.length;
            const oldFileItem: FileItem = this.uploaderFile.queue[length - 1];
            this.fileName = oldFileItem.file.name;

            var filetypeposition = oldFileItem.file.name.split('.').length - 1;
            var newFilenameFormat = oldFileItem.file.name.split('.')[filetypeposition];
            var newFilename = '_' + category + '.' + newFilenameFormat;

            if (newFilenameFormat.includes('jpg') || newFilenameFormat.includes('jpeg') || newFilenameFormat.includes('pdf') ||
                newFilenameFormat.includes('png') || newFilenameFormat.includes('txt') || newFilenameFormat.includes('text') ||
                newFilenameFormat.includes('tex') || newFilenameFormat.includes('doc') || newFilenameFormat.includes('docx') ||
                newFilenameFormat.includes('xpd') || newFilenameFormat.includes('rtf') || newFilenameFormat.includes('ods') ||
                newFilenameFormat.includes('csv') || newFilenameFormat.includes('odt') || newFilenameFormat.includes('xlsx') ||
                newFilenameFormat.includes('xlsm') || newFilenameFormat.includes('xls') || newFilenameFormat.includes('xml') ||
                newFilenameFormat.includes('svg') || newFilenameFormat.includes('tif') || newFilenameFormat.includes('tiff') ||
                newFilenameFormat.includes('gif') || newFilenameFormat.includes('bmp') || newFilenameFormat.includes('xhtml') ||
                newFilenameFormat.includes('html') || newFilenameFormat.includes('key') || newFilenameFormat.includes('odp') ||
                newFilenameFormat.includes('pptx') || newFilenameFormat.includes('ppt') || newFilenameFormat.includes('JPG')
                || newFilenameFormat.includes('JPEG') || newFilenameFormat.includes('PDF') ||
                newFilenameFormat.includes('PNG') || newFilenameFormat.includes('TXT') || newFilenameFormat.includes('TEXT') ||
                newFilenameFormat.includes('TEX') || newFilenameFormat.includes('DOC') || newFilenameFormat.includes('DOCX') ||
                newFilenameFormat.includes('XPD') || newFilenameFormat.includes('RTF') || newFilenameFormat.includes('ODS') ||
                newFilenameFormat.includes('CSV') || newFilenameFormat.includes('ODT') || newFilenameFormat.includes('XLSX') ||
                newFilenameFormat.includes('XLSM') || newFilenameFormat.includes('XLS') || newFilenameFormat.includes('XML') ||
                newFilenameFormat.includes('SVG') || newFilenameFormat.includes('TIF') || newFilenameFormat.includes('TIFF') ||
                newFilenameFormat.includes('GIF') || newFilenameFormat.includes('BMP') || newFilenameFormat.includes('XHTML') ||
                newFilenameFormat.includes('HTML') || newFilenameFormat.includes('KEY') || newFilenameFormat.includes('ODP') ||
                newFilenameFormat.includes('PPTX') || newFilenameFormat.includes('PPT')) {

                this.UnSupportFormat = false;
                let file = event.target.files[0];

                if (file == undefined) {
                    this.emptyBasicData = true;
                } else {
                    if (file.size == 0) {
                        this.emptyBasicData = true;
                        this.firstFormGroup.patchValue({ 'requiredBasicData': null });
                    } else {
                        this.emptyBasicData = false;
                    }
                }
            }
            else if (!newFilenameFormat.includes('jpg') || !newFilenameFormat.includes('jpeg') || !newFilenameFormat.includes('pdf') ||
                !newFilenameFormat.includes('png') || !newFilenameFormat.includes('txt') || !newFilenameFormat.includes('text') ||
                !newFilenameFormat.includes('tex') || !newFilenameFormat.includes('doc') || !newFilenameFormat.includes('docx') ||
                !newFilenameFormat.includes('xpd') || !newFilenameFormat.includes('rtf') || !newFilenameFormat.includes('ods') ||
                !newFilenameFormat.includes('csv') || !newFilenameFormat.includes('odt') || !newFilenameFormat.includes('xlsx') ||
                !newFilenameFormat.includes('xlsm') || !newFilenameFormat.includes('xls') || !newFilenameFormat.includes('xml') ||
                !newFilenameFormat.includes('svg') || !newFilenameFormat.includes('tif') || !newFilenameFormat.includes('tiff') ||
                !newFilenameFormat.includes('gif') || !newFilenameFormat.includes('bmp') || !newFilenameFormat.includes('xhtml') ||
                !newFilenameFormat.includes('html') || !newFilenameFormat.includes('key') || !newFilenameFormat.includes('odp') ||
                !newFilenameFormat.includes('pptx') || !newFilenameFormat.includes('ppt') || !newFilenameFormat.includes('JPG') ||
                !newFilenameFormat.includes('JPEG') || !newFilenameFormat.includes('PDF') ||
                !newFilenameFormat.includes('PNG') || !newFilenameFormat.includes('TXT') || !newFilenameFormat.includes('TEXT') ||
                !newFilenameFormat.includes('TEX') || !newFilenameFormat.includes('DOC') || !newFilenameFormat.includes('DOCX') ||
                !newFilenameFormat.includes('XPD') || !newFilenameFormat.includes('RTF') || !newFilenameFormat.includes('ODS') ||
                !newFilenameFormat.includes('CSV') || !newFilenameFormat.includes('ODT') || !newFilenameFormat.includes('XLSX') ||
                !newFilenameFormat.includes('XLSM') || !newFilenameFormat.includes('XLS') || !newFilenameFormat.includes('XML') ||
                !newFilenameFormat.includes('SVG') || !newFilenameFormat.includes('TIF') || !newFilenameFormat.includes('TIFF') ||
                !newFilenameFormat.includes('GIF') || !newFilenameFormat.includes('BMP') || !newFilenameFormat.includes('XHTML') ||
                !newFilenameFormat.includes('HTML') || !newFilenameFormat.includes('KEY') || !newFilenameFormat.includes('ODP') ||
                !newFilenameFormat.includes('PPTX') || !newFilenameFormat.includes('PPT')) {
                this.UnSupportFormat = true;
            }

            if (length > 0) {
                if (!this.UnSupportFormat) {
                    const oldFileItem: FileItem = this.uploaderFile.queue[length - 1];

                    var filetypeposition = oldFileItem.file.name.split('.').length - 1;
                    var newFilenameFormat = oldFileItem.file.name.split('.')[filetypeposition];
                    var newFilename = '_' + category + '.' + newFilenameFormat;

                    const newFile: File = new File([this.uploaderFile.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploaderFile, newFile, null);
                    this.uploaderFile.queue[length - 1] = newFileItem;
                }
            }
        }
    }

    // Remove attachment error message
    removeAttachment() {
        if (this.emptyBasicData == true) {
            this.emptyBasicData = false;
        }
        if (this.UnSupportFormat == true) {
            this.UnSupportFormat = false;
        }
    }

    // Reset Form
    resetForm() {
        this.firstFormGroup.reset();

        this.firstFormGroup.patchValue({
            titleFormControl: "Mr"
        });
    }

    // Navigate to Emergency Supplier Page
    route() {
        this.router.navigate(['items/invite-supplier']);
    }

    // download attached files
    downloadAttachment(category: string, input) {
        var fileURL = "";
        var link = document.createElement('a');
        if (input.files.length == 1) {
            fileURL = URL.createObjectURL(input.files[0]);

            if (category == "BasicData") {
                link.href = fileURL;
                link.download = this.fileName;
                link.click();
            }
        }
    }


    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
