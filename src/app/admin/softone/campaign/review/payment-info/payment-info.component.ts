import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-info-payment',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  @Input() data = {};
  @Input() campain = {};
  @Input() buttonSubmit;
  @Input() isShowInfoBank = true;
  @Input() typeShowData = 'fistar';

  @Output() closeP = new EventEmitter();
  @Output() ouputSave = new EventEmitter();
  id_ch;
  sns_id;
  payment;


  form: FormGroup;
  constructor(private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.id_ch = this.data['id_ch'] ? this.data['id_ch'] : '';
    this.sns_id = this.data['sns_id'] ? this.data['sns_id'] : '';
    this.initForm();
    console.log('12312312312312312', this.data['sns_id'], this.data)
  }

  initForm() {
    this.form = this.formbuilder.group(
      {
        payed_date: [this.data['payment'] && this.data['payment']['payed_date'] && this.data['payment']['payed_date'] != null ? this.convertDate(this.data['payment']['payed_date']) : '', [Validators.required]],
        deposit_name: [this.data['payment'] && this.data['payment']['deposit_name'] && this.data['payment']['deposit_name'] != null ? this.data['payment']['deposit_name'] : '', [Validators.required]],
        pay_code: [this.data['payment'] && this.data['payment']['pay_code'] && this.data['payment']['pay_code'] != null ? this.data['payment']['pay_code'] : '', [Validators.required]],
        price: [this.data['payment'] && this.data['payment']['price'] && this.data['payment']['price'] != null ? this.data['payment']['price'] : '', [Validators.required]],
        m_ch_id: this.id_ch,
        type: 1
      }
    );
    this.form.patchValue(this.data);
  }

  setValudeForm(data) {

  }


  close() {
    this.closeP.emit(false);
  }

  save() {
    this.ouputSave.emit(this.form.value);
  }

  convertDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}
