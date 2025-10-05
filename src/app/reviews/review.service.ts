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

  // HTTP resource that loads reviews for the currently selected product.
  // automatically reruns when productId changes.
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

  // signal holding the current list of reviews in memory.
  // acts like local state that components can read/react to.
  reviews = signal<Review[]>([]);

  // effect: whenever the resource fetches new data, update the local reviews signal.
  // keeps reviews() in sync with the backend resource.
  private syncReviewsEffect = effect(() => {
    const data = this.reviewsResource.value();
    if (data) this.reviews.set(data);
  });

  // method to vote a review as helpful. (increments the helpful count for a given review)
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

  // effect: logs whenever the loading state of reviews changes.
  // demonstrates effects reacting to resource signals.
  logLoadingReviewsEffect = effect(() =>
    console.log('loading reviews', this.reviewsResource.isLoading())
  );
}
