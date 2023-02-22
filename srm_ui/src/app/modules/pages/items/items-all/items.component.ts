import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ItemDatatableComponent } from 'app/modules/common/item-datatable/item-datatable.component';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ItemsComponent {
  @ViewChild(ItemDatatableComponent) child: ItemDatatableComponent;

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('userrole') == 'Admin') {
      this.getSuppliers();
    } else if(localStorage.getItem('userrole') == 'IMI-HSEQ'){
      this.router.navigate(['/items/tags']);
    } else{
      this.router.navigate(['/items/reportall']);

    }
  }

  async getSuppliers() {
    this.http.get(environment.nodeurl + '/api/supplier/register')
      .subscribe(data => {
        var messagelist = data;

        this.child.filltabledata(messagelist, 'all');

      });

  }
}

