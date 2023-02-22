import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { renderWidget } from "@magicbell/embeddable/dist/magicbell.esm.js";

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    username: string = null;
    profileSet: any = [];


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild("notifications") myDiv: ElementRef;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        public auth: AuthService
    ) {
        this.auth.user$.subscribe(
            (profile) => (
                this.profileSet = profile
            )
        );
        // this.username = localStorage.getItem("username");

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void {
        // this._router.navigate(['/sign-out']);            
        localStorage.clear();
        // this.auth.logout({ returnTo: document.location.origin })
        // this.auth.logout({ returnTo: "http://localhost:4200/home" });
        this.auth.logout();
        // location.replace("/home");    
    }



    permissionPage(): void {
        this._router.navigate(['/user-permission']);
    }

    profilePage(): void {
        this._router.navigate(['/profile']);
    }

    adminPage(): void {
        this._router.navigate(['/admin-user']);
    }

    helpPage(): void {
        this._router.navigate(['/help']);
    }

    contactPage(): void {
        this._router.navigate(['/contact']);
    }
}
