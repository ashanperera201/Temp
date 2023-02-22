import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-scoring-view',
  templateUrl: './scoring-view.component.html',
  styleUrls: ['./scoring-view.component.scss']
})
export class ScoringViewComponent implements OnInit {
  isShow = true;
  isShow2 = true;
  @Input() RFQID:any;
  toggleDisplay() {
      this.isShow = !this.isShow;
  }
  toggleDisplay2() {
      this.isShow2 = !this.isShow2;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
