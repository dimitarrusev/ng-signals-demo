import { Component, input, contentChild, TemplateRef, viewChild, ElementRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Review } from '../../review';
import { ReviewService } from '../../review.service';

@Component({
  selector: 'app-review-list-item',
  imports: [NgTemplateOutlet],
  templateUrl: './review-list-item.html',
  styleUrl: './review-list-item.css',
})
export class ReviewListItem {
  review = input.required<Review>();

  constructor(private reviewService: ReviewService) {}

  helpfulBtn = viewChild<ElementRef<HTMLButtonElement>>('helpfulBtn');

  mostHelpfulTpl = contentChild<TemplateRef<any>>(TemplateRef);

  onHelpful() {
    this.reviewService.voteHelpful(this.review().id);
  }

  focusHelpfulButton() {
    this.helpfulBtn()?.nativeElement?.focus();
  }
}
