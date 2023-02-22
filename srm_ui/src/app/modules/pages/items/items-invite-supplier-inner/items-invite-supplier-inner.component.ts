import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { FormBuilder, Validators } from '@angular/forms';
import { IsExists } from 'app/modules/Dto/IsExists';
import { InviteSupplier } from 'app/modules/Dto/InviteSupplier';
import * as moment from 'moment';
import { DeleteInv } from 'app/modules/Dto/DeleteInv';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'items-invite-supplier-inner',
    templateUrl: './items-invite-supplier-inner.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsInviteSupplierInnerComponent {

    @ViewChild("inviteSupplierEmail") inviteSupplierEmail: ElementRef;

    panelOpenState = false;
    formFieldHelpers: string[] = [''];

    inviteSupplierForm: FormGroup;

    supplier_code: any;
    supplier_id: any;
    public photos: any;
    length: number;

    email: string;
    title: any;
    title_value: any;
    first_name: any;
    last_name: any;
    justification: any;
    invite_by: any;
    invite_by_email: any;
    invite_by_role: any;
    create_date_time: any;
    re_invite_by: any;
    re_invite_by_email: any;
    re_invite_by_role: any;
    re_invite_date_time: any;
    name: any;
    istempsave: boolean = false;
    isemailexists: boolean = false;
    link: any;
    new_email: any;

    currentUserRole: string = null;
    currentUserEmail: string = null;
    currentUserName: string = null;

    configForm: FormGroup;
    issuccess: boolean = false;
    isfailed: boolean = false;
    message: any;
    from_where: string;

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private _formBuilder: FormBuilder,
        private router: Router,
        private _fuseConfirmationService: FuseConfirmationService) {
        this.loadCurrentUserData();
        this.supplier_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.from_where = this.activatedRoute.snapshot.paramMap.get('page');

        this.inviteSupplierForm = this._formBuilder.group({
            emailFormControl: ['', [Validators.required]]
        });

        this.link = environment.clientUrl + "/supplier-registration-form/" + parseInt(this.supplier_id) + "/inv";

        this.getInviteSupplierData();
    }

    ngOnInit(): void {
        // Build the config form
        this.configForm = this._formBuilder.group({
            title: 'Delete Invite Supplier',
            message: 'Are you sure you want to delete this supplier permanently?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes, Delete',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });
    }

    // load current user datas from localstorage
    public loadCurrentUserData() {
        this.currentUserName = localStorage.getItem("username");
        this.currentUserRole = localStorage.getItem("userrole");
        this.currentUserEmail = localStorage.getItem("useremail");
    }

    // Get the Invite Supplier's data using the supplier id
    getInviteSupplierData() {
        this.http.get<any>(environment.nodeurl + '/api/supplier/invite?suplierId=' + this.supplier_id).subscribe(data => {
            if (data) {
                this.supplier_code = "IMI-IS-" + this.supplier_id;
                this.name = data[0].invite_supplier_name;
                this.title = data[0].title;
                if (this.title == "Mr") {
                    this.title_value = 1;
                }
                else if (this.title == "Ms") {
                    this.title_value = 2;
                }
                else if (this.title == "Mrs") {
                    this.title_value = 3;
                }

                this.first_name = data[0].first_name;
                this.last_name = data[0].last_name;
                this.email = data[0].email;
                this.justification = data[0].justification;
                this.invite_by = data[0].invite_by;
                this.invite_by_email = data[0].invite_by_email;
                this.invite_by_role = data[0].invite_by_role;
                this.create_date_time = moment(new Date(data[0].create_date_time)).format('YYYY-MM-DD, HH:mm');
                this.re_invite_by = data[0].re_invite_by;
                this.re_invite_by_email = data[0].re_invite_by_email;
                this.re_invite_by_role = data[0].re_invite_by_role;
                this.re_invite_date_time = data[0].re_invite_date_time == "" ? '' : moment(new Date(data[0].re_invite_date_time)).format('YYYY-MM-DD, HH:mm');

                this.inviteSupplierForm.patchValue({
                    emailFormControl: this.email,
                });

                this.getInviteSupplierBasicData();
            }
        });
    }

    // Get Invite Supplier's basic data attachment
    getInviteSupplierBasicData() {
        this.http.get(environment.nodeurl + '/api/file/getInvitePhotos?SupplierId=' + this.supplier_id).subscribe(data => {
            if (data) {
                var file = data['photos'];
                this.photos = file[0];
                this.length = file.length;
            }
        });
    }

    // Download Invite Supplier's Basic Data file
    public download(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadInvite?fileUrl=' + fileUrl;
    }

    // Key search validation
    onKeySearch(event: any, cat: string) {
        if (this.supplier_id > 0 && cat == 'E') {
            var value = event.target.value;
            if (value != '') {
                var emailvalue = value.toLowerCase().trim();
                var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);
                var res = pattern.test(emailvalue);
                if (res) {
                    if (this.email != this.inviteSupplierForm.getRawValue().emailFormControl) {
                        this.executeListing(event.target.value, cat);
                    } else {
                        this.inviteSupplierForm.get('emailFormControl').markAsUntouched();
                    }
                } else {
                    this.inviteSupplierForm.get('emailFormControl').setErrors({ invalidpattern: true });
                }
            } else {
                this.inviteSupplierForm.get('emailFormControl').setErrors({ required: true });
            }
        }
        if (this.inviteSupplierForm.value.emailFormControl != '' && this.inviteSupplierForm.controls.emailFormControl.status != 'INVALID') {
            this.istempsave = true;
        } else {
            this.istempsave = false;
        }
    }

    // Execute validation
    executeListing(val: string, category: string) {
        var value = val.toLowerCase().trim();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        let options = { headers: headers };
        var body = { value };

        if (value != '' && !(value == 'sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'nadun.ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
            var isExist: IsExists = new IsExists();
            isExist.value = value;
            isExist.category = category;

            this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {

                if (data != null && data['status'] != 'Rejected') {
                    if (category == 'E') {
                        this.isemailexists = true;
                        this.inviteSupplierForm.get('emailFormControl').setErrors({ invalid: true });
                    }
                } else {
                    if (category == 'E') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.isemailexists = true;
                                this.inviteSupplierForm.get('emailFormControl').setErrors({ invalid: true });
                            } else {
                                this.isemailexists = false;
                                this.inviteSupplierForm.get('emailFormControl').markAsUntouched();
                            }
                        });
                    }
                }
            });
        }
    }

    // Copy the Invite supplier invite link to clipboard
    copyInviteLink() {
        const check = this.inviteSupplierForm.valid;
        if (check && this.inviteSupplierForm.value.emailFormControl != '' &&
            this.inviteSupplierForm.value.emailFormControl != null &&
            this.inviteSupplierForm.controls.emailFormControl.status != 'INVALID') {
            this.issuccess = true;
            this.message = "Successfully invite supplier invitation link copied";

            setTimeout(() => {
                this.issuccess = false;
            }, 2000);
        }
        else {
            this.inviteSupplierForm.markAllAsTouched();
        }
    }

    // Change email address
    updateEmail() {
        const check = this.inviteSupplierForm.valid;

        var supplier_id = this.supplier_id

        var CreatedDate = new Date().toISOString();
        var CreatedTime = new Date().toTimeString();
        var date_time_split = CreatedDate.split("T");
        var date = date_time_split[0];

        var time_split = CreatedTime.split(" ");
        var time = time_split[0] + "." + new Date().getMilliseconds();

        if (check && this.isemailexists == false) {
            // Swal.fire('Please dont refresh the web browser, we are processing your request!');
            // Swal.showLoading();

            var inviteSupplier: InviteSupplier = new InviteSupplier();
            inviteSupplier.invite_supplier_id = parseInt(supplier_id);
            inviteSupplier.email = this.inviteSupplierForm.value.emailFormControl.trim();
            inviteSupplier.update_date_time = date + " " + time;
            inviteSupplier.update_by = this.currentUserName;
            inviteSupplier.update_by_email = this.currentUserEmail;
            inviteSupplier.update_by_role = this.currentUserRole;

            this.http.post<any>(environment.nodeurl + '/api/supplier/invite', inviteSupplier).subscribe(data => {
                if (data > 0) {
                    this.issuccess = true;
                    this.message = "Successfully Invite supplier email updated";

                    setTimeout(() => {
                        this.issuccess = false;
                    }, 2000);

                    this.getInviteSupplierData();
                }
            });

        }
        else {
            this.inviteSupplierForm.markAllAsTouched();

            if (this.isemailexists == true) {
                this.isfailed = true;
                this.message = "Invite supplier email already taken";

                setTimeout(() => {
                    this.isfailed = false;
                }, 2000);
            }
        }

    }

    // Re-invite an invite supplier
    reinvite() {
        const check = this.inviteSupplierForm.valid;
        var supplier_id = this.supplier_id

        var CreatedDate = new Date().toISOString();
        var CreatedTime = new Date().toTimeString();
        var date_time_split = CreatedDate.split("T");
        var date = date_time_split[0];

        var time_split = CreatedTime.split(" ");
        var time = time_split[0] + "." + new Date().getMilliseconds();

        if (check && this.isemailexists == false && this.inviteSupplierForm.value.emailFormControl != '' && this.inviteSupplierForm.controls.emailFormControl.status != 'INVALID' && this.inviteSupplierForm.get('emailFormControl').hasError('email') == false) {
            var inviteSupplier: InviteSupplier = new InviteSupplier();
            inviteSupplier.invite_supplier_id = parseInt(supplier_id);
            inviteSupplier.email = this.inviteSupplierForm.value.emailFormControl.trim();
            inviteSupplier.re_invite_date_time = date + " " + time;
            inviteSupplier.re_invite_by = this.currentUserName;
            inviteSupplier.re_invite_by_email = this.currentUserEmail;
            inviteSupplier.re_invite_by_role = this.currentUserRole;

            var value = this.email;
            this.new_email = this.inviteSupplierForm.value.emailFormControl.trim().toLowerCase();
            var category = 'E';

            let headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            let options = { headers: headers };
            var body = { value };

            var isExist: IsExists = new IsExists();
            isExist.value = value;
            isExist.category = 'E';

            this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {
                if (data != null && data['status'] != 'Rejected') {
                    if (data['status'] != "INV" && !(this.new_email == 'sooae.cho@imi-ksa.com' || this.new_email == 'muhammed.nauman@imi-ksa.com' || this.new_email == 'nadun.ruchiranga@xitricon.com' || this.new_email == 'chathurya.heshani@xitricon.com' || this.new_email == 'uresha.sewwandi@xitricon.com'|| this.new_email == 'evon.reginold@xitricon.com')) {
                        this.isfailed = true;
                        this.message = "Email is already registered with another supplier";

                        setTimeout(() => {
                            this.isfailed = false;
                        }, 2000);
                    }
                    else {
                        this.http.post<any>(environment.nodeurl + '/api/supplier/invite', inviteSupplier).subscribe(data => {
                            if (data > 0) {
                                // Swal.fire('Successfully added Invite Supplier!', 'Success');
                                this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.email + '&supplierid=' + supplier_id + '&content=null&category=reinv').subscribe(data => {
                                    this.issuccess = true;
                                    this.message = "Successfully reinvition send to the invite supplier";

                                    setTimeout(() => {
                                        this.issuccess = false;
                                    }, 2000);
                                    this.getInviteSupplierData();
                                });
                            }
                        });
                    }
                } else {
                    this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
                        var data = data3;
                        if (data3 != null && Number(data3['Message']) > 0 && !(this.new_email == 'sooae.cho@imi-ksa.com' || this.new_email == 'muhammed.nauman@imi-ksa.com' || this.new_email == 'nadun.ruchiranga@xitricon.com' || this.new_email == 'chathurya.heshani@xitricon.com' || this.new_email == 'uresha.sewwandi@xitricon.com')) {
                            this.isfailed = true;
                            this.message = "Email is already registered with another supplier";

                            setTimeout(() => {
                                this.isfailed = false;
                            }, 2000);
                        } else {
                            this.http.post<any>(environment.nodeurl + '/api/supplier/invite', inviteSupplier).subscribe(data => {
                                if (data > 0) {
                                    // Swal.fire('Successfully added Invite Supplier!', 'Success');
                                    this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.email + '&supplierid=' + supplier_id + '&content=null&category=reinv').subscribe(data => {
                                        this.issuccess = true;
                                        this.message = "Successfully reinvition send to the invite supplier";

                                        setTimeout(() => {
                                            this.issuccess = false;
                                        }, 2000);
                                        this.getInviteSupplierData();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else if (this.inviteSupplierForm.get('emailFormControl').hasError('email') == true) {
            this.isfailed = true;
            this.message = "Invalid invite supplier email";

            setTimeout(() => {
                this.isfailed = false;
            }, 2000);
        }
        else {
            this.isfailed = true;
            this.message = "Please check the invite supplier email";

            setTimeout(() => {
                this.isfailed = false;
            }, 2000);
        }
    }

    // Delete Supplier Popup
    openConfirmationDialog(): void {
        this.configForm.patchValue({
            message: 'Are you sure you want to delete this '+this.supplier_code+' supplier permanently ?'
        });

        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        dialogRef.addPanelClass('confirmation-dialog');
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                var delete_invite: DeleteInv = new DeleteInv();
                delete_invite.supplier_id = parseInt(this.supplier_id);

                this.http.post<any>(environment.nodeurl + '/api/supplier/deleteinv', delete_invite).subscribe(data => {
                    if (data) {
                        this.http.get<any>(environment.nodeurl + '/api/file/deleteInvSupplierFile?supplierid=' + this.supplier_id).subscribe(data => {
                            if (data) {
                                this.router.navigate(['/items/invite-supplier']);
                            }
                        },
                            error => console.log('Error in deleting the invite supplier basic data file!')
                        )
                    }
                },
                    error => console.log('Error in deleting the invite supplier!')
                )
            } else {
                console.log("cancelled");
            }
        });
    }
}