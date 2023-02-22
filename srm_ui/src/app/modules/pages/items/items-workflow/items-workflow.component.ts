import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { WorkflowSchemeDto } from 'app/modules/Dto/WorkflowSchemeDto';
import { PagedListingComponentBase, PagedRequestDto } from 'app/shared/paged-listing-component-base';
import { WorkflowSchemeServiceProxy } from 'app/shared/Services/service-proxies';
import { environment } from 'environments/environment.prod';
import { finalize } from 'rxjs/operators';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';

@Component({
    selector     : 'items-workflow',
    templateUrl  : './items-workflow.component.html'
    // encapsulation: ViewEncapsulation.None
})

export class ItemsWorkflowComponent extends PagedListingComponentBase<WorkflowSchemeDto>
{
	@ViewChild('createWorkflowModal') createWorkflowModal: CreateWorkflowComponent;

    schemes: WorkflowSchemeDto[] = [];

    constructor(private injector:Injector,private workflowSchemeService: WorkflowSchemeServiceProxy,private http: HttpClient,private router: Router) {
        super(injector);
        this.getWFdata();
        this.RemoveAllFilters();
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        
        this.workflowSchemeService.getSchemes()
            .pipe(finalize(() => { finishedCallback() }))
            .subscribe((resultData200)=>{
				this.schemes = resultData200.schemes;
		});
    }

    protected delete(scheme: WorkflowSchemeDto): void {
        this.workflowSchemeService.delete(scheme.code)
                        .pipe(finalize(() => {
                            this.refresh();
                        }))
						.subscribe(() => { });
    }
    
    createScheme(): void {
		this.createWorkflowModal.show();
	}


    editScheme(scheme:WorkflowSchemeDto): void {
		this.router.navigate(['/items/workflow/inner',scheme.code]);
	}

    getWFdata(){
        var wfuser = "admin"
       
        const documentbody =
        {
          "userNameOrEmailAddress": wfuser,
          "password": "123qwe",
          "rememberClient": true
        }
      
        
          let headers = new HttpHeaders({
            'Content-Type':'application/json'
          });
          let options = { headers: headers };
          
          this.http.post(environment.workflowApiUrl+'/api/TokenAuth/Authenticate',documentbody,options)
            .subscribe(data => {
                var workflowToken = data["result"].accessToken;
                localStorage.setItem('apiTokenworkflow',workflowToken);
            });
      }
      
      RemoveAllFilters(){
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfiltertags');
        localStorage.removeItem('allfilter-e');
        localStorage.removeItem('kpifilter');
      }
}
