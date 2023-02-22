import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { NegotiationStyleSearchModel } from 'app/main/Models/etendering/negotiation-style-search-model';
import { NegotiationStyleService } from 'app/shared/Services/etendering/negotiation-style.service';
import { NegotiationStyleViewModel } from 'app/main/Models/etendering/ViewModels/negotiation-style-view-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'attribute-items',
    templateUrl: './negotiation-styles.component.html',
    styleUrls: ['./negotiation-styles.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NegotiationStylesComponent {
    displayedColumns: string[] = ['id', 'name', 'description', 'bidding', 'stage', 'type'];

    negotiationStyleSearchModel: NegotiationStyleSearchModel = new NegotiationStyleSearchModel();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;
    panelOpenState = false;
    message: string = "";
    dataSource: any;

    styleName: string = "";
    description: string = "";
    type: string = "";

    /**
     * Constructor
     */
    constructor(public dialog: MatDialog,
        private negotiationStyleService: NegotiationStyleService) {
        this.negotiationStyleSearchModel.pageSize = 10;
        this.negotiationStyleSearchModel.page = 1;
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.negotiationStyleSearchModel.pageSize = size;
        this.negotiationStyleSearchModel.page = page;
        this.fetchNegotiationStyleData();
    }

    sortData(sort: Sort) {
        this.negotiationStyleSearchModel.direction = sort.direction;
        this.negotiationStyleSearchModel.column = sort.active;
        this.fetchNegotiationStyleData();
    }

    searchData() {
        if (this.styleName && this.styleName != "") {
            this.negotiationStyleSearchModel.name = this.styleName;
        }
        else {
            this.negotiationStyleSearchModel.name = null;
        }

        if (this.description && this.description != "") {
            this.negotiationStyleSearchModel.title = this.description;
        }
        else {
            this.negotiationStyleSearchModel.title = null;
        }

        if (this.type != "") {
            this.negotiationStyleSearchModel.isPrivate = (this.type === "private" ? true : false);
        }
        else {
            this.negotiationStyleSearchModel.isPrivate = null;
        }

        this.fetchNegotiationStyleData();
    }

    fetchNegotiationStyleData() {
        this.negotiationStyleService.getNegotiationStyleList(this.negotiationStyleSearchModel).subscribe(result => {
            this.negotiationStyleSearchModel = result;
        });
    }

    ngOnInit() {
        this.fetchNegotiationStyleData();
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "context": this, "negotiationStyleModels": this.negotiationStyleSearchModel.negotiationStyleModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            this.fetchNegotiationStyleData();
        });
    }

    editNegotiationStyleData(row: any) {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.id, "context": this, "negotiationStyleModels": this.negotiationStyleSearchModel.negotiationStyleModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            this.fetchNegotiationStyleData();
        });
    }

    deleteNegotiationStyleData(model: NegotiationStyleViewModel[]) {
        Swal.fire({
            title: 'Remove Negotiation Style',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.negotiationStyleService.deleteNegotiationStyle([model]).subscribe(result => {
                    Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            this.fetchNegotiationStyleData();
                        }
                    })
                });
            }
        });
    }
}