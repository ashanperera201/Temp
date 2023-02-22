import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DownloadService {

    public constructor(private http: HttpClient) { }

    public downloadFile() {
        this.http.get('http://localhost:34127/api/pdf/CreatePDF', { responseType: 'blob' }).subscribe(blob => {
            ////debugger;
            saveAs(blob, 'SomeFileDownloadName.pdf', {
                type: 'application/pdf;charset=utf-8' // --> or whatever you need here
            });
        });
    }
}