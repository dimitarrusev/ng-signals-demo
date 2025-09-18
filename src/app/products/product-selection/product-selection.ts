import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../product';
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

  useLazyMode = signal(false);

  selectedProduct = this.productService.selectedProduct;
  quantity = linkedSignal({
    source: this.selectedProduct,
    computation: (p) => 1,
  });

  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(() => (this.error() ? this.error()?.message : ''));

  total = computed(() => (this.selectedProduct()?.price ?? 0) * this.quantity());

  lazyTotal = computed(() => {
    console.log('[lazyTotal] recompute');
    const price = this.selectedProduct()?.price ?? 0;
    const qty = this.quantity();
    return price * qty;
  });

  selectedTotal = computed(() => (this.useLazyMode() ? this.lazyTotal() : this.total()));

  color = computed(() => (this.total() > 200 ? 'green' : 'blue'));

  onToggleLazy(e: Event) {
    this.useLazyMode.set((e.target as HTMLInputElement).checked);
  }

  qtyEffect = effect(() => console.log('quantity', this.quantity()));
}
