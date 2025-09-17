import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-control',
  imports: [],
  templateUrl: './quantity-control.html',
  styleUrl: './quantity-control.css',
})
export class QuantityControl {
  value = input.required<number>();
  valueChange = output<number>();
  inc() {
    this.valueChange.emit(this.value() + 1);
  }
  dec() {
    this.valueChange.emit(Math.max(0, this.value() - 1));
  }
  manual(raw: string) {
    const n = Number(raw);
    this.valueChange.emit(Number.isFinite(n) && n >= 0 ? n : 0);
  }
}
