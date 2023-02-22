import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { RolesService } from '../../../shared/Services/roles.service';

@Component({
  selector: 'landing-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent {
  profileSet: any = [];
  isReady: boolean = false;

  /**
   * Constructor
   */
  constructor(public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService) {
    this.auth.user$.subscribe(
      async (profile) => (
        this.profileSet = profile,
        this.isAuthenticated(),
        this.isReadyButton()
      )

    );



  }

  ngOnInit(): void {
    this.setInternalUser();
  }

  setInternalUser() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['intn']) {
        let isInternal = JSON.parse(params['intn']);
        localStorage.setItem("intn-usr", isInternal);
      }
    });
  }

  async isReadyButton() {
    await this.sleep(1000);
    this.isReady = true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isAuthenticated() {

    if (this.profileSet == null) {

      console.log('not authenticated');





    } else {

      console.log('authenticated');

      // TODO : LOAD ALL THE ROLES PERMISSIONS AND SET.
      location.replace("/dashboard");




      // location.replace("/supplier/dashboard");



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

  loginWithRedirect() {
    if (this.isInternalUser) {
      this.auth.loginWithRedirect(
        {
          connection: 'ImiSrmAuth'
        });
    }
    else {
      // this.auth.loginWithRedirect();
      this.auth.loginWithRedirect({ redirect_uri: 'http://localhost:4200/' });
      //  this.auth.logout({ returnTo: "http://localhost:4200/home" });

    }

  }
}
