import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xitricon-pdf-printer',
  templateUrl: './xitricon-pdf-printer.component.html',
  styleUrls: ['./xitricon-pdf-printer.component.scss']
})
export class XitriconPdfPrinterComponent implements OnInit {

  @Input() mode!: string;
  @Input() standard!: string;
  @Input() popTitle!: string;
  @Input() showBtn!: boolean;
  @Input() btnText!: string;
  @Input() btnClass!: Object;
  @Input() printHTML!: any;
  @Input() printStyle!: string;
  @Input() printCSS!: string[];
  @Output() printComplete!: EventEmitter<any>;

  private modes: any;
  private standards: any;
  private oldBtnText!: string;
  private printWindow!: any;
  private printDoc!: Document;

  constructor() {
    this.modes = {
      iframe: 'iframe',
      popup: 'popup'
    };
    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
    this.mode = this.modes.iframe;
    this.standard = this.standards.html5;
    this.popTitle = '';
    this.showBtn = true;
    this.btnClass = {
      'print-btn': true,
      'print-btn-success': true
    };
    this.popTitle = 'Xitricon Printer';
    this.btnText = 'Print';
    this.oldBtnText = this.btnText;
    this.printComplete = new EventEmitter<any>(false);
  }

  ngOnInit(): void {
  }

  private write = (): any => {
    this.printDoc.open();
    this.printDoc.write(`${this.docType()}${this.getHead()}${this.getBody()}`);
    this.printDoc.close();
  }

  private docType = (): string => {
    if (this.mode === this.modes.iframe) {
      return '';
    }
    if (this.standard === this.standards.html5) {
      return '<!DOCTYPE html>';
    }
    let transitional: string = this.standard === this.standards.loose ? 'Transitional' : '',
      dtd: string = this.standard === this.standards.loose ? 'loose' : 'strict';
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 ${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }

  private getHead = (): string => {
    let styles: string = '',
      links: string = '';

    if (this.printCSS) {
      this.printCSS.forEach((url) => {
        links += `<link href="${url}" rel="stylesheet">`;
      });
    }

    if (this.printStyle) {
      styles = `<style>${this.printStyle}</style>`;
    }
    return `<head><title>${this.popTitle}</title>${styles}${links}</head>`;
  }

  private getBody = () => {
    let html: string = '';
    if (this.printHTML) {
      if (this.printHTML.outerHTML) {
        html = this.printHTML.outerHTML;
      } else {
        html = this.printHTML;
      }
    }
    return `<body><object id="eNgxPrintWB" style="display: none;" height="0" classid="clsid:8856F961-340A-11D0-A96B-00C04FD705A2"></object>${html}</body>`;
  }

  private startPrint = () => {
    const timeoutId = setTimeout(() => {
      this.printWindow.focus();
      let windowRef: any = window;
      if (!!windowRef['ActiveXObject'] || 'ActiveXObject' in window) {
        try {
          this.printWindow['eNgxPrintWB'].ExecWB(7, 1);
        } catch (e) {
          console.error(e);
        }
      } else {
        this.printWindow.print();
      }
      if (this.mode === this.modes.popup) {
        const timeoutId2 = setTimeout(() => {
          clearTimeout(timeoutId2);
          this.printWindow.close();
        }, 500);
      }
      clearTimeout(timeoutId);
      this.printComplete.emit();
      this.btnText = this.oldBtnText;
      this.setInputAndTextareaValue(true);
    }, 1000);
  }


  private createIframe = () => {
    let oldFrame: any = document.getElementsByClassName('xitricon-pdf-printer');
    if (oldFrame.length > 0) {
      oldFrame[0].parentNode.removeChild(oldFrame[0]);
    }
    try {
      let printIframe: any = document.createElement('iframe');
      document.body.appendChild(printIframe);
      printIframe.style.position = 'absolute';
      printIframe.style.border = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.left = '0';
      printIframe.style.top = '0';
      printIframe.style.zIndex = '-1';
      printIframe.className = 'xitricon-pdf-printer';
      this.printWindow = printIframe.contentWindow;
      this.printDoc = printIframe.contentDocument ? printIframe.contentDocument : (printIframe.contentWindow ? printIframe.contentWindow.document : printIframe.document);
    }
    catch (e) {
      throw e + '. iframes may not be supported in this browser.';
    }

    if (!this.printWindow) {
      throw 'Cannot find window.';
    }

    if (!this.printDoc) {
      throw 'Cannot find document.';
    }
  }

  private createPopup = () => {
    let windowAttr = `location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no`;
    windowAttr += `,width=${window.screen.width},height=${window.screen.height};`;
    windowAttr += ',resizable=yes,personalbar=no,scrollbars=yes';
    let newWin: any = window.open('', '_blank', windowAttr);
    this.printWindow = newWin;
    this.printDoc = newWin.document;
  }

  private getPrintWindow = () => {
    if (this.mode === this.modes.iframe) {
      this.createIframe();
    } else if (this.mode === this.modes.popup) {
      this.createPopup();
    }
  }

  print = (printHTML?: any) => {
    this.printHTML = printHTML ? printHTML : this.printHTML;
    if (!this.printHTML.outerHTML) {
      const div: HTMLDivElement = document.createElement('div');
      div.innerHTML = this.printHTML;
      this.printHTML = div;
    }
    this.oldBtnText = this.btnText;
    this.btnText = 'Processing....';
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      this.setInputAndTextareaValue();
      this.getPrintWindow();
      this.write();
      this.startPrint();
    }, 1000);
  }

  setInputAndTextareaValue = (isReset: boolean = false) => {
    const inputs: any = this.printHTML.getElementsByTagName('input');
    const excludeTypes: string[] = ['hidden', 'button', 'reset', 'submit'];
    const textareas: any = this.printHTML.getElementsByTagName('textarea');
    const selects: any = this.printHTML.getElementsByTagName('select');
    this.toArray(inputs).forEach((input: HTMLInputElement) => {
      if (excludeTypes.indexOf(input.type) < 0) {
        if (!isReset) {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (!input.getAttribute('checked') && input.checked) {
              input.setAttribute('isSetValue', 'true');
              input.setAttribute('checked', input.checked + '');
            }
          } else {
            if (!input.getAttribute('value')) {
              input.setAttribute('isSetValue', 'true');
              input.setAttribute('value', input.value);
            }
          }
        } else {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (!!input.getAttribute('isSetValue')) {
              input.removeAttribute('checked');
              input.removeAttribute('isSetValue');
            }
          } else {
            if (!!input.getAttribute('isSetValue')) {
              input.removeAttribute('value');
              input.removeAttribute('isSetValue');
            }
          }
        }
      }
    });
    this.toArray(textareas).forEach((textarea: HTMLTextAreaElement) => {
      if (!isReset) {
        if (!textarea.innerHTML) {
          textarea.setAttribute('isSetHtml', 'true');
          textarea.innerHTML = textarea.value;
        }
      } else {
        if (!!textarea.getAttribute('isSetHtml')) {
          textarea.innerHTML = '';
          textarea.removeAttribute('isSetHtml');
        }
      }
    });
    this.toArray(selects).forEach((select: HTMLSelectElement) => {
      this.toArray(select.selectedOptions).forEach((option: HTMLOptionElement) => {
        if (!isReset) {
          if (!option.getAttribute('selected')) {
            option.setAttribute('isSetValue', 'true');
            option.setAttribute('selected', 'true');
          }
        } else {
          if (!!option.getAttribute('isSetValue')) {
            option.removeAttribute('selected');
            option.removeAttribute('isSetValue');
          }
        }
      });
    });
  }

  toArray = (arr: any): any[] => {
    return arr ? Array.prototype.slice.call(arr, 0) : [];
  }

}
