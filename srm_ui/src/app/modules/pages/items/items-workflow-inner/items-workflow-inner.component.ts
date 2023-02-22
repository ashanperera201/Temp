import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'app/shared/app-component-base';
import { environment } from 'environments/environment.prod';

@Component({
    selector: 'items-workflow-inner',
    templateUrl: './items-workflow-inner.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsWorkflowInnerComponent extends AppComponentBase implements OnInit {
    code = undefined;
    processid = undefined;
    apiurl = environment.workflowApiUrl + '/designer/api';
    contentWindow: any;
    offsetY = 160;
    wfdesigner: any;



    constructor(
        injector: Injector,
        private route: ActivatedRoute
    ) {
        super(injector);
        var me = this;
        route.params.subscribe(params => {
            me.code = params["code"];
            if (me.wfdesigner != undefined) {
                me.wfdesignerRedraw();
            }
        });
    }

    ngOnInit(): void {
        var me = this;
        me.contentWindow = window.frames["designer"].contentWindow;
        me.contentWindow.onload = () => {
            me.wfdesignerRedraw();
            window.onresize = function (event) {
                setTimeout(() => {
                    if (me != undefined && me.wfdesigner != undefined) {
                        me.wfdesignerRedraw();
                    }
                }, 500);
            };
        }
    }

    ngOnDestroy() {
        if (this.wfdesigner != undefined) {
            this.wfdesigner.destroy();
        }
    }

    wfdesignerRedraw() {
        let data = undefined;
        if (this.wfdesigner != undefined) {
            data = this.wfdesigner.data;
            this.wfdesigner.destroy();
        }

        var designerFrame = document.getElementById("designer");
        if (designerFrame != undefined) {
            designerFrame.style.height = window.innerHeight - this.offsetY + "px";
        }

        this.wfdesigner = new this.contentWindow["WorkflowDesigner"]({
            name: 'simpledesigner',
            apiurl: this.apiurl,
            renderTo: 'wfdesigner',
            imagefolder: '/assets/workflow/images/',
            graphwidth: this.contentWindow.innerWidth,
            graphheight: this.contentWindow.innerHeight
        });

        if (data == undefined) {
            let isreadonly = false;
            if (this.processid != undefined && this.processid != '')
                isreadonly = true;

            let p = { schemecode: this.code, processid: this.processid, readonly: isreadonly };

            if (this.wfdesigner.exists(p))
                this.wfdesigner.load(p);
            else
                this.wfdesigner.create();
        }
        else {
            this.wfdesigner.data = data;
            this.wfdesigner.render();
        }
    }

    save() {
        this.wfdesigner.schemecode = this.code;
        var err = this.wfdesigner.validate();
        var me = this;
        if (err != undefined && err.length > 0) {
            //me.notify.error(err);
        }
        else {
            this.wfdesigner.save(function () {
                //me.notify.info('The scheme is saved!');
            });
        }
    }

    download() {
        this.wfdesigner.downloadscheme();
    }

    upload() {
        var me = this;
        var uploadFile = window.document.getElementById("uploadFile");
        uploadFile.onchange = function () {
            var url = me.wfdesigner.createurl('uploadscheme');
            var form = window.document.getElementById("uploadform") as HTMLFormElement;
            var formData = new FormData(form);
            var request = new XMLHttpRequest();
            request.open("POST", url);
            request.onload = function (e) {
                me.schemeupload(e.currentTarget);
            };
            request.send(formData);
        }
        uploadFile.click();
    }

    schemeupload(request) {
        var me = this;
        var data = {};
        var content = request.responseText;
        try {
            data = JSON.parse(content);
        }
        catch (exception) {
            //me.notify.error(content);
            return;
        }

        if (data["isError"]) {
            //me.notify.error(data["errorMessage"]);
            return;
        }

        me.wfdesigner.data = data;
        me.wfdesigner.render();
        //me.notify.info('The scheme is uploaded!');
    }
}
