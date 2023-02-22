import { Directive, OnDestroy, Input, EventEmitter, HostListener, Renderer2, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appDisableAfterClick]'
})
export class DisableAfterClickDirective {

  @Input('appDisableAfterClick') reenableButton: EventEmitter<boolean>;
  subscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostListener('click')
  onClick() {
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  }

  ngOnInit() {
    this.subscription = this.reenableButton.subscribe(value => {
      //debugger;
      console.log('Got the value as ', value);
      if(!value)  this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
  
}