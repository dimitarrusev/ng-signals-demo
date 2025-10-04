import { effect, inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../products/product.service';
import { httpResource } from '@angular/common/http';
import { Review } from './review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsUrl = 'api/reviews';
  private productService = inject(ProductService);

  reviewsResource = httpResource<Review[]>(
    () => {
      const p = this.productService.selectedProduct();
      if (p) {
        return `${this.reviewsUrl}?productId=^${p.id}$`;
      } else {
        return undefined;
      }
    },
    { defaultValue: [] }
  );

  reviews = signal<Review[]>([]);

  private _sync = effect(() => {
    const data = this.reviewsResource.value();
    if (data) this.reviews.set(data);
  });

  voteHelpful(id: number) {
    const arr = this.reviews();
    const idx = arr.findIndex((r) => r.id === id);
    if (idx < 0) return;

    const updated: Review = { ...arr[idx], helpfulCount: arr[idx].helpfulCount + 1 };
    const next = [...arr];
    next[idx] = updated;

    this.reviews.set(next);
  }

  eff = effect(() => console.log('loading reviews', this.reviewsResource.isLoading()));
}
