import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ItemsEmergPendingListComponent } from 'app/modules/common/items-emergency-supplier-list/items-emergency-supplier-list.component';
import { environment } from 'environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'items-emergency-supplier',
  templateUrl: './items-emergency-supplier.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ItemsEmergencySupplierComponent {
  @ViewChild(ItemsEmergPendingListComponent) childemg: ItemsEmergPendingListComponent;
  addnewenable:boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    if(localStorage.getItem('userrole')=='IMI-SRM Analyst'){
      this.addnewenable = true;
    }else{
      this.addnewenable = false;
    }
  }

    openNewEmergencySupplierForm(){
        this.router.navigate(['items/new-emergency-supplier']);
    }
  
}
