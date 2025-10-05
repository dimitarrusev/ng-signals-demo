import { Component, computed, effect, inject, signal, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ReviewService } from '../review.service';
import { ReviewListItem } from './review-list-item/review-list-item';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule, ReviewListItem],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList {
  productService = inject(ProductService);
  reviewService = inject(ReviewService);

  isLoading = this.reviewService.reviewsResource.isLoading;

  // signal that automatically tracks all <app-review-list-item> children.
  // updates whenever the list of rendered rows changes (e.g. product change, filter applied etc.)
  rows = viewChildren(ReviewListItem);

  // effect that runs whenever the rows() signal changes.
  // ensures that after rows are rendered, the first review row's "helpful" button is focused.
  _focusFirst = effect(() => {
    const rows = this.rows();
    if (rows.length) rows[0].focusHelpfulButton();
  });

  // computed signal that calculates the highest "helpful" count across all reviews.
  // used to highlight the row(s) that have the most helpful votes (⭐).
  // recomputes automatically whenever reviews() changes.
  highestHelpfulCount = computed(() => {
    const reviewsArr = this.reviewService.reviews();
    return reviewsArr.length
      ? Math.max(...reviewsArr.map((review) => review.helpfulCount ?? 0))
      : 0;
  });

  // Raw input text
  filterTitle = signal('');

  // Debounced text as a SIGNAL (initially '')
  debouncedTitle = toSignal(
    toObservable(this.filterTitle).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' }
  );

  // Filtered list computed from debounced text + live reviews
  filteredReviews = computed(() => {
    const text = this.debouncedTitle().trim().toLowerCase();
    const reviews = this.reviewService.reviews();
    if (!text) return reviews;
    return reviews.filter((r) => r.title.toLowerCase().includes(text));
  });

  // Clear filter whenever the product changes
  private _resetFilterOnProductChange = effect(() => {
    const currentProductId = this.productService.selectedProduct()?.id ?? null;
    // reading currentProductId makes this effect run whenever the selected product changes
    this.filterTitle.set(''); // clear input & show all reviews
  });
}
