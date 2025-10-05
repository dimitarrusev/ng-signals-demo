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
    const reviewsArr = this.reviews();
    const reviewIndex = reviewsArr.findIndex((r) => r.id === id);
    if (reviewIndex < 0) return;

    const updatedReview: Review = {
      ...reviewsArr[reviewIndex],
      helpfulCount: reviewsArr[reviewIndex].helpfulCount + 1,
    };
    const updatedReviews = [...reviewsArr];
    updatedReviews[reviewIndex] = updatedReview;

    this.reviews.set(updatedReviews);
  }

  eff = effect(() => console.log('loading reviews', this.reviewsResource.isLoading()));
}
