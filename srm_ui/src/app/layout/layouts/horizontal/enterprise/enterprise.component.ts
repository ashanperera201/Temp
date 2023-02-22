import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AuthService } from '@auth0/auth0-angular';
import config from '../../../../../../src/auth_management_api_config.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { IdentitylinkService } from 'app/shared/Services/identitylink.service';
// import { IdentitylinkService } from 'app/services/identitylink.service';
import { DOCUMENT } from '@angular/common';
import { RolesService } from '../../../../shared/Services/roles.service';


@Component({
  selector: 'enterprise-layout',
  templateUrl: './enterprise.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EnterpriseLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: Navigation;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  profileJson: string = null;
  profileSet: any = [];
  // apiToken = 'Bearer' + " " + config.apiToken;
  apiToken = 'Bearer' + " ";
  fetchedMyRoleNew: string = null;
  fetchedMyRoleNewId: string = null;
  fetchedMyRoleNewDetail: string = null;
  fetchedMyRoleN: any = [];
  isAdmin: boolean;
  isAuditor: boolean;
  issrm: boolean = false;
  isauditor: boolean = false;
  selectedMyRole: string;
  selectedMyRoleId: string;
  loggedIn: string = null;
  isloggedIn: boolean = false;
  accessTokenDetail: any = [];
  token: string;
  public tokenresult: any = [];


  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(DOCUMENT) public document: Document,
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    public auth: AuthService,
    private http: HttpClient,
    private identityLinkService: IdentitylinkService,
    private rolesService: RolesService
  ) {
    this.getAuthToken();
    this.auth.user$.subscribe(
      async (profile) => (
        this.profileJson = JSON.stringify(profile, null, 2),
        this.profileSet = profile,
        // this.isAuthenticated(),
        // this.fetchAccessToken(),
        // this.getAuthToken(),
        this.readUser()

      )

    );


  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.setInternalUser();

    // Subscribe to navigation data
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation;
      });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
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
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  get isInternalUser(): boolean {
    let isInternal: boolean = false;
    let storeValue = localStorage.getItem("intn-usr");

    if (storeValue != null && storeValue != "") {
      isInternal = JSON.parse(storeValue);
    }
    return isInternal;
  }

  setInternalUser() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['intn']) {
        let isInternal = JSON.parse(params['intn']);
        localStorage.setItem("intn-usr", isInternal);
      }
    });
  }

  isAuthenticated() {

    if (this.profileSet == null) {

      console.log('not authenticated');

      // location.replace("/home");

      location.replace("/home");



    } else {

      console.log('authenticated');

      // location.replace("/supplier/dashboard");



    }

  }

  clickedRole(id) {
    console.log(id);
    this.selectedMyRoleId = id;
  }

  changeMyRole() {

    // PATCH	/api/v2/users/{id}
    //{ "user_metadata": {} }
    // '{"user_metadata":{"userRole":"tester"}}'
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/
    // const body = '{"user_metadata":{"userRole":"'+this.selectedMyRole+'"}}';
    const body = '{"user_metadata":{"userRole":"' + this.selectedMyRole + '","userRoleId":"' + this.selectedMyRoleId + '","userDetail":"Test"}}';

    var tokenfromlocalstorage = localStorage.getItem("auth0token");

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenfromlocalstorage
    });
    let options = { headers: headers };

    this.http.patch(url, body, options).subscribe({
      next: (serviceResult: any) => {
        if (serviceResult) {
          localStorage.setItem("userrole", this.selectedMyRole);
          localStorage.setItem("useremail", this.profileSet.email);
          if (this.fetchedMyRoleN.given_name) {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.given_name + ' ' + this.fetchedMyRoleN.family_name);
          } else {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.nickname);
          }
          this.rolesService.roleChangeSubject.next(this.selectedMyRole)
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loginWithRedirect() {
    if (this.isInternalUser) {
      this.auth.loginWithRedirect(
        {
          connection: 'ImiSrmAuth'
        });
    }
    else {
      this.auth.loginWithRedirect({ redirect_uri: 'http://localhost:4200/' });
    }
  }



  // loginWithRedirect() {
  //   this.auth.loginWithRedirect();
  // }

  logout() {

    // this.changeMyRoleToAdmin();

    // if (this.isAdmin) {



    //   this.changeMyRoleToAdmin();

    //   this.auth.logout({ returnTo: this.doc.location.origin });



    // } else {

    //   this.auth.logout({ returnTo: this.doc.location.origin });



    // }



    // localStorage.clear();

    // this.auth.logout({ returnTo: document.location.origin })

    location.replace("/home");



  }


  readUser() {
    // https://dev-ay82ezuy.us.auth0.com/api/v2/users/auth0%7C5f87fcc300dbe80076505906/roles
    const url = 'https://dev-ay82ezuy.us.auth0.com/api/v2/users/' + this.profileSet.sub;

    var tokenfromlocalstorage = localStorage.getItem("auth0token");

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': tokenfromlocalstorage
    });
    let options = { headers: headers };

    this.http.get(url, options).subscribe({
      next: (data: any) => {
        if (data) {
          this.fetchedMyRoleN = data;
          this.HandlelinkingUsers(this.fetchedMyRoleN.user_id, this.fetchedMyRoleN.email);

          this.fetchedMyRoleNew = this.fetchedMyRoleN.user_metadata.userRole;
          this.fetchedMyRoleNewId = this.fetchedMyRoleN.user_metadata.userRoleId;
          this.fetchedMyRoleNewDetail = this.fetchedMyRoleN.user_metadata.userDetail;

          localStorage.setItem("userrole", this.fetchedMyRoleNew);
          localStorage.setItem("useremail", this.profileSet.email);
          this.profileSet.userrole = this.fetchedMyRoleNew;
          localStorage.setItem("userProfile", JSON.stringify(this.profileSet));
          localStorage.setItem("username", this.fetchedMyRoleN.nickname);    // set username
          if (this.fetchedMyRoleN.given_name) {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.given_name + ' ' + this.fetchedMyRoleN.family_name);    // set username
          } else {
            localStorage.setItem("userfullname", this.fetchedMyRoleN.nickname);    // set username
          }

          this.getWFdata();
          if (this.auth.isAuthenticated$) {
            localStorage.setItem("isLoggedIn", "true");
            this.isloggedIn = true;
            // set loggedIn
          } else {
            localStorage.setItem("isLoggedIn", "false");    // set loggedOut
            this.isloggedIn = false;

          }
          if (this.fetchedMyRoleNew == 'Admin') {
            this.isAdmin = true;
          }
          else if (this.fetchedMyRoleNew == 'IMI-SRM Analyst') {
            this.issrm = true;
          }
          else if (this.fetchedMyRoleNew == 'IMI-HSEQ') {
            this.isauditor = true;
          }

          this.rolesService.roleChangeSubject.next(this.fetchedMyRoleNew);
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  fetchAccessToken() {
    const url = 'https://dev-ay82ezuy.us.auth0.com/oauth/token';
    const body = '{"client_id":"OgkcSQ7ZYMva3RqrD71tFItYzVp6hWOM","client_secret":"TLpXFHq0D7GG6KwIGrdO2VWU-HFTRDVrk-DZQDg0yx_Emx5Z1ZtxrJVrVWal3ksp","audience":"https://dev-ay82ezuy.us.auth0.com/api/v2/","grant_type":"client_credentials"}';

    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: headers };

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log('Testing for Auth0 token');
        console.log(data);
        for (let key in data) {
          this.accessTokenDetail.push(data[key]);
        }

        console.log(this.accessTokenDetail);
        console.log(this.accessTokenDetail[0]);
        this.token = this.accessTokenDetail[0];
        console.log('Final token taken : ' + this.token);
        // this.apiToken = this.apiToken + this.token;
      });
  }

  async getAuthToken() {
    await this.http.get(environment.nodeurl + '/api/file/getAuthToken').subscribe(async data => {
      //console.log('test data 1 : '+ data['result']);

      // var testing = data['result'].split(`"`); 
      var testing2 = data['result'].split("\"")[2];
      var auth0Token = data['result'].split("\"")[3];
      //console.log("The correct Token from Auth0: " + auth0Token);
      this.apiToken = "Bearer" + " " + auth0Token;
      // console.log("The Token with bearer added from Auth0: " + this.apiToken);

      localStorage.setItem('auth0token', this.apiToken);
      var tokenfromlocalstorage = localStorage.getItem("auth0token");
      // console.log("test 2 " + testing);
      //  console.log("tokenfromlocalstorage : " + tokenfromlocalstorage);

      //console.log('test data 2 : '+ data['result'][2]); 

      //let evalData = JSON.parse(data['result']);
      //console.log('test data 3 : '+ evalData);
      // this.tokenresult = data  
    });

    // console.log('token results data : ' +data);
    console.log('token results: ' + this.tokenresult);

    // this.tokenresult.forEach(element => {
    //             console.log(element);
    // });
  }

  HandlelinkingUsers(currentUserId: string, currentUserEmail: string) {
    let rolesCount: Number = 0;
    let userIdentities: any[];
    let primaryUserId: any;

    if (currentUserId.startsWith("waad", 0)) {
      this.identityLinkService.getRolesCount(currentUserId).then(data => {
        rolesCount = data;

        if (rolesCount == 0) {
          this.identityLinkService.getUsersByEmail(currentUserEmail).subscribe(res => {
            userIdentities = res;
            if (userIdentities && userIdentities.length > 1) {
              userIdentities.forEach(x => {
                let userId: string = x.user_id;
                if (userId.startsWith("auth0", 0)) {
                  primaryUserId = userId;
                  return;
                }
              });

              if (primaryUserId) {
                return this.identityLinkService.linkUsers(primaryUserId, currentUserId).subscribe(result => {
                  console.log(result);
                  if (result.length > 0) {
                    this.doc.location.reload();
                  }
                });
              }
            }
          });
        }

      });
    }
  }

  getWFdata() {
    var wfuser = "admin"
    if (this.profileSet.email == 'admin@aspnetboilerplate.com') {
      wfuser = "admin";
    }
    else {
      wfuser = this.profileSet.email;
    }

    const documentbody =
    {
      "userNameOrEmailAddress": wfuser,
      "password": "123qwe",
      "rememberClient": true
    }


    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    this.http.post(environment.workflowApiUrl + '/api/TokenAuth/Authenticate', documentbody, options)
      .subscribe(data => {
        var workflowToken = data["result"].accessToken;
        localStorage.setItem('apiTokenworkflow', workflowToken);
      });
  }
}
