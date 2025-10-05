import { Component, computed, effect, inject, viewChildren } from '@angular/core';
import { ReviewService } from '../review.service';
import { ReviewListItem } from './review-list-item/review-list-item';

@Component({
  selector: 'app-review-list',
  imports: [ReviewListItem],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList {
  reviewService = inject(ReviewService);

  isLoading = this.reviewService.reviewsResource.isLoading;

  rows = viewChildren(ReviewListItem);

  _focusFirst = effect(() => {
    const rows = this.rows();
    if (rows.length) rows[0].focusHelpfulButton();
  });

  highestHelpfulCount = computed(() => {
    const reviewsArr = this.reviewService.reviews();
    return reviewsArr.length
      ? Math.max(...reviewsArr.map((review) => review.helpfulCount ?? 0))
      : 0;
  });
}
