import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupplierReviewConstants } from 'app/modules/pages/supplier-reviews/supplier-review-constants';

@Component({
    selector       : 'fuse-horizontal-navigation',
    templateUrl    : './horizontal.component.html',
    styleUrls      : ['./horizontal.component.scss'],
    animations     : fuseAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'fuseHorizontalNavigation'
})
export class FuseHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this._fuseUtilsService.randomId();
    @Input() navigation: FuseNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    profileSet: any = [];
    limitingRoles = SupplierReviewConstants.limitingRoles;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseUtilsService: FuseUtilsService,
        private http: HttpClient,
        public auth: AuthService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Navigation
        if ( 'navigation' in changes )
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        if (localStorage.getItem("userrole")){
            if (this.limitingRoles.includes(localStorage.getItem("userrole")?.toLowerCase().replace(/\s/g, ""))){
                        this.navigation = [this.navigation[2]];
                        this.navigation[0].children = [this.navigation[0].children[3]];
                    }
                    // Make sure the name input is not an empty string
                    if ( this.name === '' )
                    {
                        this.name = this._fuseUtilsService.randomId();
                    }

                    // Register the navigation component
                    this._fuseNavigationService.registerComponent(this.name, this);
        }

        else{
            let headers1 = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("auth0token")
              });
              let options1 = { headers: headers1 };
              this.auth.user$.subscribe(
                async (profile) => (
                  this.profileSet = profile,
                  console.log("aaasfs", this.profileSet.sub, options1),
                  this.http.get('https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub, options1).subscribe({
                    next: (data: any) => {
                      if (data) {
                        localStorage.setItem("userrole", data.user_metadata.userRole)
                        setTimeout(() => 
                        {
                            window.location.reload()
                        },
                        5000);
                      }}})  
    
                ))
        }
        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Deregister the navigation component from the registry
        this._fuseNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void
    {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
