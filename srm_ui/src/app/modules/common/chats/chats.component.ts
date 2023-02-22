

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component,
    OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation
    , Input, NgZone
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { Chats } from './chats.types';
import { ChatService } from 'app/shared/Services/etendering/Chats/chat.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { saveAs } from 'file-saver';


@Component({
    selector: 'chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'chats'
})
export class ChatsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('supplierPanel') private _supplierPanel: TemplateRef<any>;
    @ViewChild('messagePanel') private _messagePanel: TemplateRef<any>;
    @Input() RFQID: any
    @Input() UnreadCount: any;
    @Input() IsSupplier: boolean;
    SupplierID: any="5336C6EA-D6EE-47B7-9CCC-28ADCD4D0683";
    
    notifications: Chats[];

    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    msgSubject: any = "";
    etMediaId: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
        , private chatService: ChatService
        , private _ngZone: NgZone
        , private termsService: TermsService
        ,private _rfqSupplierService:RfqSupplierService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.RFQID="1236B93B-CA91-43CC-3CB3-08D9D4309BA0";
        this.getNotificationCount();
        const connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(environment.apiUrl + 'notify')
            .build();

        connection.start().then(function () {
            console.log('Chat Connected!');
        }).catch(function (err) {
            return console.error(err.toString());
        });

        connection.on("BroadcastMessage", () => {
            ////debugger;
            this.getNotificationCount();
            

        });
    }
    public unreadCount: any = 0;
    getNotificationCount() {
        this._ngZone.run(() => {
            this.chatService.getRFQCount(this.RFQID).subscribe(result => {
                ////debugger;
                this.unreadCount = result.data;
                this._changeDetectorRef.detectChanges();

            });
            if (this.supplier) {
                if (this.supplier.supplierID) {
                    this.getMessages(this.supplier.supplierID);
                }

            }
            
        });


    }

    public suppliers:any[]=[];

    getMessages(id){
        ////debugger;
        this.chatService.getRFQMessages(this.RFQID,id).subscribe(result => {
            this.notifications=[];
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    result.data[i].messageDateTime = this.toDatetimeLocal(new Date(result.data[i].messageDateTime  + "Z"));
                }
                let uniqueDates = [];
                for (var i = 0; i < result.data.length; i++) {
                    var convertedDate=new Date(result.data[i].messageDateTime);
                    var datesingle=convertedDate.getMonth()+1 + "/" + convertedDate.getDate() + "/" + convertedDate.getFullYear();
                    if(uniqueDates.indexOf(datesingle)==-1)
                    {
                        uniqueDates.push(datesingle);
                    }
                }

                for (var i = 0; i < uniqueDates.length; i++) {
                    let notificationObj: any = { "date": uniqueDates[i], "messages": [] }
                    let messages:any=[];
                    
                    for (var k = 0; k < result.data.length; k++) {
                        var convertedDate = new Date(result.data[k].messageDateTime);
                        var datesingle = convertedDate.getMonth() + 1 + "/" + convertedDate.getDate() + "/" + convertedDate.getFullYear();
                        if (uniqueDates[i]==datesingle) {
                            var time = convertedDate.toLocaleTimeString();
                            var message={"id":result.data[k].id,"isInternal":result.data[k].isInternal,"isAttach":result.data[k].isAttach,"etMessage":result.data[k].subject,"timeOnly":time,  "mediaId": result.data[k].mediaId,"fileExtension":result.data[k].fileExtension };
                            messages.push(message);
                            
                        }
                    }
                    notificationObj.messages=messages;
                    this.notifications.push(notificationObj);

                }
            }
            // this.notifications = result.data;
            this._changeDetectorRef.detectChanges();

        });
       
    }

    toDatetimeLocal(date) {
        var ten = function (i) {
            return (i < 10 ? '0' : '') + i;
        },
            YYYY = date.getFullYear(),
            MM = ten(date.getMonth() + 1),
            DD = ten(date.getDate()),
            HH = ten(date.getHours()),
            II = ten(date.getMinutes()),
            SS = ten(date.getSeconds())
            ;
        return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
    };

    getSuppliers(){
     
        this._rfqSupplierService.getRFQSupplierForChats(this.RFQID).subscribe(result => {
            //debugger;
            this.suppliers = result.data;
        });
    }
    deleteMessage(id)
    {
        this.chatService.deleteMessage(id).subscribe(result => {
            //debugger;
            


        });
    }
    public uploadFile = (files) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe(result => {
            ////debugger;
            if (result["body"] != undefined) {
                ////debugger;
                // this.termsConditionList.get("etMediaId").setValue(result["body"].object[0].id);
                // this.etmedia.fileName=result["body"].object[0].fileName
                // this.termsConditionList.get("etMediaId").setValue(result["body"].object[0].fileName);
                this.etMediaId = result["body"].object[0].id;
                this.msgSubject = result["body"].object[0].fileName


            }
        });

    }
    
      focus(event){
        debugger;
      if(event)
      {
        if(!event.isInternal && !event.isRead)
        {
            var msgObj = { "id": event.id};
            this.chatService.readMessage(msgObj).subscribe(result => {
                
             
    
            });
        }
      }
        
      }

    sendMessage() {
        debugger;
        var msgObj = { "supplierID":this.supplier.supplierID,"subject": this.msgSubject, "rfqId": this.RFQID, "isInternal": true,  "mediaId": this.etMediaId };
        this.chatService.sendMessage(msgObj).subscribe(result => {
            ////debugger;
            this.etMediaId = "";
            this.msgSubject = "";


        });
    }

    showInternal(message) {
        return message.isInternal;
    }
    showExternal(message) {
        return !message.isInternal;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openSupplierPanel(): void {
        if(this.IsSupplier==false)
        {
            this.closePanel();
            this.getSuppliers();
            
            // Return if the notifications panel or its origin is not defined
            if (!this._supplierPanel || !this._supplierPanel) {
                return;
            }
    
            // Create the overlay if it doesn't exist
            if (!this._overlayRef) {
                this._createOverlay();
            }
    
            // Attach the portal to the overlay
            this._overlayRef.attach(new TemplatePortal(this._supplierPanel, this._viewContainerRef));
    
        }
        else{
            this.supplier={"supplierID":this.SupplierID};
            this.openMessagePanel(this.supplier);
        }

    }

    supplier:any;

    getShortName(fullName) { 
        return fullName.split(' ').map(n => n[0]).join('');
      }
    openMessagePanel(obj): void {
        this.supplier=obj;
        this.closePanel();
        this.getMessages(obj.supplierID);
        // Return if the notifications panel or its origin is not defined
        if (!this._messagePanel || !this._messagePanel) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._messagePanel, this._viewContainerRef));


    }

    getMainDivClass(msg) {
        if (msg.isInternal == true) return 'flex justify-end mt-0.5 parent-with-hover-child-btn'
        else return ''
    }
    getFirstDivClass(msg) {
        if (msg.isInternal == true) return 'flex flex-col items-end max-w-3/4'
        else return 'flex flex-col items-start mt-3'
    }
    getSecondDivClass(msg) {
        if (msg.isInternal == true) return 'relative px-3 py-2 rounded-2xl bg-blue-500 text-blue-50'
        else return 'relative max-w-3/4 px-3 py-2 rounded-2xl bg-gray-200 text-gray-500'
    }
    getThirdDivClass(msg) {
        if (msg.isInternal == true) return 'absolute bottom-0 w-3 transform text-blue-500 -right-1 -mr-px mb-px'
        else return 'absolute bottom-0 w-3 transform text-gray-200 -left-1 -ml-px mb-px -scale-x-1'
    }


    getTimeDivClass(msg) {
        if (msg.isInternal == true) return 'my-0.5 text-sm font-medium text-secondary mr-3'
        else return 'my-0.5 text-sm font-medium text-secondary ml-3'
    }

    /**
     * Close the messages panel
     */
    closePanel(): void {
        if (this._overlayRef) {
            this._overlayRef.detach();
        }
        
        
    }

    /**
     * Delete the given notification
     */
    delete(notification: Chats): void {
        // Delete the notification
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: false,
            backdropClass: 'fuse-backdrop-on-mobile',
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition()
                .withPush(true)
                .withPositions([
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])

        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    
     DownloadMediaLines(row) {
        debugger;
        this.DownloadFile(row.mediaId, row.etMessage, row.fileExtension);
    }


    DownloadFile(id, fileName, fileExtension) {
        let eTMedia: any = { id: id }
        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {

            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }
}
