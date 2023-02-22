import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Observable, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import config from '../../../../auth_management_api_config.json';
import { environment } from 'environments/environment.prod';
import { RolesService } from '../../../shared/Services/roles.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    userrole: string = '';
    notifications: Notification[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    i: number = 1;
    profileSet: any = [];

    // var tokenfromlocalstorage = localStorage.getItem("auth0token");

    apiToken: string;
    fetchedUserRoles: any = [];
    fetchedMyRoleN: any = [];
    accessTokenDetail: any = [];
    noticationData: any = [];
    token: string;
    isOpen: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        public auth: AuthService,
        private http: HttpClient,
        private rolesService: RolesService
    ) {
        this.fetchNotifications();
    }

    ngOnInit(): void {
        this.onRoleChangeListener();
        const token = localStorage.getItem('auth0token');
        if (token) {
            const userRole = localStorage.getItem('userrole');
            if (!userRole) {
                this.onUserSubscription();
            } else {
                this.userrole = userRole;
            }
        } else {
            this.fetchAndAssignUserRole();
        }

        // Subscribe to notification changes
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: Notification[]) => {

                // Load the notifications
                this.notifications = notifications;

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    fetchNotifications() {
        const userRole = localStorage.getItem('userrole');
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        const loggedInUser = userProfile ? userProfile.email : '';
        const url =  environment.nodeurl + '/api/systemNotifications/GetSystemNotifications';
        let params = new HttpParams();
        params = params.append('loggedInUser', loggedInUser);

        const body = '{"loggedInUser":"Admin"}';


        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        const options = { headers: headers };

        // this.http.get(url, body, options)
        this.http.get(url, { params })
          .subscribe((data) => {
            console.log('Here is the Notication');
            this.noticationData = data;
            console.log(this.noticationData);
            // this.accessTokenDetail = data;

            // this.accessTokenDetail = [];
            for (const key in data) {
              this.accessTokenDetail.push(data[key]);
            }

            console.log(this.accessTokenDetail);
            // for (var product of this.accessTokenDetail) {
            console.log(this.accessTokenDetail[0]);
            this.token = this.accessTokenDetail[0];
            // }

            // this.apiToken = 'Bearer'+" "+'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllkOWxDNExmcUpwaTFobmx0WktkNiJ9.eyJpc3MiOiJodHRwczovL2Rldi1heTgyZXp1eS51cy5hdXRoMC5jb20vIiwic3ViIjoiT2drY1NRN1pZTXZhM1JxckQ3MXRGSXRZelZwNmhXT01AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWF5ODJlenV5LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA3OTI2NTM2LCJleHAiOjE2MDgwMTI5MzYsImF6cCI6Ik9na2NTUTdaWU12YTNScXJENzF0Rkl0WXpWcDZoV09NIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.n_UPQjeyjKho_KMB4N-oZeZ8EpohLxAx7qZWpGTd0m8Oj6N5GhNa6KsleTO8pO_8ZZWnBFJrxygMZOV-H6jrY2ICsCvgMVVZ4M9HfYZIEglbtBkQQgNeF369_Ruu2IgXBbtzMy9_gFF0j-97tl8z8KpI7UCmvCvliYT0tuSZHepTGVMAZeOYzNq_a6B-XAtwnwK-D3yNyiNn5UoeQ30afLMvJTT5jVOosKFlrOUscoDP-ZmKKxWkvuGURyKzSsx1RLPY8rFg0npBxWyc-ZiJu_1XeDVVYt9_ooogTiSCPu_k-9a-DgwG6Yyc1eUpNt4WSL3_YFZKSEsToFoJx2Tmug';
            // console.log(this.apiToken);

          });
      }

      pushNotifications() {
        const userId = 'auth0|5f87fcc300dbe80076505906';
        const url =  environment.nodeurl + '/api/systemNotifications/SaveSystemNotification';


        const body = '{"title":"Admin","type":"Admin","status":"Admin","createdDate":"Admin","modifiedDate":"Admin","assignedUser":"Admin","description":"Admin"}';


        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        const options = { headers: headers };

        this.http.post(url, body, options)
          .subscribe((data) => {
            console.log('Here is the Auth0 token');
            console.log(data);
            // this.accessTokenDetail = data;

            // this.accessTokenDetail = [];
            for (const key in data) {
              this.accessTokenDetail.push(data[key]);
            }

            console.log(this.accessTokenDetail);
            // for (var product of this.accessTokenDetail) {
            console.log(this.accessTokenDetail[0]);
            this.token = this.accessTokenDetail[0];
            // }

            // this.apiToken = 'Bearer'+" "+'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllkOWxDNExmcUpwaTFobmx0WktkNiJ9.eyJpc3MiOiJodHRwczovL2Rldi1heTgyZXp1eS51cy5hdXRoMC5jb20vIiwic3ViIjoiT2drY1NRN1pZTXZhM1JxckQ3MXRGSXRZelZwNmhXT01AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWF5ODJlenV5LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA3OTI2NTM2LCJleHAiOjE2MDgwMTI5MzYsImF6cCI6Ik9na2NTUTdaWU12YTNScXJENzF0Rkl0WXpWcDZoV09NIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.n_UPQjeyjKho_KMB4N-oZeZ8EpohLxAx7qZWpGTd0m8Oj6N5GhNa6KsleTO8pO_8ZZWnBFJrxygMZOV-H6jrY2ICsCvgMVVZ4M9HfYZIEglbtBkQQgNeF369_Ruu2IgXBbtzMy9_gFF0j-97tl8z8KpI7UCmvCvliYT0tuSZHepTGVMAZeOYzNq_a6B-XAtwnwK-D3yNyiNn5UoeQ30afLMvJTT5jVOosKFlrOUscoDP-ZmKKxWkvuGURyKzSsx1RLPY8rFg0npBxWyc-ZiJu_1XeDVVYt9_ooogTiSCPu_k-9a-DgwG6Yyc1eUpNt4WSL3_YFZKSEsToFoJx2Tmug';
            // console.log(this.apiToken);

          });
      }

    fetchAndAssignUserRole = () => {
        this.http.get(environment.nodeurl + '/api/file/getAuthToken').pipe(switchMap((tokenResult: any) => {
            if (tokenResult) {
                const auth0Token = tokenResult['result'].split('"')[3];
                this.apiToken = 'Bearer' + ' ' + auth0Token;
                localStorage.setItem('auth0token', this.apiToken);
                return this.auth.user$;
            }
        })).pipe(switchMap((serviceResult: any) => {
            if (serviceResult && serviceResult.sub) {
                return this.fetchUser(serviceResult.sub);
            }
        })).subscribe({
            next: (finalResult: any) => {
                if (finalResult && finalResult.user_metadata) {
                    this.userrole = finalResult.user_metadata.userRole;
                    document.getElementById('p1').innerHTML = this.userrole;
                    localStorage.setItem('userrole', this.userrole);
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    };

    fetchUser = (userId): Observable<any> => {
        const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + userId;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiToken
        });
        const options = { headers: headers };

        return this.http.get(url, options);
    };

    onRoleChangeListener = () => {
        this.rolesService.roleChangeSubject
            .subscribe({
                next: (roleResult: any) => {
                    if (roleResult) {
                        this.userrole = roleResult;
                        document.getElementById('p1').innerHTML = this.userrole;
                    }
                }
            });
    };

    onUserSubscription = () => {
        this.auth.user$.pipe(switchMap((userResult: any) => {
            if (userResult && userResult.sub) {
                return this.fetchUser(userResult.sub);
            }
        })).subscribe({
            next: (finalResult: any) => {
                if (finalResult && finalResult.user_metadata) {
                    this.userrole = finalResult.user_metadata.userRole;
                    document.getElementById('p1').innerHTML = this.userrole;
                    localStorage.setItem('userrole', this.userrole);
                }
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    };

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void {
        this.isOpen = false;
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this.noticationData.forEach(notification => notification.read = true);
    }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notification): void {
        // Toggle the read status
        notification.read = !notification.read;

        // Update the notification
        this._notificationsService.update(notification.id, notification).subscribe();
    }

    /**
     * Delete the given notification
     */
    delete(notification: Notification): void {
        // Delete the notification
        // this._notificationsService.delete(notification.id).subscribe();
        const index = this.noticationData.indexOf(notification.id);
            if (index !== -1) {
                this.noticationData.splice(index, 1);
                console.log(this.noticationData);
            }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition()
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.notifications && this.notifications?.length) {
            count = this.notifications.filter(notification => !notification.read)?.length;
        }

        this.unreadCount = count;
    }


    updateRole = () => {
        console.log('hit inside role call');
        this.userrole = localStorage.getItem('userrole');
        document.getElementById('p1').innerHTML = this.userrole;
    };



    getAllUserRoles() {
        const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub + '/roles';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiToken
        });
        const options = { headers: headers };

        this.http.get(url, options)
            .subscribe((data) => {
                console.log('Here is the Auth0 data');
                console.log(data);
                this.fetchedUserRoles = data;
                if (this.fetchedUserRoles?.length > 0) {
                    this.readUser();

                }
            });
    }

    readUser() {

        const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiToken
        });

        const options = { headers: headers };
        this.http.get(url, options)
            .subscribe((data) => {
                if (data) {
                    this.fetchedMyRoleN = data;
                    this.userrole = this.fetchedMyRoleN.user_metadata.userRole;
                    this.updateRole();
                    localStorage.setItem('userrole', this.userrole);
                    localStorage.setItem('useremail', this.profileSet.email);
                    location.reload();
                }
            });
    }
}
