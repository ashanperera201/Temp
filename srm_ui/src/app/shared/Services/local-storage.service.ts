import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    storeData = (keyTerm: string, storeValue: string) => {
        localStorage.setItem(keyTerm, storeValue);
    }

    getLocalMemory = (keyTerm: string) => {
        return localStorage.getItem(keyTerm);
    }

    removeItem = (keyTerm: string) => {
        localStorage.removeItem(keyTerm);
    }
}