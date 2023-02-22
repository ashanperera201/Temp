import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { SharedModule } from 'app/shared/shared.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LoginComponent } from './modules/signup/login/login.component';
import { SetupComponent } from './modules/signup/setup/setup.component';
import { ForgetpasswordComponent } from './modules/signup/forgetpassword/forgetpassword.component';
import { ServiceProxyModule } from './shared/Services/service-proxy.module';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DatePipe } from '@angular/common';
import { DataService } from './modules/pages/supplier-reviews/supplier-review-data.service';
import { SupplierReviewService } from './modules/pages/supplier-reviews/supplier-review-common.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './redux/main-reducer';
import { DialogsModule } from './shared/dialogs/dialogs.module';
// import { NgxUiLoaderModule,NgxUiLoaderHttpModule } from 'ngx-ui-loader';

const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SetupComponent,
        ForgetpasswordComponent,
    ],
    imports: [
        // Auth0 config
        AuthModule.forRoot({
            domain: 'dev-ay82ezuy.us.auth0.com',
            clientId: '79aK5td2AnJIMAbxTtUHdNUz7aTHGUAz'
        }),
        BrowserModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        BrowserAnimationsModule,
        NgApexchartsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        MatTableModule,
        // MatPaginator,
        DialogsModule,

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        SharedModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        ServiceProxyModule,
        NgxPermissionsModule.forRoot(),
        StoreModule.forRoot(reducers),
        StoreDevtoolsModule.instrument({
            maxAge: false,
        })
        /* NgxUiLoaderModule,
        NgxUiLoaderHttpModule.forRoot({showForeground:true}) */
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        DatePipe,
        DataService,
        SupplierReviewService,
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
    ]
})
export class AppModule {
}
