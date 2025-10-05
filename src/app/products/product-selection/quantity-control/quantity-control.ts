import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-control',
  imports: [],
  templateUrl: './quantity-control.html',
  styleUrl: './quantity-control.css',
})
export class QuantityControl {
  // input: the current quantity value (comes from parent via signal input)
  value = input.required<number>();

  // output: event emitter to notify parent when quantity changes
  valueChange = output<number>();

  // increase quantity by 1 and emit the new value
  inc() {
    this.valueChange.emit(this.value() + 1);
  }

  // decrease quantity by 1 but never below 0
  dec() {
    this.valueChange.emit(Math.max(0, this.value() - 1));
  }

  // handle manual input from the <input type="number">
  manual(raw: string) {
    const n = Number(raw);
    this.valueChange.emit(Number.isFinite(n) && n >= 0 ? n : 0);
  }
}
