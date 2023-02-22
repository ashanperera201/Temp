import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormItem, FormItemWidget } from '../form-item';

export class FormItemLabel extends FormItem {
  value: boolean;
}

@Component({
  selector: 'form-item-label',
  templateUrl: './form-item-label.component.html',
  styleUrls: ['./form-item-label.component.scss']
})
export class FormItemLabelComponent implements FormItemWidget, OnInit {

  @Input() item: FormItemLabel;
  @Input() editable: boolean = true;
  @Input() view: boolean = false;
  @Output() changes = new EventEmitter<FormItemLabel>();

  constructor() { }

  ngOnInit() {

  }
}
