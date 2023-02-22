import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ItemsInviteSupplierListComponent } from 'app/modules/common/items-invite-supplier-list/items-invite-supplier-list.component';
import { environment } from 'environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'items-invite-supplier',
    templateUrl: './items-invite-supplier.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsInviteSupplierComponent {
    @ViewChild(ItemsInviteSupplierListComponent) childinv: ItemsInviteSupplierListComponent;
    constructor(private http: HttpClient, private router: Router) {}

    openNewInviteSupplierForm(){
        this.router.navigate(['items/new-supplier-invite']);
    }
}
