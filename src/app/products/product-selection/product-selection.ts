import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';
import { ReviewList } from '../../reviews/review-list/review-list';
import { QuantityControl } from './quantity-control/quantity-control';

@Component({
  selector: 'app-product-selection',
  imports: [FormsModule, CurrencyPipe, QuantityControl, ReviewList],
  templateUrl: './product-selection.html',
  styleUrl: './product-selection.css',
})
export class ProductSelection {
  pageTitle = 'Product Selection';
  private productService = inject(ProductService);

  // signal: whether lazy mode is on (controlled by checkbox in UI)
  useLazyMode = signal(false);

  selectedProduct = this.productService.selectedProduct;
  // linked signal: quantity depends on the selected product
  quantity = linkedSignal({
    source: this.selectedProduct,
    computation: (p) => 1, // reset to 1 when product changes
  });

  // resource: fetch products from backend (simulated by service)
  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(() => (this.error() ? this.error()?.message : ''));

  // computed: calculate total cost
  total = computed(() => (this.selectedProduct()?.price ?? 0) * this.quantity());

  // computed: lazy total only recalculates when asked
  lazyTotal = computed(() => {
    console.log('[lazyTotal] recompute');
    const price = this.selectedProduct()?.price ?? 0;
    const qty = this.quantity();
    return price * qty;
  });

  // computed: picks either lazy or normal total, depending on checkbox
  selectedTotal = computed(() => (this.useLazyMode() ? this.lazyTotal() : this.total()));

  // computed: changes color if total > 20
  color = computed(() => (this.total() > 200 ? 'green' : 'blue'));

  // effect: run when the checkbox changes (toggling lazy mode)
  onToggleLazy(e: Event) {
    this.useLazyMode.set((e.target as HTMLInputElement).checked);
  }

  // effect: log quantity changes
  qtyEffect = effect(() => console.log('quantity', this.quantity()));
}
