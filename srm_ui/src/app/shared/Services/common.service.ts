import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    onFormPass: EventEmitter<any> = new EventEmitter<any>();
    private dialogOptions: any = null;


    public setDialogOptions = (dialogOptions: any): void => {
        this.dialogOptions = dialogOptions;
    }

    public getDialogOption = () => { 
        return this.dialogOptions;
    }
}