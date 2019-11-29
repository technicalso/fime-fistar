import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-review-payment',
  templateUrl: './review-payment.component.html',
  styleUrls: ['./review-payment.component.scss']
})
export class ReviewPaymentComponent implements OnInit {
  @Input() data = {};
  @Output() closeP = new EventEmitter();
  @Input() title = '';
  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }


  close() {
    this.closeP.emit(false);
  }
}
