import { Component, OnInit } from '@angular/core';
import { IEmailTemplate } from 'app/shared/interfaces/email-template.interface';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {

  emailTemplates: IEmailTemplate[];

  constructor() { }

  ngOnInit(): void {
  }

}
