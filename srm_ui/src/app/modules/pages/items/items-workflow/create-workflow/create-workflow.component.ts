import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from 'app/shared/app-component-base';
import { WorkflowSchemeDto } from 'app/shared/Services/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-workflow-modal',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss']
})
export class CreateWorkflowComponent extends AppComponentBase implements OnInit  {
  @ViewChild('createWorkflowModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;
  
  active: boolean = false;
    saving: boolean = false;

    scheme: WorkflowSchemeDto = null;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        injector: Injector,
        private router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
    
    }

    show(): void {
        this.active = true;
        this.scheme = new WorkflowSchemeDto();
        this.scheme.init({ });

        this.modal.show();
    }

    onShown(): void {
        $.AdminBSB.input.activate($(this.modalContent.nativeElement));
    }

    save(): void {
        this.router.navigate(['/items/workflow/inner', this.scheme.code]);
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
