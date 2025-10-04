import { Component, inject } from '@angular/core';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList {
  reviewService = inject(ReviewService);

  isLoading = this.reviewService.reviewsResource.isLoading;

  onHelpful(id: number) {
    this.reviewService.voteHelpful(id);
  }
}
