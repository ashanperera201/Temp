import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    convertFileIntoBase64Async = async (file): Promise<string | ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if (reader && reader.result) {
                    resolve(reader.result)
                } else {
                    reject('Failed to convert the file.');
                }
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }

    convertBase64ToFileAsync = async (dataUrl: string, fileName: string): Promise<File> => {
        return new Promise((resolve, reject) => {
            let arr = dataUrl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const createdFile = new File([u8arr], fileName, { type: mime });

            if (createdFile) {
                resolve(createdFile);
            } else {
                reject(createdFile);
            }
        });
    }

}
