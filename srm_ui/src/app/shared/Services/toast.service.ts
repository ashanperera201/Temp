import { Injectable } from '@angular/core';
import { TYPE } from '../enums/toast.enum';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    showToast = (typeIcon = TYPE.SUCCESS, timerProgressBar: boolean = false, message, timer: number = 1500) => {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            icon: typeIcon,
            timerProgressBar,
            title: message,
            showCloseButton: true,
            focusConfirm: true,
            timer: timer,
        })
    }
}
